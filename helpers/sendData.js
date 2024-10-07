import { postRequest } from './network';

export const productClick = async (info) => {
    console.log("productClick", info)
    let headers = {
        "x-api-key": "cyUi8JOplpParc8RqoeQcYkQiFNzOjePQJZMLAYNi",
    }
    await postRequest("https://8berd09w4d.execute-api.ap-south-1.amazonaws.com/prod/api/V1/product_view", info, headers)
        .then(async res => {
            console.log("then res productClick", res);
            console.log("then res productClick", await res.json());
        })
        .then(data => {
            console.log("then data productClick", data);
        })
        .catch(error => console.log("error productClick", error));
}

export const addToCartClick = async (info) => {
    console.log("addToCartClick", info)
    let headers = {
        "x-api-key": "cyUi8JOplpParc8RqoeQcYkQiFNzOjePQJZMLAYNi",
    }
    await postRequest("https://8berd09w4d.execute-api.ap-south-1.amazonaws.com/prod/api/V1/add_to_cart", info, headers)
        .then(async res => {
            console.log("then res addToCartClick", res);
            console.log("then res addToCartClick", await res.json());
        })
        .then(data => {
            console.log("then data addToCartClick", data);
        })
        .catch(error => console.log("error addToCartClick", error));
}

export const clientError = async (info) => {
    console.log("clientError", info)
    let headers = {
        "x-api-key": "cyUi8JOplpParc8RqoeQcYkQiFNzOjePQJZMLAYNi",
    }
    await postRequest("https://8berd09w4d.execute-api.ap-south-1.amazonaws.com/prod/api/V1/query_error", info, headers)
        .then(async res => {
            console.log("then res clientError", res);
            console.log("then res clientError", await res.json());
        })
        .then(data => {
            console.log("then data clientError", data);
        })
        .catch(error => console.log("error clientError", error));
}

export const newsClick = async (info) => {
    console.log("newsClick", info)
    let headers = {
        "x-api-key": "cyUi8JOplpParc8RqoeQcYkQiFNzOjePQJZMLAYNi",
    }
    await postRequest("https://8berd09w4d.execute-api.ap-south-1.amazonaws.com/prod/api/V1/news_action", info, headers)
        .then(async res => {
            console.log("then res newsClick", res);
            console.log("then res newsClick", await res.json());
        })
        .then(data => {
            console.log("then data newsClick", data);
        })
        .catch(error => console.log("error newsClick", error));
}