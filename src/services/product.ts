import {  LoginPayload, ProductCreationPayload, ProductPurchasePayload, SignupPayload, UpdateProductPayload, UpdateProfilePayload, User } from "@/types";
import api from "./api";
import { AxiosResponse } from "axios";
import {  DefaultResponse, productResponse, productsResponse, purchaseResponse, purchasesResponse, UserResponseData, UsersResponse } from "@/types/apiResponse";

export const fetchProducts = async (page?: number, limit?: number):Promise<productsResponse> => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page',page.toString());
    if (limit !== undefined) params.append('perPage', limit.toString());
    try {
        const resp: AxiosResponse<productsResponse> = await api.get(`/products?${params.toString()}`)
        return resp.data
    } catch (error: any) {
        throw new Error(error.response)
    }
}

export const fetchPurchases = async (page?: number, limit?: number):Promise<purchasesResponse> => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page',page.toString());
    if (limit !== undefined) params.append('perPage', limit.toString());
    try {
        const resp: AxiosResponse<purchasesResponse> = await api.get(`/products/purchases?${params.toString()}`)
        return resp.data
    } catch (error: any) {
        throw new Error(error.response)
    }
}

export const fetchProduct = async (id: string):Promise<productResponse> => {
   
    try {
        const resp: AxiosResponse<productResponse> = await api.get(`/products/${id}`)
        return resp.data
    } catch (error: any) {
        throw new Error(error.response)
    }
}

export const fetchPurchase = async (id: string):Promise<purchaseResponse> => {
   
    try {
        const resp: AxiosResponse<purchaseResponse> = await api.get(`/products/purchases/${id}`)
        return resp.data
    } catch (error: any) {
        throw new Error(error.response)
    }
}

export const createProduct = async (payload: ProductCreationPayload):Promise<productResponse> => {
    try {
        const resp: AxiosResponse<productResponse> = await api.post(`/products`, { ...payload })
        return resp.data
    } catch (error: any) {
        throw new Error(error.response.data.errors[0].message || 'something went wrong')
    }
}

export const buyProduct = async (payload: ProductPurchasePayload[]):Promise<purchasesResponse> => {
    try {
        const resp: AxiosResponse<purchasesResponse> = await api.post(`/products/buy-product`, payload)
        return resp.data
    } catch (error: any) {
        let errorMessage = 'Something went wrong';

        if (error.response) {
            // Check if error.response.data is an object and contains errors
            if (error.response.data && typeof error.response.data === 'object') {
                if (Array.isArray(error.response.data.errors)) {
                    errorMessage = error.response.data.errors[0]?.message || errorMessage;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            }
        } else if (error.message) {
            errorMessage = error.message;
        }

        console.error('Login error:', errorMessage);
        throw new Error(errorMessage);
    }
}

export const updateProduct = async (payload: UpdateProductPayload, id: string):Promise<DefaultResponse> => {
    try {
        const resp: AxiosResponse<DefaultResponse> = await api.patch(`/products/${id}`, { ...payload })
        return resp.data
    } catch (error: any) {
        console.log(error, 'seror')
        throw new Error(error.response.data.errors || 'something went wrong')
    }
}

export const deleteProduct = async (id: string):Promise<DefaultResponse> => {
   
    try {
        const resp: AxiosResponse<UsersResponse> = await api.delete(`/products/${id}`)
        return resp.data
    } catch (error: any) {
        throw new Error(error.response)
    }
}



