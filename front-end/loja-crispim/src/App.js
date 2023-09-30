import React from 'react';
import MyAppBar from "./components/MyAppBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home'
import Category from './components/Category';
import Brand from './components/brand';
import Product from './components/product';
import AdministrativePanel from './components/administrativePanel';
import AddrState from './components/addrState';


function App() {
  return (
    <>
      <BrowserRouter>
        <MyAppBar/>
          <Routes>
              <Route exact path="/" Component={Home} />
                <Route path="/category" Component={Category} />
                <Route path="/brand" Component={Brand} />
                <Route path="/product" Component={Product} />
                <Route path="/addrState" Component={AddrState} />
          </Routes>
                
      </BrowserRouter>
    </>
  );
}

export default App;
