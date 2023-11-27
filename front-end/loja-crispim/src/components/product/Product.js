import React, { useEffect, useState} from "react";
import { ProductService } from "../../service/ProductService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputSwitch } from "primereact/inputswitch";
import { Galleria } from 'primereact/galleria';
import { Paginator } from "primereact/paginator";
import '../universal.css'
import ProductFormDialog from "./ProductFormDialog";

const Product = () => {
    const [totalElements, setTotalElements] = useState(0);
    const [productPage, setProductPage] = useState([]);
    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState({ name: '', description: '', costValue: 0, saleValue: 0, category: {}, brand: {}, status: true, images: []});  
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [dialogImages, setDialogImages] = useState(null);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const productService = new ProductService();
    

    useEffect(() => {
        requestProduct();
    }, [])

    useEffect(() => {
        requestProduct();
    }, [first, rows])
    useEffect(() => { }, [product])

    const handleOpenDialog = ()=>{
        setOpen(true);
    }

    const handleDialogClose = () => {
        requestProduct();
        setOpen(false);
        setProduct({ name: '', description: '', costValue: 0, saleValue: 0, brand: {}, category: {}, status: true, images: [] });
    };

    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    }
    const requestProduct = () => {
        const page = first / rows;
        productService.get(page, rows)
            .then((response) => response.json())
            .then((data) => {
                console.log(data.content);
                setTotalElements(data.totalElements);
                setProductPage(data.content);
            })
    } 

    const onDataStatusChangeClick = (data) => {
        if (data.status === true) {
            productService.delete(data.id).then(() => requestProduct());

        } else {
            let prod = data;
            prod.status = true;
            productService.update(prod).then(() => requestProduct());
        }
    }

    const handleEditButtonClick = (productId) => {
        const selectedProduct = (productPage.find((product) => product.id === productId));
        setProduct({
            id: selectedProduct.id,
            name: selectedProduct.name,
            costValue: selectedProduct.costValue,
            saleValue: selectedProduct.saleValue,
            brand: selectedProduct.brand,
            category: selectedProduct.category,
            status: selectedProduct.status,
            images: selectedProduct.images
        })
        setOpen(true);
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const costValueBodyTemplate = (product) => {
        return formatCurrency(product.costValue);
    };

    const saleValueBodyTemplate = (product) => {
        return formatCurrency(product.saleValue);
    };
    
    const editProductTemplate = (rowData) => {
        return (
            <Button
                className="edit-button"
                icon="pi pi-pencil"
                rounded
                text
                onClick={() => handleEditButtonClick(rowData.id)}
                severity="secondary"
            />
        )
    }

    const activeProductTemplate = (rowData) => {
        return (
            <InputSwitch checked={rowData.status} onChange={() => onDataStatusChangeClick(rowData)} />
        );
    };

    const imageBodyTemplate = (product) => {
        return <img className={((product.images.length > 0) ? "w-8rem h-8rem border-round border-transparent" : "w-0")} src={product.images[0]?.url} onClick={() => handleImageDialog(product.images)} />;
    };
    const handleImageDialog = (img) => {
        if (img.length > 0) {
            console.log(img);
            setDialogImages(img);
            setImageDialogOpen(true);
        }
    }

    const descriptionBodyTemplate = (rowData) => {
        return (
            <div className="flex overflow-auto line-height-2">
                {rowData.description}
            </div>
        )
    }

    const categoryBodyTemplate = (rowData) => {
        return (
            <div className="flex overflow-auto line-height-2 align-content-center text-center">
                {(rowData.category) ? rowData.category.name : ""}
            </div>
        )
    }
    const brandBodyTemplate = (rowData) => {
        return (
            <div className="flex overflow-auto line-height-2 align-content-center text-center">
                {(rowData.brand) ? rowData.brand.name : ""}
            </div>
        )
    }

    const tableHeaderTemplate = ()=>{
        return(
            <div className="flex flex-wrap align-items-center justify-content-between gap-2 ">
                <span className="text-xl text-red-500 font-bold">Produto</span>
                <Button className="form-button bg-red-500 border-transparent hover:bg-red-400 mr-0 cursor-pointer" label="Cadastrar" onClick={()=>handleOpenDialog()} />
            </div>
        )
    };

    const itemTemplate = (item) => {
        return <img src={item.url} alt={item.alt} style={{ width: '60%', height: '60%', display: 'block', maxHeight: '500px' }} />;
    }

    const thumbnailTemplate = (item) => {
        return <img className="gap-2" src={item.url} alt={item.alt} style={{ display: 'block', width: '100px', height: '100px' }} />;
    }
    const handleImageDialogClose = () => {
        setImageDialogOpen(false);
    }

    

    return (
        <div className="w-full mb-8 ">
            
            <Dialog
                className="flex w-6 h-39rem  justify-content-center"
                visible={imageDialogOpen}
                onHide={handleImageDialogClose}
            >
                <Galleria value={dialogImages} numVisible={7} circular
                    showItemNavigators item={itemTemplate} thumbnail={thumbnailTemplate} />
            </Dialog>
            <ProductFormDialog open={open} productToEdit={product} onClose={handleDialogClose}/>
            <div className="m-3 ">
                <DataTable
                    className="mt-8 "
                    header={tableHeaderTemplate}
                    value={productPage}
                >
                    <Column
                        field="name"
                        header="Nome"
                        sortable
                        style={{ width: '15%' }}
                    />
                    <Column
                        body={imageBodyTemplate}
                        field="images[0]?.url"
                        header="Imagem"
                        align={"center"}
                        style={{ width: '7%' }}
                    />
                    <Column
                        body={descriptionBodyTemplate}
                        field="description" header="Descrição"
                        align='left'
                        style={{ width: '30%' }}
                    />
                    <Column
                        body={costValueBodyTemplate}
                        field="costValue"
                        header="Custo"
                        sortable
                        align={"center"}
                        style={{ width: '3%' }}
                    />
                    <Column
                        body={saleValueBodyTemplate}
                        field="saleValue"
                        header="Venda"
                        sortable
                        align={"center"}
                        style={{ width: '3%' }}
                    />
                    <Column
                        field="category"
                        body={categoryBodyTemplate}
                        header="Categoria"
                        sortable
                        align={"center"}
                        style={{ width: '8%' }}
                    />
                    <Column
                        field="brand"
                        body={brandBodyTemplate}
                        header="Marca"
                        sortable
                        align={"center"}
                        style={{ width: '8%' }}
                    />
                    <Column
                        body={editProductTemplate}
                        header="Editar"
                        style={{ width: '3%' }}
                        align={"center"}
                    />
                    <Column
                        body={activeProductTemplate}
                        header="Ativar/Inativar"
                        style={{ width: '4%' }} align={"center"}
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
export default Product;


    /*
    const formatDate = (value) => {
        const dt = new Date(value)
        return dt.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    */

    /*
    const createDateBodyTemplate = (rowData) => {
        return formatDate(rowData.createDate);
    };
    const updateDateBodyTemplate = (rowData) => {
        return formatDate(rowData.updateDate);
    };
    */