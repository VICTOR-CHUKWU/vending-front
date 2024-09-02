"use client";
import { ToastContainer } from 'react-toastify';
import Nav from '@/components/Nav';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const hideNav =
     pathname.includes("/signup") || pathname.includes("/login");
    return (
        <>
           {!hideNav &&  <Nav />}
            {children}
            <ToastContainer />
        </>
    );
};