"use client";

import { createContext, useContext, useState } from "react";

const OwnerContext = createContext(null);

export function OwnerContextProvider({ children }) {
    const [selectedContent, setSelectedContent] = useState(null);

    return (
        <OwnerContext.Provider value={{ selectedContent, setSelectedContent }}>
            {children}
        </OwnerContext.Provider>
    );
}

export function useContent() {
    const ctx = useContext(OwnerContext);
    if (!ctx) throw new Error("useContent must be used inside OwnerContextProvider");
    return ctx;
}
