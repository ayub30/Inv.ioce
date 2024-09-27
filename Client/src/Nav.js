import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import './Nav.css'

export default function Nav({setAuth}){
    const [isVis, setIsVis] = useState(false)
    const navigate = useNavigate();

    const toggleVis = () => {
        setIsVis(!isVis);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setAuth(false);
    }



    return(
            <nav className="flex items-center justify-between px-2 py-2">
            
                <div className="tab
                flex items-center">
                    <button onClick={toggleVis} className="mr-3">
                        <i className="bi bi-list text-gray-600 text-base" />
                    </button>
                    <div className="logo">
                        <h1 className="text-xs font-semibold">Inv.ioce</h1>
                    </div>
                </div>

                <div id="sidebar"
                className={`fixed top-0 bottom-0 left-0 p-2 w-[250px] text-center bg-inherit transition-all duration-300 ease-in-out transform ${
                    isVis ? "translate-x-0" : "-translate-x-full"
                }`}
                >
                    <div className="text-xl text-gray-100">
                        <div className="p-2.5 mt-1 flex justify-between">
                            <h1 className="font-bold text-gray-600 text-[15px] ml-3">Menu</h1>
                            <button onClick={toggleVis}>
                                <i className="bi bi-x-lg text-gray-600" />
                            </button>
                        </div>
                        <hr className="my-2 text-gray-600" />
                    </div>

                    <div
                        className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-inherit text-gray-600"
                        onClick={() => navigate("/view")}
                    >
                        <h1>Invoice History</h1>
                    </div>
                    <hr className="my-2 text-gray-600" />

                    <div
                        className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-inherit text-gray-600"
                        onClick={() => navigate("/form")}
                    >
                        <h1>Send Invoice</h1>
                    </div>
                    <hr className="my-2 text-gray-600" />

                    <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-inherit text-gray-600">
                        <h1>Logout</h1>
                    </div>
                    <hr className="my-2 text-gray-600" />
                </div>

                <div className="flex items-center space-x-4">
                    <div className="right flex items-center space-x-4">
                        <ul className="flex space-x-4">
                        <li className="text-xs font-extralight">contact us</li>
                        <button onClick={logout} className="text-xs font-extralight">logout</button>
                        </ul>
                    </div>
                </div>
            </nav>
        

        )
}