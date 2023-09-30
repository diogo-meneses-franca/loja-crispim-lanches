export class AddrStateService {

    url = `${process.env.REACT_APP_URL_API}/addrState`;

    get(page, rowsPerPage) {
        const url = `${this.url}?page=${page}&size=${rowsPerPage}`;
        return fetch(url, {
            method: 'GET'
        }).catch((error) => { console.error('Erro: Falha na requisição dos estados ' + error) })
    }

    post(addrState) {
        return fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addrState),
        }).catch((error) => console.error(error));

    }

    update(addrState) {
        return fetch(this.url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addrState),
        }).catch((error) => {
            console.error(error);
        });
    }

    delete(addrStateId) {
        return fetch(`${this.url}/${addrStateId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


}