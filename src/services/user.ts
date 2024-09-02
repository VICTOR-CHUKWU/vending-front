import {  LoginPayload, SignupPayload, UpdateProfilePayload, User } from "@/types";
import api from "./api";
import { AxiosResponse } from "axios";
import {  DefaultResponse, UserResponseData, UsersResponse } from "@/types/apiResponse";

export const login = async (payload: LoginPayload):Promise<UserResponseData> => {
    try {
        const resp: AxiosResponse<UserResponseData> = await api.post(`auth/signin`, { ...payload })
        return resp.data

    }  catch (error: any) {
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
            // Fallback to generic error message if no response or message is found
            errorMessage = error.message;
        }

        console.error('Login error:', errorMessage);
        throw new Error(errorMessage);
    }
}


export const signup = async (payload: SignupPayload):Promise<UserResponseData> => {
    try {
        const resp: AxiosResponse<UserResponseData> = await api.post(`/auth/signup`, { ...payload })
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
            // Fallback to generic error message if no response or message is found
            errorMessage = error.message;
        }

        console.error('Login error:', errorMessage);
        throw new Error(errorMessage);
    }
}

export const updateUser = async (payload: UpdateProfilePayload):Promise<DefaultResponse> => {
    try {
        const resp: AxiosResponse<DefaultResponse> = await api.patch(`/admin/user/updateStatus`, { ...payload })
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
            // Fallback to generic error message if no response or message is found
            errorMessage = error.message;
        }

        console.error('Login error:', errorMessage);
        throw new Error(errorMessage);
    }
}


export const fetchAll = async (role?: string):Promise<UsersResponse> => {
    const params = new URLSearchParams();

    if (role !== undefined) params.append('role',role.toString());
    try {
        const resp: AxiosResponse<UsersResponse> = await api.get(`/admin/user/getAllUsers?${params.toString()}`)
        return resp.data
    } catch (error: any) {
        throw new Error(error.response)
    }
}

export const fetchUser = async (id: string):Promise<UsersResponse> => {
   
    try {
        const resp: AxiosResponse<UsersResponse> = await api.get(`/admin/user/getUserByRole/admin/${id}`)
        return resp.data
    } catch (error: any) {
        throw new Error(error.response)
    }
}

export const deleteUser = async (id: string):Promise<DefaultResponse> => {
   
    try {
        const resp: AxiosResponse<UsersResponse> = await api.delete(`/admin/user/getUserByRole/admin/${id}`)
        return resp.data
    } catch (error: any) {
        throw new Error(error.response)
    }
}

export const getCoin = async (id: string):Promise<UsersResponse> => {
    try {
        const resp: AxiosResponse<UsersResponse> = await api.get(`/admin/user/getUserByRole/installer/${id}`)
        return resp.data
    } catch (error: any) {
        throw new Error(error.response)
    }
}


export const buyCoin = async (coinValue: number, id: string):Promise<UserResponseData> => {
    try {
        const resp: AxiosResponse<UserResponseData> = await api.post(`/users/buy-coin/${id}`, { coinValue })
        return resp.data

    } catch (error) {
        throw new Error()
    }
}


export const resetCoin = async (id: string):Promise<UserResponseData>  => {
    try {
        const resp: AxiosResponse<UserResponseData>= await api.post(`/users/reset-coin/${id}`)
        return resp.data

    } catch (error) {
        throw new Error()
    }
}


