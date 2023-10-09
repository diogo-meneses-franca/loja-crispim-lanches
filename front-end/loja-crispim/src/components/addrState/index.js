import React, { useEffect, useState } from "react";
import { AddrStateService } from "../../service/AddrStateService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import 'primeicons/primeicons.css';
import '../universal.css'

const AddrState = () => {
    const [open, setOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 20 });
    const [addrStatePage, setAddrStatePage] = useState([]);
    const [editMode, setEditMode] = useState(false)
    const [addrState, setAddrState] = useState({ name: '', acronym: '' })
    const addrStateService = new AddrStateService();

    useEffect(() => {
        requestAddrState(paginationModel);
    }, [])

    useEffect(() => {
        requestAddrState(paginationModel);
    }, [paginationModel])

    const handleDialogClose = () => {
        setOpen(false);
        setEditMode(false);
        setAddrState({ name: '', acronym: '' })
    };

    const handleChange = (event) => {
        const { name, value } = event.target
        setAddrState({ ...addrState, [name]: value });
    }

    const requestAddrState = (pagination) => {
        addrStateService.get(pagination.page, pagination.pageSize)
            .then((response) => response.json())
            .then((data) => {
                setAddrStatePage(data.content)
            })
    }

    const onSave = (event) => {
        event.preventDefault();
        if (addrState.name.trim() === '' || addrState.acronym.trim() === '') {
            return;
        }
        if (editMode) {
            addrStateService.update(addrState)
                .then((response) => {
                    if (response.status === 200) {
                        requestAddrState(paginationModel);
                        setEditMode(false);
                        setAddrState({ name: '' })
                    }
                })
        } else {
            addrStateService.post(addrState)
                .then((response) => {
                    if (response.status === 201) {
                        requestAddrState(paginationModel);
                    }
                    setAddrState({ name: '' });
                })

        }
        handleDialogClose();
    };

    const onDataStatusChangeClick = (data) => {
        if (data.status === true) {
            addrStateService.delete(data.id)
                .then(() => requestAddrState(paginationModel));

        } else {
            let addresState = data;
            addresState.status = true;
            addrStateService.update(addresState)
                .then(() => requestAddrState(paginationModel));
        }
    }

    const handleEditButtonClick = (addrStateId) => {
        const selectedAddrState = (addrStatePage.find((addrState) => addrState.id === addrStateId));
        setAddrState({ id: selectedAddrState.id, name: selectedAddrState.name, acronym: selectedAddrState.acronym })
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
            <span className="text-xl text-900 font-bold">Estado</span>
            <Button className="form-button bg-blue-400 mr-6" label="Cadastrar" onClick={() => setOpen(true)} />
        </div>
    );

    return (
        <div className="w-full">
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
                        <Button className="absolute mb-5 mr-4 bottom-0 right-0 dialog-button " severity="success" label="Confirmar" size="small" />

                    </form>
                </Dialog>
            </div>
            <div className="m-3">
                <DataTable
                    className="mt-8"
                    header={header}
                    value={addrStatePage}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                    currentPageReportTemplate="{first} to {last} of {totalRecords}"
                    tableStyle={{
                        maxWidth: '100%',

                    }}>
                    <Column field="name" header="Nome" sortable></Column>
                    <Column field="acronym" header="Sigla" sortable></Column>
                    <Column body={createDateBodyTemplate} field="createDate" header="Criado em" sortable style={{ width: '12%' }} align={"left"}></Column>
                    <Column body={updateDateBodyTemplate} field="updateDate" header="Alterado em" sortable style={{ width: '13%' }} align={"left"}></Column>
                    <Column body={editAddrStateTemplate} header="Editar" style={{ width: '8%' }} align={"right"} />
                    <Column body={activeAddrStateTemplate} header="Ativa/Inativar" style={{ width: '15%' }} align={"center"} />
                </DataTable>
            </div>
        </div>
    )
}
export default AddrState;