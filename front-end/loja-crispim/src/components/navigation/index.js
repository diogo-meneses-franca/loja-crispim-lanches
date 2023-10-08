import {Routes, Route } from "react-router-dom";
import Home from "../Home";
import Category from "../Category";
import Brand from "../brand";
import Product from "../product";
import AddrState from "../addrState";


const Navigation = () => {
    return (
        
            <Routes>
                <Route exact path="/" Component={Home} />
                <Route path="/category" Component={Category} />
                <Route path="/brand" Component={Brand} />
                <Route path="/product" Component={Product} />
                <Route path="/addrState" Component={AddrState} />
            </Routes>
    )
}
export default Navigation;