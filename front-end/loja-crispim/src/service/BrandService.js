export class BrandService {

    url = process.env.REACT_APP_URL_API;

    get(page, rowsPerPage) {
        const url = `${this.url}/brand?page=${page}&size=${rowsPerPage}`;
        return fetch(url, {
            method: 'GET'
        }).catch((error) => { console.error('Erro: Falha na requisição das marcas ' + error) })//.then((response) =>console.log(response.json()));
    }

    post(brand) {
        return fetch(`${this.url}/brand`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(brand),
        }).catch((error) => console.error(error));

    }

    update(brand) {
        return fetch(`${this.url}/brand`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(brand),
        }).catch((error) => {
            console.error(error);
        });
    }

    delete(brandId) {
        return fetch(`${this.url}/brand/${brandId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


}