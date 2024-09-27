import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Nav from './Nav'
import Form from './form';
import Register from './register';
import CompanyReg from './registerCompany'
import Login from './Login'
import View from './View'
import Landing from './landing';


function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false)
  const location = useLocation();

  const checkToken = async() => {
    try {
      const response = await fetch("http://localhost:3001/verify",{
        method: "post",
        headers: {token: localStorage.getItem('token')}
      }) 
      const data = await response.json();
      data === true ? setisAuthenticated(true) : setisAuthenticated(false)
      console.log("token checked")
    } catch (error) {
      console.log(error.message)
    }
  }
  
  useEffect(() => {checkToken()},[location,isAuthenticated])

  const setAuth = (boolean) => {
    setisAuthenticated(boolean);
  }

  return (
    <div className='page'>
      <Nav setAuth = {setAuth}/>
      <div className='blur-[150px] pointer-events-none absolute -top-40 right-60 w-[300px] h-[300px] bg-white rounded-full'></div>
      <div className='blur-[150px] pointer-events-none absolute top-40 -left-40 w-[300px] h-[300px] bg-white rounded-full'></div>
      <div className='blur-[170px] pointer-events-none absolute bottom-20 right-40 w-[300px] h-[300px] bg-white rounded-full'></div>
      <Routes>
        
        <Route 
        path='/' 
        element = {!isAuthenticated ? ( <Landing/> ) : (<Navigate to="/form" />)} 
        />
        <Route path='/login' element={!isAuthenticated ? ( <Login setAuth={setAuth} /> ) : ( <Form/>)}/>
        <Route path='/form' element={!isAuthenticated ? ( <Login setAuth={setAuth} /> ) : (<Form/>)}/>
        <Route path='/view' element={!isAuthenticated ? ( <Login setAuth={setAuth} /> ) : (<View/>)}/>
        <Route path='/regCompany' element={<CompanyReg/>}/>
        <Route path='/register' element={<Register setAuth={setAuth} />}/>
      </Routes>
    </div>
  );
}

export default App;
