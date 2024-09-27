import react from "react";
import { useNavigate } from "react-router-dom";

export default function Landing(){

    const navigate = useNavigate();
    
    return(
        <div className=" flex flex-row w-full h-screen justify-between">
            <div className="w-[360px] mt-28 pl-5">
                <h1 className="text-7xl font-semibold">Effortless invoicing in seconds</h1>
                <p className="font-extralight mt-8">Create, send, and track professional invoices in minutes. Start invoicing today with our simple, intuitive platform.</p>
                <button onClick={() => navigate("/register")} className="ml-4 mt-10 p-4 px-6 bg-blue-600 rounded-full">Get Started</button>
            </div>
            <div className="w-1/2 mt-40">
                <img className="rounded-[120px] min-w-[600px]" src="./images/undraw_printing_invoices_5r4r (1).png" />
            </div>

        </div>
    )
}