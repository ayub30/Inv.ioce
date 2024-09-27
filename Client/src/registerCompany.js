import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterCompany()
{
    const [Name, setCompanyName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const type = "Business"
    const navigate = useNavigate();

    const regComp = async(e) => {
        e.preventDefault();

        if(password !== confirmPassword){
            alert("Passwords dont match");
            return;
        }

        const response = await fetch("http://localhost:3001/",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({Name, email, password, type})
        })
        if(response.ok){
            console.log("Response is ok");
            const data = await response.json();
            localStorage.setItem('token',data.token)
            navigate('/form')
        }
        console.log('response not ok') 
}
    
    return(
    <div className="grid h-screen">
    <div className="self-center justify-self-center">
    <form className="bg-gray-100 flex flex-col shadow-inner rounded-md p-5 w-96 h-auto " onSubmit={regComp}>
        <h1 className="mb-3 self-center text-xl">Sign Up</h1>
        <hr/>
        <label className="mt-3">Company Name</label>
        <input type="text" onChange={(e) => setCompanyName(e.target.value)} className="border-solid border-slate-300 border rounded mb-3 self-stretch"/>
        <label className="">Admin Email</label>
        <input type="text" onChange={(e) => setEmail(e.target.value)} className="border-solid border-slate-300 border rounded mb-3 self-stretch"/>
        <label className="">Password</label>
        <input type="text" onChange={(e) => setPassword(e.target.value)} className="border-solid border-slate-300 border rounded mb-3"/>
        <label className="">Confirm Password</label>
        <input type="text" onChange={(e) => setConfirmPassword(e.target.value)} className="border-solid border-slate-300 border rounded mb-3"/>
        <span><input type="checkbox"/> I accept the <a href="#" className="text-purple-700">Terms of use</a> and <a href="#" className="text-purple-700">Privacy Policy</a></span>
        <a href="/" className="my-2 text-purple-700 underline">Personal Account?</a>
        <button className="bg-purple-600 text-white p-2 my-3 rounded shadow-md">Submit</button>
    </form>
    </div>
    </div>    
    )}
