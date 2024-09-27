import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register(){
    const [Name, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const type = "Personal"
    const navigate = useNavigate();

    const handleRegister = async (e) => {
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
    <form className=" flex flex-col p-4 shadow-inner rounded-md w-96 h-auto " onSubmit={handleRegister}>
        <h2 className="mb-3 self-center text-4xl">Sign Up</h2>
        
        <label className="mt-3">Full Name</label>
        <input type="text" onChange={(e) => setFullName(e.target.value)} className="border-solid  border-slate-300 border rounded self-stretch"/>
        <label className="mt-3">Email</label>
        <input type="text" onChange={(e) => setEmail(e.target.value)} className="border-solid border-slate-300 border rounded mb-3 self-stretch"/>
        <label className="">Password</label>
        <input type="text" onChange={(e) => setConfirmPassword(e.target.value)} className="border-solid border-slate-300 border rounded mb-3"/>
        <label className="">Confirm Password</label>
        <input type="text" onChange={(e) => setPassword(e.target.value)} className="border-solid border-slate-300 border rounded mb-3"/>
        <span><input type="checkbox"/> I accept the <a href="#" className="text-purple-700">Terms of use</a> and <a href="#" className="text-purple-700">Privacy Policy</a></span>
        <a href="/regCompany" className="my-2 text-purple-700 underline">Company Account?</a>
        <a href="/login" className="my-2 text-purple-700 underline">Already have an account?</a>
        <button className="bg-purple-600 text-white p-2 my-3 rounded shadow-md">Submit</button>
    </form>
    </div>
    </div>    
    )}
