'use client';
import {useEffect, useRef, useState} from "react";
import { useOnClickOutside } from 'usehooks-ts';

import {PRODUCT_CATEGORIES} from "@/config";
import {NavItem} from "@/components/NavItem";


export const NavItems = () => {
    const [activeIndex, setActiveIndex] = useState<null | number>(null);
    const navRef = useRef(null);
    const isAnyOpen = activeIndex !== null;

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveIndex(null)
        }

        document.addEventListener('keydown', handler);

        return () => document.removeEventListener('keydown', handler);
    }, [])

    useOnClickOutside(navRef, () => setActiveIndex(null))

    return (
        <div className="flex gap-4 h-full" ref={navRef}>
            {
                PRODUCT_CATEGORIES.map((category, index) => {
                    const handleOpen = () => {
                        if (activeIndex === index) setActiveIndex(null);

                        else setActiveIndex(index);
                    }

                    const close = () => setActiveIndex(null);

                    const isOpen = index === activeIndex;

                    return (
                        <NavItem category={category}
                                 key={category.value}
                                 close={close}
                                 handleOpen={handleOpen}
                                 isOpen={isOpen}
                                 isAnyOpen={isAnyOpen}/>
                    )
                })
            }
        </div>
    )
}
