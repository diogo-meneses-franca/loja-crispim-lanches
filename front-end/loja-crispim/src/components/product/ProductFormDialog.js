import React, { useState, useEffect, useRef } from 'react';
import { BrandService } from "../../service/BrandService";
import { CategoryService } from "../../service/CategoryService";
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { ProductService } from "../../service/ProductService";

const ProductFormDialog = (open, productToEdit, editMode, onClose) => {
    const [product, setProduct] = useState({ name: '', description: '', costValue: 0, saleValue: 0, category: {}, brand: {}, status: true, images: [] });
    const [brand, setBrand] = useState([]);
    const [category, setCategory] = useState([]);
    const toast = useRef(null);
    const brandService = new BrandService();
    const categoryService = new CategoryService();
    const productService = new ProductService();

    useEffect(() => {
        if(open){
            getBrandWhenDialogOpen();
            getCategoryWhenDialogOpen();
        }

        editMode && setProduct(productToEdit);
    },[open])

    const handleDialogClose = () => {
        setProduct({ name: '', description: '', costValue: 0, saleValue: 0, category: {}, brand: {}, status: true, images: [] });
        setBrand([]);
        setCategory([]);
        onClose();
    }

    const handleInputTextChange = (event) => {
        const { name, value } = event.target;
        setProduct({ ...product, [name]: value });
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

    const handleImageUpload = async (event) => {
        const productImages = product.images;
        const files = event.files;
        for (let file of files) {
            const url = await productService.getPresignedAwsUrl();
            const response = await productService.sendImageToAwsS3(url, file);
            if (response.status === 200) {
                productImages.push({ "url": url.split('?')[0] });
                setProduct({ ...product, images: productImages });
            }
        }
    }

    const handleBrandSetOnProduct = (event) => {
        setProduct({ ...product, brand: event.value });
    }

    const handleCategorySetOnProduct = (event) => {
        setProduct({ ...product, category: event.value });
    }
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
                            handleDialogClose();
                            showSuccess();
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
                            handleDialogClose();
                            showSuccess();
                        }
                        setProduct({ name: '', description: '', costValue: 0, saleValue: 0, images: [], category: {}, brand: {}, status: true });
                    })

            } catch (error) {
                showError();
                console.log(error);
            }
        }
    }
    return (
        <>

            <Toast ref={toast} />
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
        </>
    )
}
export default ProductFormDialog;