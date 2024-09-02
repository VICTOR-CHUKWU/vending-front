import {toast} from "react-toastify";



declare var $: any;

export const successToast = (message: string, config: object= {}) => {
    return toast(message,{type:"success",...config});
}
export const warning = (message: string, config: object={}) => {
    return toast(message,{type:"warning",...config});
    
}
export const errorToast = (message: string, config: object={}) => {
    return toast(message,{type:"error",...config});
}

