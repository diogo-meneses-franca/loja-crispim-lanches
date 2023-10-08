import React, { useEffect, useState } from "react";
import { BrandService } from "../../service/BrandService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';

const Brand = () => {
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
    const [brandPage, setBrandPage] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [brand, setBrand] = useState({ name: '' })
    const brandService = new BrandService();

    useEffect(() => {
        requestBrand(paginationModel);
    }, [])

    useEffect(() => {
        requestBrand(paginationModel);
    }, [paginationModel])

    const handleDialogClose = () => {
        setOpen(false);
        setEditMode(false);
        setBrand({ name: "" })
    };

    const handleChange = (event) => {
        setBrand({ ...brand, name: event.target.value });
    }

    const requestBrand = (pagination) => {
        brandService.get(pagination.page, pagination.pageSize)
            .then((response) => response.json())
            .then((data) => {
                setBrandPage(data.content)
            })
    }

    const onSave = (event) => {
        event.preventDefault();
        if (brand.name.trim() === '') {
            return;
        }
        if (editMode) {
            brandService.update(brand)
                .then((response) => {
                    if (response.status === 200) {
                        requestBrand(paginationModel);
                        setEditMode(false);
                        setBrand({ name: '' })
                    }
                })
        } else {
            brandService.post(brand)
                .then((response) => {
                    if (response.status === 201) {
                        requestBrand(paginationModel);
                    }
                    setBrand({ name: '' });
                })

        }
        handleDialogClose();
    };

    const onDataStatusChangeClick = (data) => {
        if (data.status === true) {
            brandService.delete(data.id)
                .then(() => requestBrand(paginationModel));

        } else {
            let brd = data;
            brd.status = true;
            brandService.update(brd)
                .then(() => requestBrand(paginationModel));
        }
    }

    const handleEditButtonClick = (brandId) => {
        const selectedBrand = (brandPage.find((brand) => brand.id === brandId));
        setBrand({ id: selectedBrand.id, name: selectedBrand.name })
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

    return (
        <div class="w-full">
            <div class="m-3 mb-1">
                <Button className="form-button bg-blue-400" label="Cadastrar" onClick={() => setOpen(true)} />
            </div>
            <div className="card flex justify-content-center">
                <Dialog className="flex ml-8 w-8 " header={editMode ? "Editar Marca" : "Cadastrar Marca"} visible={open} onHide={handleDialogClose}>
                    <form>
                        <label className="mb-6" htmlFor="name">Nome</label>
                        <InputText className="flex w-full mb-2" value={brand.name} onChange={handleChange} placeholder="Ex: Coca-Cola" required={true} />
                        <div className="align-items-end w-full h-5rem">
                            <Button className="flex-1" severity="success" label="Confirmar" size="small" onClick={onSave} />
                        </div>
                    </form>
                </Dialog>
            </div>
            <div class="m-3">
                <DataTable value={brandPage}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    tableStyle={{
                        maxWidth: '100%',
                        position: 'relative',

                    }}>
                    <Column field="name" header="Nome" sortable></Column>
                    <Column body={createDateBodyTemplate} field="createDate" header="Criado em" sortable style={{ width: '12%' }} align={"left"}></Column>
                    <Column body={updateDateBodyTemplate} field="updateDate" header="Alterado em" sortable style={{ width: '13%' }} align={"left"}></Column>
                    <Column body={editBrandTemplate} header="Editar" style={{ width: '8%' }} align={"right"} />
                    <Column body={activeBrandTemplate} header="Ativa/Inativar" style={{ width: '15%' }} align={"center"} />
                </DataTable>
            </div>
        </div>
    )
}
export default Brand;