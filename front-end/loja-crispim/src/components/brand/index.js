import React, { useEffect, useState} from "react";
import { BrandService } from "../../service/BrandService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputSwitch } from "primereact/inputswitch";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import '../universal.css'
import BrandFormDialog from "./brandFormDialog";

const Brand = () => {
    const [brand, setBrand] = useState({ name: '', status: true });
    const [brandPage, setBrandPage] = useState([]);
    const [editMode, setEditMode] = useState(false);
    
    const [open, setOpen] = useState(false);      
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const brandService = new BrandService();

    useEffect(() => {
        requestBrand();
    }, []);

    useEffect(() => {
        requestBrand();
    }, [first, rows]);

    const handleOpenDialog = ()=>{
            setOpen(true);
    }
    useEffect(()=>{},[brandPage]);

    const handleCloseDialog = ()=>{
        console.log("função callback chamada!");
        setBrand({name: '', status: true});
        requestBrand();
        setEditMode(false);
        setOpen(false);
    }

    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const requestBrand = () => {
        const page = first / rows;
        brandService.get(page/rows)
            .then((response) => response.json())
            .then((data) => {
                setTotalElements(data.totalElements);
                setBrandPage(data.content);
            })
    };

    const onDataStatusChangeClick = (data) => {
        if (data.status === true) {
            brandService.delete(data.id)
                .then(() => requestBrand());

        } else {
            let brd = data;
            brd.status = true;
            brandService.update(brd)
                .then(() => requestBrand());
        }
    };

    const handleEditButtonClick = (brandId) => {
        const selectedBrand = (brandPage.find((brand) => brand.id === brandId));
        setBrand({ id: selectedBrand.id, name: selectedBrand.name, status: selectedBrand.status})
        setEditMode(true);
        setOpen(true);
    };

    const formatDate = (value) => {
        const dt = new Date(value)
        return dt.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const createDateBodyTemplate = (rowData) => {
        return formatDate(rowData.createDate);
    };
    const updateDateBodyTemplate = (rowData) => {
        return formatDate(rowData.updateDate);
    };
    const editBrandTemplate = (rowData) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    text
                    onClick={() => handleEditButtonClick(rowData.id)}
                    severity="secondary"
                />
            </div>
        )
    };

    const activeBrandTemplate = (rowData) => {
        return (
            <InputSwitch checked={rowData.status} onChange={() => onDataStatusChangeClick(rowData)} />
        );
    };

    const tableHeader = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-red-500 font-bold">Marca</span>
                <Button className="form-button  bg-red-500 border-transparent hover:bg-red-400 mr-0 mr-6" label="Cadastrar" onClick={() => handleOpenDialog()} />
        </div>
    );
    

    return (
        <div className="w-full">
            <BrandFormDialog open={open} editMode={editMode} onclose={handleCloseDialog} brandPar={brand}/>           
            <div className="m-3">
                <DataTable 
                    className="mt-8"
                    value={brandPage}
                    header={tableHeader}                                
                    >
                    <Column 
                        field="name" 
                        header="Nome" 
                        sortable
                        />
                    <Column 
                        body={createDateBodyTemplate} 
                        field="createDate" 
                        header="Criado em" 
                        sortable 
                        style={{ width: '12%' }} 
                        align={"left"}
                        />
                    <Column 
                        body={updateDateBodyTemplate} 
                        field="updateDate" 
                        header="Alterado em" 
                        sortable 
                        style={{ width: '13%' }} 
                        align={"left"}
                        />
                    <Column 
                        body={editBrandTemplate} 
                        header="Editar" 
                        style={{ width: '8%' }} 
                        align={"right"}
                        />
                    <Column 
                        body={activeBrandTemplate} 
                        header="Ativa/Inativar" 
                        style={{ width: '15%' }} 
                        align={"center"}
                        />
                </DataTable>
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={totalElements}
                    rowsPerPageOptions={[5, 10, 20]}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}
export default Brand;