import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import multer from 'multer'
import AWS from 'aws-sdk'
import dotenv from 'dotenv';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client,GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";


dotenv.config("./.env");
const bucket_name = process.env.BUCKETNAME
const app = express();
const port = 3001;

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "InvoiceGenerator",
    password: process.env.PGPASS,
    port: 5432,
});
db.connect();
console.log(process.env.PGPASS);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

app.post("/", async (req,res) => {
    const fullName = req.body.Name
    const email = req.body.email
    const password = req.body.password
    const accounttype = req.body.type
    console.log(fullName, email, password, accounttype);

    try {
    if(!email || !password || !fullName){
        console.log("fill out fields")
        return res.status(400).json("please fill out the fields")
    }
    const emailExists = await db.query("SELECT * FROM accounts WHERE email = $1", [email])
    if(emailExists.rows.length > 0){
        console.log("email already registered")
        return res.status(400).json( "email already registered");
    }
    const hashedpass = await bcrypt.hash(password,10);
    const newUser = await db.query("INSERT INTO accounts (Name,email,password,accounttype) VALUES ($1,$2,$3,$4) RETURNING id",[fullName,email,hashedpass,"Personal"])
    const userID = newUser.rows[0].id
    const token = jwt.sign({userID}, 'your_jwt_secret', {expiresIn: '1h'})
    console.log(token)
    res.status(201).json({token, message: "User registered successfully"});
}
catch(error){
    console.log(error.message)
    res.status(500).json({error: "Server error"});
}
})

const verifyToken = (req,res,next) => {
    try{
        const token = req.header("token");
    
        if(!token){
            return res.status(400).json({error: "Token doesnt exist"})
            console.log("token dont exist")
        }
        const verified = jwt.verify(token,"your_jwt_secret");
        req.user = verified.user
        next(); 
    }
    catch(error){
        console.log(error.message)
    }
}

app.post("/loginuser", async(req,res) => {
    const {email, password} = req.body
    console.log(password)
    
    try {
        const user_cred = await db.query("SELECT * FROM accounts WHERE email = $1", [email]);
        if (user_cred.rows[0].length === 0){
            return res.status(401).json("Invalid credentials")
        }
        console.log(user_cred.rows[0])
        const validpassword = user_cred.rows[0].password 
        const valid = await bcrypt.compare(password, user_cred.rows[0].password)
        console.log(valid)

        if(!valid){
           return res.json("Wrong password")
        }
        const userID = user_cred.rows[0].id
        const token = jwt.sign({userID}, "your_jwt_secret",{expiresIn: "1h"})
        res.json({token, userID})
        
    } catch (error) {
        console.log(error.message)
    }
})

const uploadFile = async(file) => {
    try {
        const file_name = `invoice_${Date.now()}.docx`
        const params = {
            Body: file.buffer,
            Bucket: "am30-invoice-gen",
            Key: file_name
        }
        const command = new PutObjectCommand(params);
        await s3.send(command)
        return file_name
    } catch (error) {
        console.log('AWS Config:', AWS.config.credentials);
        console.log(error);
    }
}

const store = multer.memoryStorage()
const upload = multer({ store });

app.post("/saveinvoice", upload.single('Invoice'), async(req,res) => {
   const userID = req.body.ID
   const invoice = req.file
   try {
    const file_name = await uploadFile(invoice)
    const result = await db.query("INSERT INTO invoices (user_id,file_name) VALUES ($1,$2)",[userID,file_name]);
   } catch (error) {
        console.log("Error saving file",error)
   }
})

app.get("/invoices", async(req,res) => {
    const userID = req.query.userID
    try {
        const result = await db.query("SELECT file_name, created_at FROM invoices WHERE user_id = $1",[userID]);
        
        if(result.rows.length === 0){
            console.log("No Invoices found")
        }
        const invoicewithURL = await Promise.all(
        result.rows.map(async(invoice) => {
            const getObjectParams = {
                Bucket: bucket_name,
                Key: invoice.file_name
            }
        
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return{...invoice,file_url: url}
        })
        )
        res.json(invoicewithURL)
    } catch (error) {
        console.log("Error :",error)
    }
})

app.post("/verify",verifyToken,(req,res) => {
    try {
        res.json(true)
    } catch (error) {
        console.log(error.message)
    }
}) 


app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
})
