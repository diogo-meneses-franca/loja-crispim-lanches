import {Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import Brand from "../brand/Brand";
import Product from "../product/Product";
import AddrState from "../addrState/AddrState";
import Category from "../Category/Category";



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