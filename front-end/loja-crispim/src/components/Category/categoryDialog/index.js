
import React, { useEffect, useState, useRef } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { CategoryService } from "../../../service/CategoryService";



const CategoryDialog = ({open, onclose, categoryToEdit, editMode}) => {
    const [category, setCategory] = useState({ name: '', status: true });
    const toast = useRef(null);
    const categoryService = new CategoryService();

    useEffect(()=>{
        (editMode) && setCategory(categoryToEdit);
    },[editMode])
    
    const handleDialogClose = ()=>{
        onclose();
        setCategory({name: '', status: true});
    }


    const handleChange = (event) => {
        setCategory({ ...category, name: event.target.value });
    }

    const onSave = (event) => {
        event.preventDefault();
        if (category.name.trim() === '') {
            return;
        }
        if (editMode) {
            try{
                categoryService.update(category)
                    .then((response) => {
                        if (response.status === 200) {
                            showSuccess();
                            handleDialogClose();
                            setCategory({ name: '', status: true });
                        }
                    })

            }catch(error){
                showError();
                console.log(error);
            }
        } else {
            try{
                categoryService.post(category)
                    .then((response) => {
                        if (response.status === 201) {
                            showSuccess();
                            handleDialogClose();
                        }
                        setCategory({ name: '', status: true });
                    })

            }catch(error){
                showError();
                console.log(error);
            }

        }
    };


    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Registro Efetuado com sucesso!', life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Falha no registro! Tente novamente mais tarde.', life: 3000});
    }

    return (
        <>
            <Toast ref={toast} />
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
                        <InputText className="flex w-full mb-2" value={category.name} onChange={handleChange} placeholder="Ex: Alimentos" required={true} />
                        <Button className="absolute mb-5 mr-4 mt-3 bottom-0 right-0 dialog-button bg-green-400 hover:bg-green-500 border-transparent" severity="success" label="Confirmar" size="small" />
                    </form>
                </Dialog>
            </div>

        </>
    )
}
export default CategoryDialog;