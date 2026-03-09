"use client";
import React, { useState, useEffect } from "react";
import Header from "@components/user/layout/Header";
import OwnerSubNav from "@components/owner/component/layout/OwnerSubNav";
import { api } from "@/lib/authService";
import { useHotelContext } from "@Context/owner/ChooseHotelContext";
import { format } from "date-fns";

const Page = () => {
    const { hotelId } = useHotelContext();
    const [reservations, setReservations] = useState([]);
    const [totals, setTotals] = useState({
        totalRevenue: 0,
        totalBooked: 0,
        totalPending: 0,
        totalCheckedIn: 0,
    });
    const [report, setReport] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/owner/reservations", {
                params: { per_page: 200 },
            });
            const all = res.data?.data?.data || res.data?.data || [];

            // Filter for selected hotel
            const hotelReservations = hotelId
                ? all.filter((r) => String(r.hotel_id) === String(hotelId))
                : all;

            let totalRevenue = 0;
            let totalBooked = 0;
            let totalPending = 0;
            let totalCheckedIn = 0;
            const allRows = [];

            hotelReservations.forEach((reservation) => {
                // Count by status
                if (reservation.status === "confirmed" || reservation.status === "completed") {
                    totalBooked += 1;
                }
                if (reservation.status === "pending") {
                    totalPending += 1;
                }
                if (reservation.status === "checked_in") {
                    totalCheckedIn += 1;
                }

                // Sum paid amounts
                if (reservation.payment_status === "paid") {
                    totalRevenue += Number(reservation.total_amount) || 0;
                } else {
                    totalRevenue += Number(reservation.paid_amount) || 0;
                }

                allRows.push({
                    guest: reservation.user?.name || "N/A",
                    email: reservation.user?.email || "",
                    adults: reservation.adults || 0,
                    children: reservation.children || 0,
                    amount: reservation.total_amount,
                    room: reservation.room?.room_number || "N/A",
                    roomType: reservation.room?.room_type?.name || "",
                    status: reservation.status,
                    paymentStatus: reservation.payment_status,
                    checkIn: reservation.check_in_date,
                    checkOut: reservation.check_out_date,
                    nights: reservation.nights,
                });
            });

            setReservations(hotelReservations);
            setTotals({ totalRevenue, totalBooked, totalPending, totalCheckedIn });
            setReport(allRows);
        } catch (error) {
            console.error("Error fetching reservations:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [hotelId]);

    const filteredReport = report.filter((r) =>
        r.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            return format(new Date(dateStr), "MMM dd, yyyy");
        } catch {
            return dateStr;
        }
    };

    const statusBadge = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            confirmed: "bg-blue-100 text-blue-800",
            checked_in: "bg-green-100 text-green-800",
            completed: "bg-gray-100 text-gray-800",
            cancelled: "bg-red-100 text-red-800",
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || ""}`}>
                {status?.replace("_", " ") || "N/A"}
            </span>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="w-full flex flex-col justify-center items-center shadow-sm sticky top-0 z-20 bg-white">
                <div className="w-10/12"><Header /></div>
            </div>
            <div className="sticky top-[64px] z-10">
                <OwnerSubNav />
            </div>
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Booking Report</h1>

                    {/* Search */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by guest name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg w-full max-w-md"
                        />
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg border shadow-sm p-5">
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">${totals.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-white rounded-lg border shadow-sm p-5">
                            <p className="text-sm font-medium text-gray-500">Booked</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{totals.totalBooked}</p>
                        </div>
                        <div className="bg-white rounded-lg border shadow-sm p-5">
                            <p className="text-sm font-medium text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600 mt-1">{totals.totalPending}</p>
                        </div>
                        <div className="bg-white rounded-lg border shadow-sm p-5">
                            <p className="text-sm font-medium text-gray-500">Checked In</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{totals.totalCheckedIn}</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading report data...</div>
                    ) : filteredReport.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No reservations found.</div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Guest</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Guests</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Room</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dates</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nights</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredReport.map((reservation, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">{reservation.guest}</div>
                                                <div className="text-xs text-gray-500">{reservation.email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {reservation.adults} adult{reservation.adults !== 1 ? "s" : ""}
                                                {reservation.children > 0 ? `, ${reservation.children} child${reservation.children !== 1 ? "ren" : ""}` : ""}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-900">#{reservation.room}</div>
                                                <div className="text-xs text-gray-500">{reservation.roomType}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 text-center">{reservation.nights}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {reservation.amount != null ? `$${Number(reservation.amount).toLocaleString()}` : "N/A"}
                                            </td>
                                            <td className="px-4 py-3">{statusBadge(reservation.status)}</td>
                                            <td className="px-4 py-3">{statusBadge(reservation.paymentStatus)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Page;