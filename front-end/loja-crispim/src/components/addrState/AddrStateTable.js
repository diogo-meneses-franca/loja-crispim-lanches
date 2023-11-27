import React, { useEffect, useState } from "react";
import { AddrStateService } from "../../service/AddrStateService";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputSwitch } from "primereact/inputswitch";
import { Paginator } from "primereact/paginator";
import AddrStateDialog from "./AddrStateDialog";



const AddrStateTable = ()=>{
    const [addrState, setAddrState] = useState({ name: '', acronym: '', status: true })
    const [open, setOpen] = useState(false);
    const [addrStatePage, setAddrStatePage] = useState([]);
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
        setAddrState({ name: '', acronym: '', status: true })
        requestAddrState();
        setOpen(false);
    };

    const handlePageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
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
        setAddrState({ id: selectedAddrState.id, name: selectedAddrState.name, acronym: selectedAddrState.acronym, status: selectedAddrState.status });
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
    const header = () => {
        return (
            <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                <span className="text-xl text-red-500 font-bold">Estado</span>
                <Button className="form-button  bg-red-500 border-transparent hover:bg-red-400 mr-0 mr-6" label="Cadastrar" onClick={() => setOpen(true)} />
            </div>
        )
    };

    return (
        <div className="w-full">
            <AddrStateDialog open={open} addrStateToEdit={addrState} onClose={handleDialogClose} />
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
export default AddrStateTable;