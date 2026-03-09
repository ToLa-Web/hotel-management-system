"use client";

import { createContext, useContext, useState } from "react";

const HotelContext = createContext(null);

export function HotelContextProvider({ children }) {
    const [hotelId, setHotelId] = useState(null);
    const [hotelName, setHotelName] = useState("");

    return (
        <HotelContext.Provider value={{ hotelId, setHotelId, hotelName, setHotelName }}>
            {children}
        </HotelContext.Provider>
    );
}

export function useHotelContext() {
    const ctx = useContext(HotelContext);
    if (!ctx) throw new Error("useHotelContext must be used inside HotelContextProvider");
    return ctx;
}
