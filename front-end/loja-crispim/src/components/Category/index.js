import React, { useEffect, useState } from "react";
import { CategoryService } from "../../service/CategoryService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import '../universal.css'

const Category = () => {
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
    const [categoryPage, setCategoryPage] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [category, setCategory] = useState({ name: '' })
    const categoryService = new CategoryService();

    useEffect(() => {
        requestCategory(paginationModel);
    }, [])

    useEffect(() => {
        requestCategory(paginationModel);
    }, [paginationModel])

    const handleDialogClose = () => {
        setOpen(false);
        setEditMode(false);
        setCategory({ name: "" })
    };

    const handleChange = (event) => {
        setCategory({ ...category, name: event.target.value });
    }

    const requestCategory = (pagination) => {
        categoryService.get(pagination.page, pagination.pageSize)
            .then((response) => response.json())
            .then((data) => {
                setCategoryPage(data.content)
            })
    }

    const onSave = (event) => {
        event.preventDefault();
        if (category.name.trim() === '') {
            return;
        }
        if (editMode) {
            categoryService.update(category)
                .then((response) => {
                    if (response.status === 200) {
                        requestCategory(paginationModel);
                        setEditMode(false);
                        setCategory({ name: '' })
                    }
                })
        } else {
            categoryService.post(category)
                .then((response) => {
                    if (response.status === 201) {
                        requestCategory(paginationModel);
                    }
                    setCategory({ name: '' });
                })

        }
        handleDialogClose();
    };

    const onDataStatusChangeClick = (data) => {
        if (data.status) {
            categoryService.delete(data.id).then(() => {
                requestCategory(paginationModel)
            });

        } else {
            let cat = data;
            cat.status = true;
            categoryService.update(cat).then(() => requestCategory(paginationModel));
        }

    }

    const handleEditButtonClick = (categoryId) => {
        const selectedCategory = (categoryPage.find((category) => category.id === categoryId));
        setCategory({ id: selectedCategory.id, name: selectedCategory.name })
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
    const editCategoryTemplate = (rowData) => {
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

    const activeCategoryTemplate = (rowData) => {
        return (
            <InputSwitch checked={rowData.status} onChange={() => onDataStatusChangeClick(rowData)} />
        );
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Categoria</span>
                <Button className="form-button bg-blue-400 mr-6" label="Cadastrar" onClick={() => setOpen(true)} />
        </div>
    );

    return (
        <div className="w-full">
            <div className="card flex justify-content-center">
                <Dialog
                    className="flex ml-8 w-8 h-15rem "
                    header={editMode ? "Editar Categoria" : "Cadastrar Categoria"}
                    visible={open}
                    onHide={handleDialogClose}
                    style={{ width: '50vw' }
                    }>
                    <form onSubmit={onSave}>
                        <label className="mb-6" htmlFor="name">Nome</label>
                        <InputText className="flex w-full mb-2" value={category.name} onChange={handleChange} placeholder="Ex: Alimentos" />
                        <Button className="absolute mb-5 mr-4 mt-3 bottom-0 right-0 dialog-button " severity="success" label="Confirmar" size="small" />
                    </form>
                </Dialog>
            </div>
            <div className="m-3">
                <DataTable
                    className="mt-8"
                    header={header}
                    value={categoryPage}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    tableStyle={{
                        maxWidth: '100%',
                    }}>
                    <Column field="name" header="Nome" sortable></Column>
                    <Column body={createDateBodyTemplate} field="createDate" header="Criado em" sortable style={{ width: '12%' }} align={"left"}></Column>
                    <Column body={updateDateBodyTemplate} field="updateDate" header="Alterado em" sortable style={{ width: '13%' }} align={"left"}></Column>
                    <Column body={editCategoryTemplate} header="Editar" style={{ width: '8%' }} align={"right"} />
                    <Column body={activeCategoryTemplate} header="Ativa/Inativar" style={{ width: '15%' }} align={"center"} />
                </DataTable>
            </div>
        </div>
    )
}
export default Category;