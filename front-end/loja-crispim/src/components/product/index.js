import React, { useEffect, useState } from "react";
import { ProductService } from "../../service/ProductService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Carousel } from 'primereact/carousel';np,
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import './Product.css';

const Product = () => {
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
    const [productPage, setProductPage] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [product, setProduct] = useState({ name: '' })
    const productService = new ProductService();

    useEffect(() => {
        requestProduct(paginationModel);
    }, [])

    useEffect(() => {
        requestProduct(paginationModel);
    }, [paginationModel])

    const handleDialogClose = () => {
        setOpen(false);
        setEditMode(false);
        setProduct({ name: "" })
    };

    const handleChange = (event) => {
        setProduct({ ...product, name: event.target.value });
    }

    const requestProduct = (pagination) => {
        productService.get(pagination.page, pagination.pageSize)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.content)
                setProductPage(data.content)
            })
    }

    const onSave = (event) => {
        event.preventDefault();
        if (product.name.trim() === '') {
            return;
        }
        if (editMode) {
            productService.update(product)
                .then((response) => {
                    if (response.status === 200) {
                        requestProduct(paginationModel);
                        setEditMode(false);
                        setProduct({ name: '' })
                    }
                })
        } else {
            productService.post(product)
                .then((response) => {
                    if (response.status === 201) {
                        requestProduct(paginationModel);
                    }
                    setProduct({ name: '' });
                })

        }
        handleDialogClose();
    };

    const onDataStatusChangeClick = (data) => {
        if (data.status === true) {
            productService.delete(data.id);

        } else {
            let prod = data;
            prod.status = true;
            productService.update(prod);
        }
        requestProduct(paginationModel);
    }

    const handleEditButtonClick = (productId) => {
        const selectedProduct = (productPage.find((product) => product.id === productId));
        setProduct({ id: selectedProduct.id, name: selectedProduct.name })
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
    const editProductTemplate = (rowData) => {
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

    const activeProductTemplate = (rowData) => {
        return (
            <InputSwitch checked={rowData.status} onChange={() => onDataStatusChangeClick(rowData)} />
        );
    };
    const imageBodyTemplate = ()=>{
        return (

            <div className="card">
            <Carousel value={products} numScroll={1} numVisible={3} responsiveOptions={responsiveOptions} itemTemplate={productTemplate} />
        </div>
        )
    }
    return (
        <div className="product-view">
            <div>
                <Button label="Cadastrar" onClick={() => setOpen(true)} />
            </div>
            <div className="card flex justify-content-center">
                <Dialog header={editMode ? "Editar Produto" : "Cadastrar Produto"} visible={open} onHide={handleDialogClose}
                    style={{ width: '50vw' }}>
                    <InputText value={product.name} onChange={handleChange} placeholder="Ex: Coca-Cola" />
                    <Button className="dialog-button" severity="success" label="Confirmar" size="small" onClick={onSave} />
                </Dialog>
            </div>
            <div className="card">
                <DataTable value={productPage}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    tableStyle={{
                        maxWidth: '60%',
                        marginLeft: '20%',

                    }}>
                    <Column field="name" header="Nome" sortable></Column>
                    <Column header="Image" body={imageBodyTemplate}></Column>
                    <Column field="name" header="Nome" sortable></Column>
                    <Column field="name" header="Nome" sortable></Column>
                    <Column body={createDateBodyTemplate} field="createDate" header="Criado em" sortable style={{ width: '12%' }} align={"left"}></Column>
                    <Column body={updateDateBodyTemplate} field="updateDate" header="Alterado em" sortable style={{ width: '13%' }} align={"left"}></Column>
                    <Column body={editProductTemplate} header="Editar" style={{ width: '8%' }} align={"right"} />
                    <Column body={activeProductTemplate} header="Ativa/Inativar" style={{ width: '15%' }} align={"center"} />
                </DataTable>
            </div>
        </div>
    )
}
export default Product;