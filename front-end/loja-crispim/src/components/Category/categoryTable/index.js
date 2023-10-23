import React, { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputSwitch } from "primereact/inputswitch";
import { Paginator } from "primereact/paginator";
import CategoryDialog from "../categoryDialog";
import { CategoryService } from "../../../service/CategoryService";




const CategoryTable = () => {
    const [open, setOpen] = useState(false);
    const [categoryPage, setCategoryPage] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [category, setCategory] = useState({ name: '', status: true });

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const categoryService = new CategoryService();

    useEffect(() => {
        requestCategory();
    }, [])

    useEffect(() => {
        requestCategory();
    }, [first, rows])

    const handleDialogClose = () => {
        requestCategory();
        setOpen(false);
        setEditMode(false);
        setCategory({ name: "", status: true });
    };

    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    }



    const requestCategory = () => {
        const page = first / rows;
        categoryService.get(page, rows)
            .then((response) => response.json())
            .then((data) => {
                setTotalElements(data.totalElements);
                setCategoryPage(data.content)
            })
    }



    const onDataStatusChangeClick = (data) => {
        if (data.status) {
            categoryService.delete(data.id).then(() => {
                requestCategory()
            });

        } else {
            let cat = data;
            cat.status = true;
            categoryService.update(cat).then(() => requestCategory());
        }

    }

    const handleEditButtonClick = (categoryId) => {
        const selectedCategory = (categoryPage.find((category) => category.id === categoryId));
        setCategory({ id: selectedCategory.id, name: selectedCategory.name, status: selectedCategory.status })
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

    const header = () => {
        return (
            <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                <span className="text-xl text-red-500 font-bold">Categoria</span>
                <Button className="form-button  bg-red-500 border-transparent hover:bg-red-400 mr-0 mr-6" label="Cadastrar" onClick={() => setOpen(true)} />
            </div>
        )
    };
    return (
        <>
            <CategoryDialog open={open} onclose={handleDialogClose} editMode={editMode} categoryToEdit={category} />

            <div className="m-3">
                <DataTable
                    className="mt-8"
                    header={header}
                    value={categoryPage}
                >
                    <Column field="name" header="Nome" sortable></Column>
                    <Column body={createDateBodyTemplate} field="createDate" header="Criado em" sortable style={{ width: '12%' }} align={"left"}></Column>
                    <Column body={updateDateBodyTemplate} field="updateDate" header="Alterado em" sortable style={{ width: '13%' }} align={"left"}></Column>
                    <Column body={editCategoryTemplate} header="Editar" style={{ width: '8%' }} align={"right"} />
                    <Column body={activeCategoryTemplate} header="Ativa/Inativar" style={{ width: '15%' }} align={"center"} />
                </DataTable>
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={totalElements}
                    rowsPerPageOptions={[5, 10, 20]}
                    onPageChange={handlePageChange}
                />
            </div>
        </>


    )
}
export default CategoryTable;