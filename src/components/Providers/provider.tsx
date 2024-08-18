"use client"

import {
    QueryClient, QueryClientProvider
} from "@tanstack/react-query"
import { FC, ReactNode, useState } from "react"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


interface ProvidersProps {
    children: ReactNode
}

export const Providers: FC<ProvidersProps> = ({ children }) => {
    const [queryClient] = useState(() => new QueryClient())
    return (
        <QueryClientProvider client={queryClient}>
            {children}
             <ReactQueryDevtools/>
        </QueryClientProvider>
    )
}