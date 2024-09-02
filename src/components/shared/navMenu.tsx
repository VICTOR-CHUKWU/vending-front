"use client"
import React, { memo, useState } from 'react'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INavMenus } from '@/types';

const _MenuItems = ({ menu: nav }: { menu: INavMenus }) => {
    const pathname = usePathname();
    return (
        <span className={`relative nav-menu ${
            nav.url !== "/" &&
            pathname.includes(nav.url)
            ? "active"
            : ""
            }`}>
            
                <Link
                    href={nav.url}>
                    {nav.name}
                </Link>
        </span>
    )
}

export const MenuItems = memo(_MenuItems)