import React, { useEffect, useState } from "react";
import { ProductService } from "../../service/ProductService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { FileUpload } from 'primereact/fileupload';
import { ImageCompressor } from 'image-compressor';
import AWS from 'aws-sdk';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import './Product.css';

const Product = () => {
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
    const [productPage, setProductPage] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [product, setProduct] = useState({ name: '', description: '', costValue: '', saleValue: '', images: [], category: {}, brand: {} })
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
        const {name, value} = event.target;
        setProduct({ ...product, [name]: value });
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
            productService.delete(data.id).then(()=>requestProduct(paginationModel));

        } else {
            let prod = data;
            prod.status = true;
            productService.update(prod).then(()=>requestProduct(paginationModel));
        }
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

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const costValueBodyTemplate = (product) => {
        return formatCurrency(product.costValue);
    };

    const saleValueBodyTemplate = (product) => {
        return formatCurrency(product.saleValue);
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

    const imageBodyTemplate = (product) => {
        return <img src={product.images[0].url} className="product-image" onClick={()=> setOpen(true)}/>;
    };

    AWS.config.update({
        accessKeyId: 'chave',
        secretAccessKey: 'senha'
    });

    const s3 = new AWS.S3();

    const handleFileUpload = async (event) => {
        console.log(event.file.name)
        const files = event.files;
        console.log(files)
        if(!files || files.length === 0) return;

        for(const file of files){
            try{
                const compressedImage = await new ImageCompressor(file, {quality: 0.6}).compress();
                const fileName = `uploads/${Date.now()}-${compressedImage.name}`;

                const params = {
                    Bucket: 'loja-crispim' ,
                    key: fileName,
                    Body: compressedImage
                }
                await s3.upload(params).promise();
                const imageUrl = `http://loja-crispim.s3.amazonaws.com/${fileName}`

                console.log("Uploaded image:", imageUrl);
            }catch(error){
                console.log('Error uploading image: ', error);
            }
        }

    }
    const handleUploadResponse = (response) => {
        if (response.success) {
          console.log('Image uploaded successfully:', response.fileName);
          // Handle success, e.g., update your UI or store the S3 URL
        } else {
          console.error('Image upload failed:', response.error);
          // Handle the error, e.g., display an error message to the user
        }
      };
    return (
        <div className="product-view">
            <div>
                <Button className="form-button" label="Cadastrar" onClick={() => setOpen(true)} />
            </div>
            <div className="card flex justify-content-center">
                <Dialog header={editMode ? "Editar Produto" : "Cadastrar Produto"} visible={open} onHide={handleDialogClose}
                    style={{ width: '50vw' }}>
                    <form >
                        <label htmlFor="name">Nome</label>
                        <InputText name="name" value={product.name} onChange={handleChange} placeholder="Ex: Coca-Cola" required={true} />
                        <label htmlFor="description">Descrição</label>
                        <InputText name="description" value={product.description} onChange={handleChange} placeholder="Ex: Coca-Cola" required={false} />
                        <label htmlFor="costPrice">Preço de custo</label>
                        <InputText name="costValue" value={product.costValue} onChange={handleChange} required={true} />
                        <label htmlFor="salePrice">Preço de venda</label>
                        <InputText value={product.saleValue} name="saleValue" onChange={handleChange} required={true}/>
                        <FileUpload className="file-sender" customUpload={handleFileUpload} onUpload={handleUploadResponse} name="images" multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Arraste e solte as imagens aqui.</p>} />
                        <Button severity="success" label="Confirmar" size="small" onSubmit={onSave} />
                    </form>
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
                        maxWidth: '80%',
                        marginLeft: '10%',

                    }}>
                    <Column field="name" header="Nome" sortable style={{ width: '15%' }}></Column>
                    <Column field="images[0]" header="Imagem" body={imageBodyTemplate}></Column>
                    <Column field="description" header="Descrição"></Column>
                    <Column field="costValue" body={costValueBodyTemplate} header="custo" sortable style={{ width: '7%' }}></Column>
                    <Column field="saleValue" body={saleValueBodyTemplate} header="venda" sortable style={{ width: '7%' }}></Column>
                    <Column field="category.name" header="Categoria" sortable style={{ width: '8%' }}></Column>
                    <Column field="brand.name" header="Marca" sortable style={{ width: '8%' }}></Column>
                    <Column body={createDateBodyTemplate} field="createDate" header="Criado em" sortable style={{ width: '9%' }} align={"left"}></Column>
                    <Column body={updateDateBodyTemplate} field="updateDate" header="Alterado em" sortable style={{ width: '10%' }} align={"left"}></Column>
                    <Column body={editProductTemplate} header="Editar" style={{ width: '5%' }} align={"center"} />
                    <Column body={activeProductTemplate} header="Ativa/Inativar" style={{ width: '5%' }} align={"center"} />
                </DataTable>
            </div>
        </div>
    )
}
export default Product;