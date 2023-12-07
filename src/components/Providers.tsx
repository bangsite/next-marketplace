'use client';

import React, {PropsWithChildren, useState} from 'react'
import {QueryClient} from "@tanstack/query-core";
import { trpc } from '@/trpc/client';


export const Providers = ({children}:PropsWithChildren) => {
    const [queryClient] = useState(()=>new QueryClient);
    const [trpcClient] = useState(()=>trpc.createClient({}));
    return (
        <trpc.Provider>

        </trpc.Provider>
    )
}
