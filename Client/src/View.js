import React, { useState, useEffect, useMemo } from 'react';

export default function View(){
const [invoice, setInvoice] = useState([]);
const [previewURL, setPreviewURL] = useState('');
const userID = localStorage.getItem('id');

useEffect(() => {fetchInvoices()},[]);

const fetchInvoices = async() => {
    try {
        const response = await fetch(`http://localhost:3001/invoices?userID=${userID}`);
        if(!response.ok){
            return console.log("Error fetching invoices");
        }
        const data = await response.json();
        setInvoice(data)
        console.log(data)
    } catch (error) {
        console.log("Error: ",error)
    }
}



    return(
        <div className="flex flex-col h-screen">
    <h2 className="text-xl mb-4 ml-6">Invoice History</h2>
    <div className=' border rounded-lg h-3/4 m-3 overflow-y-auto'>
        <ul className="flex flex-col ">
            {invoice.map((invoice, index) => (
                <li key={index} className="flex flex-row justify-between w-full border-b hover:bg-sky-950 group transition ease-in-out duration-300">
                    <span className="text-gray-700 group-hover:bg-sky-950 transition ease-in-out duration-300  group-hover:text-white">Created at: {new Date(invoice.created_at).toLocaleDateString()}</span>
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => setPreviewURL(invoice.file_url)}
                    >
                        Preview Invoice
                    </button>
                </li>
            ))}
        </ul>
    </div>
</div>

)
}