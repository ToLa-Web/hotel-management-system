"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useHotelContext } from "@Context/owner/ChooseHotelContext";
import {
  Building,
  ClipboardList,
  BarChart3,
  ArrowLeftRight,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    label: "Reservations",
    path: "/ChooseHotel/Reservation",
    icon: ClipboardList,
  },
  {
    label: "Reports",
    path: "/ChooseHotel/ReportData",
    icon: BarChart3,
  },
];

export default function OwnerSubNav() {
  const pathname = usePathname();
  const { hotelName } = useHotelContext();

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb + hotel name */}
        <div className="flex items-center gap-2 pt-3 pb-1 text-sm text-gray-500">
          <Link
            href="/OwnerDashboard"
            className="hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href="/ChooseHotel"
            className="hover:text-blue-600 transition-colors"
          >
            Hotels
          </Link>
          {hotelName && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                {hotelName}
              </span>
            </>
          )}
        </div>

        {/* Tab navigation */}
        <div className="flex items-center justify-between">
          <nav className="flex gap-1 -mb-px">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 pb-1">
            <Link
              href="/ChooseHotel"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Switch Hotel
            </Link>
            <Link
              href="/OwnerDashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
