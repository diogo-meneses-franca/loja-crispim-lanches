import React, { useEffect, useState, useRef } from "react";
import { ProductService } from "../../service/ProductService";
import { BrandService } from "../../service/BrandService";
import { CategoryService } from "../../service/CategoryService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from "primereact/inputswitch";
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import { Galleria } from 'primereact/galleria';
import { Toast } from 'primereact/toast';
import { Paginator } from "primereact/paginator";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import '../universal.css'

const Product = () => {
    const [open, setOpen] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [productPage, setProductPage] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [product, setProduct] = useState({ name: '', description: '', costValue: 0, saleValue: 0, category: {}, brand: {}, status: true, images: []});
    const [brand, setBrand] = useState([]);
    const [category, setCategory] = useState([]);
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [dialogImages, setDialogImages] = useState(null);
    const toast = useRef(null);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const productService = new ProductService();
    const brandService = new BrandService();
    const categoryService = new CategoryService();

    useEffect(() => {
        requestProduct();
    }, [])

    useEffect(() => {
        requestProduct();
    }, [first, rows])
    useEffect(() => { }, [product])

    const handleDialogClose = () => {
        setOpen(false);
        setEditMode(false);
        setProduct({ name: '', description: '', costValue: 0, saleValue: 0, brand: {}, category: {}, status: true, images: [] });
    };

    const handleInputTextChange = (event) => {
        const { name, value } = event.target;
        setProduct({ ...product, [name]: value });
    }

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

    const onSave = async (event) => {
        event.preventDefault();
        if (product.name.trim() === '' || product.costValue === 0 || product.saleValue === 0) {
            return;
        }
        if (editMode) {
            try {
                productService.update(product)
                    .then((response) => {
                        if (response.status === 200) {
                            showSuccess();
                            requestProduct();
                            setEditMode(false);
                            setProduct({ name: '', description: '', costValue: 0, saleValue: 0, category: {}, brand: {}, status: true, images: [] });
                        }
                    })

            } catch (error) {
                showError();
                console.log(error);
            }
        } else {
            try {
                productService.post(product)
                    .then((response) => {
                        if (response.status === 201) {
                            showSuccess();
                            requestProduct();
                        }
                        setProduct({ name: '', description: '', costValue: 0, saleValue: 0, images: [], category: {}, brand: {}, status: true });
                    })

            } catch (error) {
                showError();
                console.log(error);
            }
        }
        handleDialogClose();
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
        getBrandWhenDialogOpen();
        getCategoryWhenDialogOpen();
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
        setEditMode(true);
        setOpen(true);
    };

    const getBrandWhenDialogOpen = () => {
        return brandService.get()
            .then((response) => response.json())
            .then((data) => {
                setBrand(data.content);
            })
    }
    const getCategoryWhenDialogOpen = () => {
        return categoryService.get()
            .then((response) => response.json())
            .then((data) => {
                setCategory(data.content);
            })
    }

    const handleOpenDialog = () => {
        getBrandWhenDialogOpen();
        getCategoryWhenDialogOpen();
        setOpen(true);
    }

    const handleBrandSetOnProduct = (event) => {
        setProduct({ ...product, brand: event.value });
    }

    const handleCategorySetOnProduct = (event) => {
        setProduct({ ...product, category: event.value });
    }

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
    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const costValueBodyTemplate = (product) => {
        return formatCurrency(product.costValue);
    };

    const saleValueBodyTemplate = (product) => {
        return formatCurrency(product.saleValue);
    };
    /*
    const createDateBodyTemplate = (rowData) => {
        return formatDate(rowData.createDate);
    };
    const updateDateBodyTemplate = (rowData) => {
        return formatDate(rowData.updateDate);
    };
    */
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

    const handleImageUpload = async (event) => {
        const productImages = product.images;
        const files = event.files;
        for (let file of files) {
            const url = await productService.getPresignedAwsUrl();
            const response = await productService.sendImageToAwsS3(url, file);
            if (response.status === 200) {
                productImages.push({ "url": url.split('?')[0] });
            }
        }
        setProduct({ ...product, images: productImages });

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

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2 ">
            <span className="text-xl text-red-500 font-bold">Produto</span>
            <Button className="form-button bg-red-500 border-transparent hover:bg-red-400 mr-0 cursor-pointer" label="Cadastrar" onClick={() => handleOpenDialog()} />
        </div>
    );

    const itemTemplate = (item) => {
        return <img src={item.url} alt={item.alt} style={{ width: '60%', height: '60%', display: 'block', maxHeight: '500px' }} />;
    }

    const thumbnailTemplate = (item) => {
        return <img className="gap-2" src={item.url} alt={item.alt} style={{ display: 'block', width: '100px', height: '100px' }} />;
    }
    const handleImageDialogClose = () => {
        setImageDialogOpen(false);
    }

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registro Efetuado com sucesso!', life: 3000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Falha no registro! Tente novamente mais tarde.', life: 3000 });
    }

    const handleDeleteImage = (item) => {
        const updatedImages = product.images;
        updatedImages.pop(item);
        setProduct({ ...product, images: updatedImages });
    }

    return (
        <div className="w-full mb-8 ">
            <Toast ref={toast} />
            <Dialog
                className="flex w-6 h-39rem  justify-content-center"
                visible={imageDialogOpen}
                onHide={handleImageDialogClose}
            >
                <Galleria value={dialogImages} numVisible={7} circular
                    showItemNavigators item={itemTemplate} thumbnail={thumbnailTemplate} />
            </Dialog>
            <div className="card flex justify-content-center">
                <Dialog
                    className="flex ml-8 w-8 "
                    header={editMode ? "Editar Produto" : "Cadastrar Produto"}
                    visible={open}
                    onHide={handleDialogClose}
                    style={{ width: '50vw' }
                    }>
                    <form onSubmit={onSave}>
                        <label className="" name="name">Nome</label>
                        <InputText
                            className="flex w-full mb-2"
                            name="name"
                            value={product.name}
                            onChange={handleInputTextChange}
                            placeholder="Ex: Coca-Cola"
                            required={true}
                        />
                        <label className="" name="description">Descrição</label>
                        <InputText
                            className="flex w-full mb-2"
                            name="description"
                            value={product.description}
                            onChange={handleInputTextChange}
                            placeholder="Ex: Coca-Cola"
                            required={false}
                        />
                        <div class="flex flex-row justify-content-between align-content-between mb-3 gap-2">
                            <div className="flex flex-column w-3 ">
                                <label className="mb-2" name="brand">Selecione uma marca</label>
                                <Dropdown
                                    className="flex"
                                    value={product.brand}
                                    filter
                                    onChange={handleBrandSetOnProduct}
                                    options={brand}
                                    optionLabel="name"
                                    maxSelectedLabels={1}
                                    required={true}
                                />
                            </div>
                            <div className="flex flex-column w-3">
                                <label className="mb-2" name="category">Selecione uma Categoria</label>
                                <Dropdown
                                    className="flex"
                                    value={product.category}
                                    filter
                                    onChange={handleCategorySetOnProduct}
                                    options={category}
                                    optionLabel="name"
                                    maxSelectedLabels={1}
                                    required={true}
                                />
                            </div>
                            <div className="flex flex-column w-3">
                                <label className="mb-2" name="costPrice">Preço de custo</label>
                                <InputNumber
                                    mode="currency"
                                    currency="BRL"
                                    locale="pt-BR"
                                    className="flex"
                                    name="costValue"
                                    value={product.costValue}
                                    onValueChange={handleInputTextChange}
                                    required={true}
                                />
                            </div>
                            <div className="flex flex-column w-3 ">
                                <label className="mb-2" name="salePrice">Preço de venda</label>
                                <InputNumber
                                    mode="currency"
                                    currency="BRL"
                                    locale="pt-BR"
                                    className="flex"
                                    value={product.saleValue}
                                    name="saleValue"
                                    onValueChange={handleInputTextChange}
                                    required={true}
                                />
                            </div>
                        </div>
                        {(product.images.length !== 0) &&
                            <div className={"card flex border-round-lg border-400 w-full h-15rem "}>
                                <ImageList sx={{ width: 1200, height: 200 }} cols={5} rowHeight={164}>
                                    {product.images.map((item) => (
                                        <ImageListItem key={item.id} className="align-items-center ">
                                            <img
                                                className="w-8 h-10rem mt-2 shadow-2 border-round-md align-items-center cursor-pointer delete-image-effect"
                                                srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                                                alt={item.title}
                                                loading="lazy"
                                                onClick={handleDeleteImage}
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </div>
                        }
                        <FileUpload
                            value={product.images}
                            previewWidth={30}
                            name="images" 
                            url={"#"}
                            accept="image/*"
                            maxFileSize={1000000}
                            multiple
                            customUpload={true}
                            auto={true}
                            uploadHandler={handleImageUpload}
                            emptyTemplate={<p className="m-0">Arraste e solte as imagens aqui.</p>}
                        />
                        <div className="align-items-end w-full h-5rem">
                            <Button
                                className="absolute mb-5 mr-4 bottom-0 right-0 dialog-button bg-red-500 border-transparent hover:bg-red-400 text-white "
                                name="confirmar"
                                severity="success"
                                label="Confirmar"
                                size="small"
                            />
                        </div>
                    </form>
                </Dialog>
            </div>
            <div className="m-3 ">
                <DataTable
                    className="mt-8 "
                    header={header}
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

/* const uploadPromises = product.images.map(async (image) => {
                    const url = await productService.getPresignedAwsUrl();
                    const response = await productService.sendImageToAwsS3(url, image);
                    if (response.status === 200) {
                        productImages.push({ "url": url.split('?')[0] });
                    }
                });

                await Promise.all(uploadPromises);
                const updatedProduct = { ...product, images: productImages };;
                if (updatedProduct.images.length === 0) {
                    return;
                }

                */