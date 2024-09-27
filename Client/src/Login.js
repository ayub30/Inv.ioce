import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({setAuth}){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:3001/loginuser",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password})
        })

        if(response.ok){
            console.log("Response is ok");
            const data = await response.json();
            localStorage.setItem('token',data.token)
            localStorage.setItem('id',data.userID)
            setAuth(true)
        }
        else{
        console.log("Token wasn't generated") 
    }
}
    return(
    <div className="grid h-screen">
    <div className="self-center justify-self-center">
    <form className=" flex flex-col p-4 shadow-inner rounded-md w-[700px] h-auto " onSubmit={handleLogin}>
        <h3 className="mb-3 self-center text-4xl">Login</h3>
        <label className="mt-3">Email</label>
        <input type="text" onChange={(e) => setEmail(e.target.value)} className="text-black border-solid border-slate-300 border rounded mb-3 px-1 self-stretch"/>
        <label className="">Password</label>
        <input type="password" onChange={(e) => setPassword(e.target.value)} className="text-black px-1  border-solid border-slate-300 border rounded mb-3"/>
        <a href="/register" className="my-2 text-purple-700 underline">Don't have an account?</a>
        <button className="bg-purple-600 text-white p-2 my-3 rounded shadow-md">Login</button>
    </form>
    </div>
    </div>    
    )}
