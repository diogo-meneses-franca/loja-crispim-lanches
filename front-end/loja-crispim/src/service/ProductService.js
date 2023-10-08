export class ProductService {

    url = `${process.env.REACT_APP_URL_API}/product`;

    get(page, rowsPerPage) {
        const url = `${this.url}?page=${page}&size=${rowsPerPage}`;
        return fetch(url, {
            method: 'GET'
        }).catch((error) => { console.error('Erro: Falha na requisição dos produtos ' + error) })
    }

    post(product) {
        return fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product),
        }).catch((error) => console.error(error));

    }

    update(product) {
        return fetch(this.url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product),
        }).catch((error) => {
            console.error(error);
        });
    }

    delete(productId) {
        return fetch(`${this.url}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    getPresignedAwsUrl(){
        return fetch(`${process.env.REACT_APP_URL_API}/presignedUrl`,
            {
                method: "GET"
            })
            .then((response)=>response.json())
            .then((data)=>data)

    }

    sendImageToAwsS3(url, image){
        return fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "image/jpeg"
            },
            body: image
        })
    }


}
