import axios from 'axios'
import { getToken, removeToken, removeUser } from '@/utils/'
import { errorToast } from '@/utils'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

api.interceptors.response.use(data => data, (error) => {
    if (error.response?.status === 401) {
        removeToken()
        removeUser()
        errorToast('Session expired')
        window.location.href = '/login';
    }
    throw error;
});

export default api