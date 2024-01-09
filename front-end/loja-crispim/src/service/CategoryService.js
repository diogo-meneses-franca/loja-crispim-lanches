export class CategoryService {

    url=process.env.REACT_APP_URL_API

    get(page, rowsPerPage) {
        const url = `${this.url}/category?page=${page}&size=${rowsPerPage}`;
        return fetch(url, {
            method: 'GET'
        }).catch((error) => { console.error('Erro: Falha na requisição das categorias ' + error) })
    }

    post(category) {
        return fetch(`${this.url}/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category),
        }).catch((error) => console.error(error));

    }

    update(category) {
        return fetch(`${this.url}/category`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category),
        }).catch((error) => {
            console.error(error);
        });
    }

    delete(categoryId) {
        return fetch(this.url + `/category/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


}