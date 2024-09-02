import { User } from "@/types";

export const enumToArray = (enumme: any) =>
    Object.keys(enumme).map((key) => ({ value: enumme[key], id: key }));

export const getToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('vending-token');
        return token
    }
}

export const saveToken = (token: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('vending-token', token)
    }
}

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('vending-token')
    }
}

export const saveUser = (user: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('vending-user', JSON.stringify(user))
    }
}

export const removeUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('vending-user')
    }
}

export const getUser = () => {
    let userString = null
    if (typeof window !== 'undefined') {
        userString = localStorage.getItem('vending-user');
    }

    if (userString) {
        try {
            const user = JSON.parse(userString);
            return user as User;
        } catch (error) {
            console.error('Error parsing user from local storage:', error);
            return null;
        }
    } else {
        return null;
    }
}