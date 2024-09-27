import React, { useState, useEffect, useMemo } from 'react';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

export default function Form() {

    'https://api.frankfurter.app/latest'
    
    const [Type, setType] = useState('')
    const [Template, setTemplate] = useState(null);
    const [Logo, setLogo] = useState(null);
    const [CompanyName, setCompanyName] = useState('');
    const [Address, setAddress] = useState('');
    const [Postcode, setPostcode] = useState('');
    const [Telephone, setTelephone] = useState('');
    const [Email, setEmail] = useState('');
    const [ToName, setToName] = useState('');
    const [ToAddress, setToAddress] = useState('');
    const [ToCity, setToCity] = useState('');
    const [ToPostcode, setToPostcode] = useState('');
    const [Items, setItems] = useState([{description: '', quantity: 0, unitPrice: 0, cost: 0, currency: null}]);
    const [Message, setMessage] = useState('');
    const [payInfo, setPayInfo] = useState('');
    const [Terms,setTerms] = useState('');
    const [Tax,setTax] = useState(0)
    const [Discount,setDiscount] = useState(0)
    const [Total,setTotal] = useState(0)
    const [Subtotal,setSubtotal] = useState(0)
    const [currentDate,setCurrentDate] = useState(new Date());
    const [Currencies, setCurrencies] = useState([])
    const [Currency,setCurrency] = useState(Currencies[0])
    

    const fetchCurrencies = async() => {
        
        try {
        const result = await fetch('https://api.frankfurter.app/currencies')
        const js = await result.json();
        setCurrencies(Object.keys(js))}
        catch(error){
            console.log('Error Fetching: ',Error)
        }
    }
    useEffect(() => {
        fetchCurrencies();
    },[])

    const handleTypeChange = (e) => {
        setType(e.target.value)
    }

    useEffect(() => {
        console.log('Type: ',Type)
    },[Type])

    const roundtwodecimal = (num) => Math.round(num * 100)/100

    useEffect(() => {
        setItems(Items.map(items => ({...items,currency: Currency})))
    },[Currency])

    const handleCurrency = (e) => {
        setCurrency(e.target.value);
    }
    useEffect(() => {
        console.log('Currency: ',Currency)
    },[Currency])

    const handleItemChange = (index, field, value) => {
        const newItems = [...Items]
        newItems[index][field] = value
        setItems(newItems)
    }
     const addItemRow = (e) => {
        e.preventDefault();
        setItems([...Items, {description: '', quantity: 0, unitPrice: 0, cost: 0, currency: Currency}])
     }
     const deleterow = (e) => {
        e.preventDefault();
        setItems(Items.slice(0,-1))
     }

    
    const ItemsCost = useMemo(() => { return Items.map(items => ({
        ...items,
        cost: roundtwodecimal(parseFloat(items.unitPrice)*parseFloat(items.quantity))
    }))},[Items])
    

     useEffect(() => {
        const CalcSubTotal = () => {
        const subtotal = ItemsCost.reduce((sum,item) => sum + item.cost,0)
        roundtwodecimal(CalcSubTotal)
        setSubtotal(subtotal)}
        CalcSubTotal();

     },[Items])

     useEffect(() => {
        let TotalCost = ItemsCost.reduce((sum,items) => sum + items.cost,0);
        TotalCost *= (parseFloat(Tax)/100)+1
        TotalCost *= 1-(parseFloat(Discount)/100)
        setTotal(roundtwodecimal(TotalCost))
     },[Tax,Discount,Subtotal])


     useEffect(() => {
      console.log('Use effect running')
      fetch('./templates/BusinessInvoiceBasic.docx')
     .then(response => {
        return response.blob();})
     .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
            
            setTemplate(reader.result);
        }
        reader.readAsBinaryString(blob);
     }).catch(error => console.log('Failed to load', error))
    }, [])

    const submit = async(e) => {
    e.preventDefault()
    const TodayDate = currentDate.toLocaleDateString()
    try{
        const zip = new PizZip(Template);
        console.log('zip:',zip)
        const doc = new Docxtemplater(zip,{
            paragraphLoop: true,
            linebreaks: true
        });
    console.log('doc: ',doc)
        doc.render({

            Company: CompanyName,
            ToName: ToName,
            ToStreetAddress: ToAddress,
            ToCity: ToCity,
            ToPostcode: ToPostcode,
            PaymentInstructions: payInfo,
            Item: ItemsCost,
            Subtotal: Subtotal,
            Telephone: Telephone,
            StreetAddress: Address,
            YourPostcode: Postcode,
            Email: Email,
            Tax: Tax,
            Discount: Discount,
            TotalDue: Total,
            Date: TodayDate,
            isInvoice: Type === 'Invoice',
            isQuote: Type === 'Quote',
            Message: Message,
            Terms: Terms,
            Currency: Currency


     })
        console.log('doc successfully rendered')
        const file = doc.getZip().generate({
            type: 'blob',
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        })
        saveAs(file,"CompletedInvoice.docx")

        const invoice = new File([file],"CompletedInvoice.docx")

        const formData = new FormData();
        formData.append('Invoice', invoice)
        formData.append('ID', localStorage.getItem("id"))
        console.log(formData.ID,formData.Invoice)

        const response = await fetch("http://localhost:3001/saveinvoice",{
            method: "POST",
            body: formData
            
        })
        if (response.ok){
            console.log("Invoices has been saved")
        }
        else{
            console.log("Invoice hasn't been saved")
        }

    }
    catch(error){
        console.log('error rendering file',error)
    }}
     
    
    

    return(
        
        <div className='grid grid-rows-[70px,100vh] grid-cols-[100%]'>
            <div className="flex justify-center space-x-0.5">
                                <label className="inline-flex items-center bg-transparent">
                                    <input type="radio" name="form" value="Invoice" checked={Type === 'Invoice'} onChange={handleTypeChange} className="hidden" />
                                    <span className={`py-2 cursor-pointer h-10 bg-slate-50 text-center rounded-l-full hover:rounded-l-full w-[200px] hover:bg-slate-500 transition ease-in-out duration-300 hover:text-white ${ Type === 'Invoice' ? 'bg-slate-500 text-white' : 'bg-slate-50 text-black'}`}>Invoice</span>
                                </label>
                                <label className="inline-flex items-center bg-transparent">
                                    <input type="radio" name="form" value="Quote" checked={Type === 'Quote'} onChange={handleTypeChange} className="hidden" />
                                    <span className={` py-2 cursor-pointer h-10 bg-slate-50 text-center rounded-r-full hover:rounded-r-full w-[200px] hover:bg-slate-500 transition ease-in-out duration-300 hover:text-white ${ Type === 'Quote' ? 'bg-slate-500 text-white' : 'bg-slate-50 text-black'}`}>Quote</span>
                                </label>
            </div>

                    
            <div id='form div' className='grid grid-rows-[450px, h-auto, 500px] grid-cols-[100%]'>


                    <div id='personal and billing div' className='flex flex-row justify-between'>
                        
                        <div id='Billing Info' className='w-1/2'>
                            <div className=" shadow-inner p-4 rounded-lg mt-4 ">
                                <label className="text-2xl w-full text-center font-light mb-2 block">Billing info</label>
                                <div className="mb-4">
                                    <label className="block text-darkslategray font-light mb-1">Name:</label>
                                    <input type="text" placeholder="ToName" onChange={(e) => setToName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-darkslategray font-light mb-1">Address:</label>
                                    <input type="text" placeholder="ToAddress" onChange={(e) => setToAddress(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-darkslategray font-light mb-1">City:</label>
                                    <input type="text" placeholder="ToCity" onChange={(e) => setToCity(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-darkslategray font-light mb-1">Postcode:</label>
                                    <input type="text" placeholder="ToPostcode" onChange={(e) => setToPostcode(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
                                </div>
                            </div>
                        </div>

                        <div id='Personal Info' className="mt-4 w-1/2">
                            <div className=" shadow-inner p-4 rounded-lg ">
                                <label className="text-2xl w-full text-center font-light mb-2 block">Personal info</label>
                                <div className="mb-4">
                                    <label className="block text-darkslategray font-light mb-1">Company Name:</label>
                                    <input type="text" placeholder="Company Name" onChange={(e) => { setCompanyName(e.target.value) }} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-darkslategray font-light mb-1">Address:</label>
                                    <input type="text" placeholder="Address" onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-darkslategray font-light mb-1">Postcode:</label>
                                    <input type="text" placeholder="Postcode" onChange={(e) => setPostcode(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-darkslategray font-light mb-1">Email:</label>
                                    <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
                                </div>
                            </div>
                        </div>

                    </div>



                        <div id='Table' className=" ">
                                <table className="w-full border-collapse shadow-lg rounded-xl p-2 overflow-hidden">
                                    <thead>
                                        <tr className=" w-full text-white text-left text-sm">
                                        
                                            <th className="p-3 w-[70%] bg-sky-950 font-light">Item</th>
                                            <th className="p-3 w-[12%] bg-sky-950 font-light">Quantity</th>
                                            <th className="p-3 w-[15%] bg-sky-950 font-light">Unit Price</th>
                                            <th className="p-3 w-[10%] bg-sky-950 font-light">Cost</th>
                                            <th className=" bg-sky-950">
                                            <select onChange={handleCurrency} className="m-2 border-none bg-sky-950 font-light focus:outline-none">
                                                    {Currencies.map(currency => (
                                                        <option value={currency} key={currency}>
                                                            {currency}
                                                        </option>
                                                    ))}
                                            </select>
                                            </th>
                                                
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ItemsCost.map((items, index) => (
                                            <tr key={index} className=" border-gray-200">
                                                <td className="pt-3">
                                                    <input type="text" placeholder="Description" value={items.description} onChange={(e) => { handleItemChange(index, 'description', e.target.value) }} className="w-11/12 border border-gray-300 rounded-xl px-3 py-2 text-black" />
                                                </td>
                                                <td className="pt-3 ">
                                                    <input type="number" placeholder="Quantity" value={items.quantity} onChange={(e) => { handleItemChange(index, 'quantity', e.target.value) }} className=" w-11/12 border border-gray-300 rounded-xl px-3 py-2 text-black" />
                                                </td>
                                                <td className="w-11/12 pt-3 flex ml-2 items-center space-x-1">
                                                    <span className='font-light'>{items.currency}</span>
                                                    <input type="number" placeholder="Unit Price" value={items.unitPrice} onChange={(e) => { handleItemChange(index, 'unitPrice', e.target.value) }} className=" w-8/12 border border-gray-300 rounded-xl px-2 py-2 text-black" />
                                                </td>
                                                <td className="pt-3">
                                                    <div className='w-full flex items-center space-x-1'>
                                                    <span className="font-light">{items.cost}</span> 
                                                    <span  className="font-light"> {items.currency}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-end mt-4 space-x-2">
                                    <button className="px-4 py-2  text-darkslategray border border-gray-300 rounded shadow" onClick={addItemRow}>Add Item</button>
                                    <button className="px-4 py-2  text-darkslategray border border-gray-300 rounded shadow" onClick={deleterow}>Delete Item</button>
                                </div>
                            
                        </div>


                        <div className='mt-6 flex flex-row justify-between'>
                            <div id='terms' className="col-span-1 mt-6">
                                <div className=" shadow-inner p-4 rounded-lg">
                                    {Type === 'Invoice' ? (
                                        <div className='flex flex-col'>
                                            <label className=" text-darkslategray font-light mb-2">Payment Terms</label>
                                            <textarea className="w-[400px] h-[100px] border border-gray-300 rounded px-3 py-2 mb-4" placeholder="message" onChange={(e) => setMessage(e.target.value)}></textarea>
                                            <textarea className="w-[400px] h-[100px] border border-gray-300 rounded px-3 py-2" placeholder="payment information" onChange={(e) => setPayInfo(e.target.value)}></textarea>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-darkslategray font-light mb-2">Terms and Conditions</label>
                                            <textarea className="w-[400px] h-[200px] border border-gray-300 rounded px-3 py-2" placeholder="Terms and conditions" onChange={(e) => setTerms(e.target.value)}></textarea>
                                        </div>
                                    )}
                                </div>
                            </div>
                        



                        <div id='total' className=" mt-6 flex flex-col justify-end items-end">
                            <div className="mb-4">
                                <label className="block text-darkslategray font-light mb-2">Discount:</label>
                                <input type="number" placeholder="discount" onChange={(e) => { setDiscount(e.target.value) }} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-darkslategray font-light mb-2">Tax:</label>
                                <input type="number" placeholder="Tax" onChange={(e) => { setTax(e.target.value) }} className="w-full border border-gray-300 rounded-xl px-3 py-2" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-darkslategray font-light mb-2">Total:</label>
                                <span>{Total}{Currency}</span>
                            </div>
                        </div>
                        </div>
                        <div className=" submit button flex justify-between mt-6">
                            <button type="submit" onClick={submit} className="px-4 py-2 bg-blue-500 text-white rounded shadow">Submit</button>
                        </div>

            </div>
                    
        </div>
    )
}