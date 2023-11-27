import React, { useEffect, useState, useRef } from "react";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { AddrStateService } from "../../service/AddrStateService";


const AddrStateDialog = ({open, addrStateToEdit, onClose})=>{
    const [addrState, setAddrState] = useState({ name: '', acronym: '', status: true })
    const [editMode, setEditMode] = useState(false);
    const toast = useRef(null);
    const addrStateService = new AddrStateService();

    useEffect(()=>{
        if(addrStateToEdit){
            setAddrState(addrStateToEdit);
            setEditMode(true);
        }
    },[open])

    

    const handleChange = (event) => {
        const { name, value } = event.target
        setAddrState({ ...addrState, [name]: value });
    }

    const handleDialogClose = ()=>{
        setEditMode(false);
        setAddrState({name: '', acronym: '', status: true});
        onClose();
    }

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registro Efetuado com sucesso!', life: 3000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Falha no registro! Tente novamente mais tarde.', life: 3000 });
    }

    const onSave = (event) => {
        event.preventDefault();
        if (addrState.name.trim() === '' || addrState.acronym.trim() === '') {
            return;
        }
        if (editMode) {
            try {
                addrStateService.update(addrState)
                    .then((response) => {
                        if (response.status === 200) {
                            showSuccess();
                            handleDialogClose();
                        }
                    })

            } catch (error) {
                showError();
                console.log(error);
            }
        } else {
            try {
                addrStateService.post(addrState)
                    .then((response) => {
                        if (response.status === 201) {
                            showSuccess();
                            handleDialogClose();

                        }
                    })

            }catch (error) {
                showError();
            }
        }
    };
    return(
        <>
            <Toast ref={toast} />
            <div className="card flex justify-content-center">
                <Dialog
                    className="flex ml-8 w-8 h-20rem "
                    header={editMode ? "Editar Estado" : "Cadastrar Estado"}
                    visible={open} 
                    onHide={handleDialogClose}
                    style={{ width: '50vw' }
                    }>
                    <form onSubmit={onSave}>
                        <label className="mb-6" htmlFor="name">Nome</label>
                        <InputText className="flex w-full mb-2" name="name" value={addrState.name} onChange={handleChange} placeholder="Ex: Paraná" required={true} />
                        <label className="mb-6" htmlFor="acronym">Sigla</label>
                        <InputText className="flex w-full mb-2" name="acronym" value={addrState.acronym} onChange={handleChange} placeholder="Ex: PR" required={true} />
                        <Button className="absolute mb-5 mr-4 bottom-0 right-0 dialog-button  bg-red-500 border-transparent hover:bg-red-400 mr-0 " severity="success" label="Confirmar" size="small" />
                    </form>
                </Dialog>
            </div>
        </>
    )
}
export default AddrStateDialog;