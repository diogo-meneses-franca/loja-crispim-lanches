import React, { useEffect, useState } from "react";
import { ProductService } from "../../service/ProductService";
import { BrandService } from "../../service/BrandService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { FileUpload } from 'primereact/fileupload';
import { MultiSelect } from 'primereact/multiselect';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import '../universal.css'

const Product = () => {
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
    const [productPage, setProductPage] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [product, setProduct] = useState({ name: '', description: '', costValue: '', saleValue: '', brand: { name: '' } })
    const [temporaryImages, setTemporaryImages] = useState([]);
    const [brand, setBrand] = useState([])
    const [selectedBrand, setSelectedBrand] = useState({})
    const productService = new ProductService();
    const brandService = new BrandService();

    useEffect(() => {
        requestProduct(paginationModel);
    }, [])

    useEffect(() => {
        requestProduct(paginationModel);
    }, [paginationModel])

    const handleDialogClose = () => {
        setOpen(false);
        setEditMode(false);
        setProduct({ name: '', description: '', costValue: '', saleValue: '', brand: {} });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct({ ...product, [name]: value });
    }

    const requestProduct = (pagination) => {
        productService.get(pagination.page, pagination.pageSize)
            .then((response) => response.json())
            .then((data) => {
                setProductPage(data.content)
            })
    }

    const onSave = async (event) => {
        const productImages = []
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
                        setProduct({ name: '', description: '', costValue: '', saleValue: '' });
                    }
                })
        } else {
            const uploadPromises = temporaryImages.map(async (image) => {
                const url = await productService.getPresignedAwsUrl();
                const response = await productService.sendImageToAwsS3(url, image);
                if (response.status === 200) {
                    productImages.push({ "url": url.split('?')[0] });
                }
            });

            await Promise.all(uploadPromises);
            const updatedProduct = { ...product, images: productImages };;
            productService.post(updatedProduct)
                .then((response) => {
                    if (response.status === 201) {
                        requestProduct(paginationModel);
                    }
                    setProduct({ name: '', description: '', costValue: '', saleValue: '', images: [] });
                })
        }
        handleDialogClose();
    }

    const onDataStatusChangeClick = (data) => {
        if (data.status === true) {
            productService.delete(data.id).then(() => requestProduct(paginationModel));

        } else {
            let prod = data;
            prod.status = true;
            productService.update(prod).then(() => requestProduct(paginationModel));
        }
    }

    const handleEditButtonClick = (productId) => {
        getBrandWhenDialogOpen();
        const selectedProduct = (productPage.find((product) => product.id === productId));
        setProduct({ id: selectedProduct.id, name: selectedProduct.name, brand: selectedProduct.brand })
        setEditMode(true);
        setOpen(true);
    };

    const getBrandWhenDialogOpen = () => {
        return brandService.get()
            .then((response) => response.json())
            .then((data) => {
                console.log(data.content);
                setBrand(data.content);
            })
    }

    const handleOpenDialog = () => {
        getBrandWhenDialogOpen();
        setOpen(true);
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
    };*/
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
        return <img src={product.images[0]?.url} className="product-image" onClick={() => setOpen(true)} />;
    };

    const handleFakeImgUpload = (event) => {
        setTemporaryImages(event.files)
    }

    /*
    <Column field="category.name" header="Categoria" sortable style={{ width: '8%' }}></Column>
                    <Column field="brand.name" header="Marca" sortable style={{ width: '8%' }}></Column>
                    */

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Produto</span>
            <Button className="form-button bg-blue-400 mr-0" label="Cadastrar" onClick={() => setOpen(true)} />
        </div>
    );
    return (
        <div className="w-full">
            <div className="card flex justify-content-center">
                <Dialog
                    className="flex ml-8 w-8 "
                    header={editMode ? "Editar Produto" : "Cadastrar Produto"}
                    visible={open} onHide={handleDialogClose}
                    style={{ width: '50vw' }
                    }>
                    <form >
                        <label className="mb-6" name="name">Nome</label>
                        <InputText className="flex w-full mb-2" name="name" value={product.name} onChange={handleChange} placeholder="Ex: Coca-Cola" required={true} />
                        <label className="mb-6" name="description">Descrição</label>
                        <InputText className="flex w-full mb-2" name="description" value={product.description} onChange={handleChange} placeholder="Ex: Coca-Cola" required={false} />
                        <MultiSelect value={product.brand} onChange={(e) => setProduct({ ...product, brand: e.value })} options={brand} optionLabel="name"
                            placeholder="Marca" maxSelectedLabels={1} className="w-full md:w-20rem" />
                        <label className="mb-6" name="costPrice">Preço de custo</label>
                        <InputText className="flex w-full mb-2" name="costValue" value={product.costValue} onChange={handleChange} required={true} />
                        <label className="mb-6" name="salePrice">Preço de venda</label>
                        <InputText className="flex w-full mb-2" value={product.saleValue} name="saleValue" onChange={handleChange} required={true} />
                        <FileUpload value={product.images} previewWidth={30} name="images" url={"#"} accept="image/*" maxFileSize={1000000} multiple customUpload uploadHandler={handleFakeImgUpload} emptyTemplate={<p className="m-0">Arraste e solte as imagens aqui.</p>} />
                        <div className="align-items-end w-full h-5rem">
                            <Button className="absolute mb-5 mr-4 bottom-0 right-0 dialog-button " name="confirmar" severity="success" label="Confirmar" size="small" onSubmit={onSave} />
                        </div>
                    </form>
                </Dialog>
            </div>
            <div className="m-3">
                <DataTable
                    className="mt-8" 
                    header={header}
                    value={productPage}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    tableStyle={{
                        maxWidth: '100%',
                    }}>
                    <Column field="name" header="Nome" sortable style={{ width: '8%' }}></Column>
                    <Column field="images[0]?.url" header="Imagem" body={imageBodyTemplate} align={"center"}></Column>
                    <Column field="description" header="Descrição"></Column>
                    <Column field="costValue" body={costValueBodyTemplate} header="custo" sortable style={{ width: '7%' }}></Column>
                    <Column field="saleValue" body={saleValueBodyTemplate} header="venda" sortable style={{ width: '7%' }}></Column>
                    <Column body={editProductTemplate} header="Editar" style={{ width: '8%' }} align={"center"} />
                    <Column body={activeProductTemplate} header="Ativa/Inativar" style={{ width: '8%' }} align={"center"} />
                </DataTable>
            </div>
        </div>
    )
}
export default Product;