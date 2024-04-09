import { API_HOST } from "Common/Consts"

const afterFetch = (res: Response) => {
    switch (res.status) {
        case 500: 
            throw res.statusText;
        default:
            case 200: 
            return res.json();
    }
}

interface IGetOptions {
    headers?: HeadersInit;
}

interface IFetchOptions {
    body?: string,
    headers?: HeadersInit;
}

export class Api{
    private static defaultHeaders: HeadersInit = {'Content-type': 'application/json'}


    static Get = async function<T = any>(url: string, options?: IGetOptions): Promise<T> {
        return fetch(
            `${API_HOST}${url}`, 
            {
                method: 'GET', 
                headers: {
                    ...Api.defaultHeaders, 
                    ...options?.headers || {}
                }
            }).then(afterFetch);
    }
    
    static Post = async function<T>(url: string, options?: IFetchOptions): Promise<T> {
        return fetch(
            `${API_HOST}${url}`, 
        {
            method: 'POST', 
            body: options?.body || '', 
            headers: {
                ...Api.defaultHeaders, 
                ...options?.headers || {}
            }
        }).then(afterFetch);
    }

    static Delete = async function<T>(url: string, options?: IFetchOptions): Promise<T> {
        return fetch(
            `${API_HOST}${url}`, 
        {
            method: 'DELETE', 
            body: options?.body || '', 
            headers: {
                ...Api.defaultHeaders, 
                ...options?.headers || {}
            }
        }).then(afterFetch);
    }

    static Put = async function<T>(url: string, options?: IFetchOptions): Promise<T> {
        return fetch(
            `${API_HOST}${url}`, 
        {
            method: 'PUT', 
            body: options?.body || '', 
            headers: {
                ...Api.defaultHeaders, 
                ...options?.headers || {}
            }
        }).then((afterFetch));
    }
}