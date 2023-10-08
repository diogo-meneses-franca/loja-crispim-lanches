import React from "react";
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';


const AdministrativePanel = () => {
    const navigate = useNavigate();
    const loadPage = (page) => {
        navigate(page);
    }
    return (
        <div className="card h-15rem w-2 m-3 mt-8 align-items-baseline border-1 surface-border border-round-lg bg-white">
            <div class=" flex flex-wrap justify-content-center border-round-xs ">
                <Button class="inline-block w-full h-3rem  border-transparent border-noround-bottom border-right-none text-lg border-round-top border-round-lg border-left-none text-white bg-blue-400 " onClick={() => { }}>Opções</Button>
                <Button class="inline-block w-full h-3rem  border-noround-bottom border-right-none text-lg bg-white border-bottom-1 border-50 border-left-none" onClick={() => loadPage('/category') }>Categoria</Button>
                <Button class="inline-block w-full h-3rem  border-noround-bottom border-right-none text-lg bg-white border-bottom-1 border-50 border-left-none" onClick={() => loadPage('/brand')}>Marca</Button>
                <Button class="inline-block w-full h-3rem  border-noround-bottom border-right-none text-lg bg-white border-bottom-1 border-50 border-left-none" onClick={() => loadPage('/product')}>Produto</Button>
                <Button class="inline-block w-full h-3rem  text-lg border-right-none bg-white border-bottom-1 border-50 border-round-bottom border-left-none"   onClick={() => loadPage('/addrState')}>Estado</Button>
            </div>
        </div>
    );



}

export default AdministrativePanel;