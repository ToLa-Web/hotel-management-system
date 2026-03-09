"use client";

import { HotelContextProvider } from "@Context/owner/ChooseHotelContext";
import { OwnerContextProvider } from "@Context/owner/context";
import ProtectedRoute from "@components/shared/role-and-permissions-handle/ProtectedRoute";

export default function OwnerLayout({ children }) {
    return (
        <ProtectedRoute
            requiredPermissions={["reservation", "properties"]}
            requiredAccessLevel={80}
            fallbackPath="/"
        >
            <HotelContextProvider>
                <OwnerContextProvider>
                    {children}
                </OwnerContextProvider>
            </HotelContextProvider>
        </ProtectedRoute>
    );
}
