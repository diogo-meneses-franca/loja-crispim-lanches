import React, { useEffect, useState, useRef } from "react";
import { AddrStateService } from "../../service/AddrStateService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from 'primereact/toast';
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import '../universal.css'

const AddrState = () => {
    const [open, setOpen] = useState(false);
    const [addrStatePage, setAddrStatePage] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [addrState, setAddrState] = useState({ name: '', acronym: '', status: true })
    const toast = useRef(null);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const addrStateService = new AddrStateService();

    useEffect(() => {
        requestAddrState(first, rows);
    }, [])

    useEffect(() => {
        requestAddrState(first, rows);
    }, [first, rows])

    const handleDialogClose = () => {
        setOpen(false);
        setEditMode(false);
        setAddrState({ name: '', acronym: '', status: true })
    };

    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setAddrState({ ...addrState, [name]: value });
    }

    const requestAddrState = () => {
        const page = first / rows;
        addrStateService.get(page, rows)
            .then((response) => response.json())
            .then((data) => {
                setTotalElements(data.totalElements);
                setAddrStatePage(data.content)
            })
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
                            requestAddrState(first, rows);
                            setEditMode(false);
                            setAddrState({ name: '', acronym: '', status: true })
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
                            requestAddrState(first, rows);
                        }
                        setAddrState({ name: '', acronym: '', status: true });
                    })

            }catch (error) {
                showError();
                console.log(error);
            }
        }
        handleDialogClose();
    };

    const onDataStatusChangeClick = (data) => {
        if (data.status === true) {
            addrStateService.delete(data.id)
                .then(() => requestAddrState(first, rows));

        } else {
            let addresState = data;
            addresState.status = true;
            addrStateService.update(addresState)
                .then(() => requestAddrState(first, rows));
        }
    }

    const handleEditButtonClick = (addrStateId) => {
        const selectedAddrState = (addrStatePage.find((addrState) => addrState.id === addrStateId));
        setAddrState({ id: selectedAddrState.id, name: selectedAddrState.name, acronym: selectedAddrState.acronym, status: selectedAddrState.status })
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
    const editAddrStateTemplate = (rowData) => {
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

    const activeAddrStateTemplate = (rowData) => {
        return (
            <InputSwitch checked={rowData.status} onChange={() => onDataStatusChangeClick(rowData)} />
        );
    };
    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-red-500 font-bold">Estado</span>
            <Button className="form-button  bg-red-500 border-transparent hover:bg-red-400 mr-0 mr-6" label="Cadastrar" onClick={() => setOpen(true)} />
        </div>
    );
    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registro Efetuado com sucesso!', life: 3000 });
    }
    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Falha no registro! Tente novamente mais tarde.', life: 3000 });
    }

    return (
        <div className="w-full">
            <Toast ref={toast} />
            <div className="card flex justify-content-center">
                <Dialog
                    className="flex ml-8 w-8 h-20rem "
                    header={editMode ? "Editar Estado" : "Cadastrar Estado"}
                    visible={open} onHide={handleDialogClose}
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
            <div className="m-3">
                <DataTable
                    className="mt-8"
                    header={header}
                    value={addrStatePage}
                    >
                    <Column field="name" header="Nome" sortable></Column>
                    <Column field="acronym" header="Sigla" sortable></Column>
                    <Column body={createDateBodyTemplate} field="createDate" header="Criado em" sortable style={{ width: '12%' }} align={"left"}></Column>
                    <Column body={updateDateBodyTemplate} field="updateDate" header="Alterado em" sortable style={{ width: '13%' }} align={"left"}></Column>
                    <Column body={editAddrStateTemplate} header="Editar" style={{ width: '8%' }} align={"right"} />
                    <Column body={activeAddrStateTemplate} header="Ativa/Inativar" style={{ width: '15%' }} align={"center"} />
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
export default AddrState;