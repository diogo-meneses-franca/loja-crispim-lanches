import React, { useState, useRef, useEffect } from "react";
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { BrandService } from "../../service/BrandService";
import { Button } from 'primereact/button';

export const BrandDialog = ({ open, brandToEdit, onclose}) => {
    const [brand, setBrand] = useState({ name: '', status: true });
    const [editMode, setEditMode] = useState(false);
    const toast = useRef(null);
    const brandService = new BrandService();

    useEffect(()=>{
        if(brandToEdit){
            setEditMode(true);
            setBrand(brandToEdit);
        }
    },[open]);

    const handleDialogClose = () => {
        onclose();
        setBrand({ name: '', status: true });
    };

    const handleChange = (event) => {
        setBrand({ ...brand, name: event.target.value });
    };

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registro Efetuado com sucesso!', life: 3000 });
    };
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Falha no registro! Tente novamente mais tarde.', life: 3000 });
    };
    const onSave = (event) => {
        event.preventDefault();
        if (brand.name.trim() === '') {
            return;
        }
        if (editMode) {
            try {
                brandService.update(brand)
                    .then((response) => {
                        if (response.status === 200) {
                            handleDialogClose();
                            showSuccess();
                        }
                    });
            } catch (error) {
                showError();
                console.error(error);
            }
        } else {
            try {
                brandService.post(brand)
                    .then((response) => {
                        if (response.status === 201) {
                            handleDialogClose();
                            showSuccess();
                        }
                    });
            } catch (error) {
                showError();
                console.error(error);
            }
        }
        
        
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="card flex justify-content-center">
                <Dialog
                    className="flex ml-8 w-8 h-15rem"
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
                            className="absolute mb-5 mr-4 bottom-0 right-0 dialog-button bg-red-500 border-transparent hover:bg-red-400 mr-0"
                            severity="success"
                            label="Confirmar"
                            size="small"/>
                    </form>
                </Dialog>
            </div>
        </>
    );

};
export default BrandDialog;
