import React, { useEffect, useState, useRef } from "react";
import { BrandService } from "../../service/BrandService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from 'primereact/toast';
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import '../universal.css'

const Brand = () => {
    const [open, setOpen] = useState(false);
    const [brandPage, setBrandPage] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [brand, setBrand] = useState({ name: '', status: true });
    const toast = useRef(null);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const brandService = new BrandService();

    useEffect(() => {
        requestBrand();
    }, [])

    useEffect(() => {
        requestBrand();
    }, [first, rows])

    const handleDialogClose = () => {
        setOpen(false);
        setEditMode(false);
        setBrand({ name: "", status: true })
    };

    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    }

    const handleChange = (event) => {
        setBrand({ ...brand, name: event.target.value });
    }

    const requestBrand = () => {
        const page = first / rows;
        brandService.get(page/rows)
            .then((response) => response.json())
            .then((data) => {
                setTotalElements(data.totalElements);
                setBrandPage(data.content);
            })
    }

    const onSave = (event) => {
        event.preventDefault();
        if (brand.name.trim() === '') {
            return;
        }
        if (editMode) {
            try{
                brandService.update(brand)
                    .then((response) => {
                        if (response.status === 200) {
                            showSuccess();
                            requestBrand();
                            setEditMode(false);
                            setBrand({ name: '', status: true })
                        }
                    })

            }catch(error){
                showError();
                console.log(error);
            }  
        } else {
            try{
                brandService.post(brand)
                    .then((response) => {
                        if (response.status === 201) {
                            showSuccess();
                            requestBrand();
                        }
                        setBrand({ name: '', status: true });
                    })

            }catch(error){
                showError();
                console.log(error);
            }

        }
        handleDialogClose();
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
    }

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
    }

    const activeBrandTemplate = (rowData) => {
        return (
            <InputSwitch checked={rowData.status} onChange={() => onDataStatusChangeClick(rowData)} />
        );
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Marca</span>
                <Button className="form-button bg-green-400 hover:bg-green-500 border-transparent mr-6" label="Cadastrar" onClick={() => setOpen(true)} />
        </div>
    );
    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Registro Efetuado com sucesso!', life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Falha no registro! Tente novamente mais tarde.', life: 3000});
    }

    return (
        <div className="w-full">
            <Toast ref={toast} />
            <div className="card flex justify-content-center">
                <Dialog 
                    className="flex ml-8 w-8 h-15rem " 
                    header={editMode ? "Editar Marca" : "Cadastrar Marca"} 
                    visible={open} 
                    onHide={handleDialogClose}>
                    <form onSubmit={onSave}>
                        <label className="mb-6" htmlFor="name">Nome</label>
                        <InputText 
                            className="flex w-full mb-2" 
                            value={brand.name} 
                            onChange={handleChange} 
                            placeholder="Ex: Coca-Cola" 
                            required={true} 
                            />
                        <Button 
                            className="absolute mb-5 mr-4 bottom-0 right-0 dialog-button bg-green-400 hover:bg-green-500 border-transparent " 
                            severity="success" 
                            label="Confirmar" 
                            size="small" 
                            />
                    </form>
                </Dialog>
            </div>
            <div className="m-3">
                <DataTable 
                    className="mt-8"
                    value={brandPage}
                    header={header}                                
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