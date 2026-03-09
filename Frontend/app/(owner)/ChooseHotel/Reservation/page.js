"use client";

import { useEffect, useState } from "react";
import { useHotelContext } from "@Context/owner/ChooseHotelContext";
import { api } from "@/lib/authService";
import Header from "@components/user/layout/Header";
import OwnerSubNav from "@components/owner/component/layout/OwnerSubNav";
import { format } from "date-fns";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  checked_in: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const PAYMENT_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  partial: "bg-orange-100 text-orange-800",
  paid: "bg-green-100 text-green-800",
};

export default function ReservationManagement() {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [selectedReservation, setSelectedReservation] = useState(null);
  const { hotelId } = useHotelContext();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleReservations, setVisibleReservations] = useState(15);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/owner/reservations", {
        params: { per_page: 200 },
      });
      const all = res.data?.data?.data || res.data?.data || [];
      const forHotel = hotelId
        ? all.filter((r) => String(r.hotel_id) === String(hotelId))
        : all;
      setReservations(forHotel);
      setFilteredReservations(forHotel);
    } catch (error) {
      console.error("Error fetching reservations:", error.message);
      setReservations([]);
      setFilteredReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [hotelId]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredReservations(reservations);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = reservations.filter(
      (r) =>
        (r.user?.name || "").toLowerCase().includes(term) ||
        (r.user?.email || "").toLowerCase().includes(term) ||
        (r.reservation_code || "").toLowerCase().includes(term)
    );
    setFilteredReservations(filtered);
    setVisibleReservations(15);
  }, [searchTerm, reservations]);

  const handleStatusAction = async (reservation, action) => {
    const actionMap = {
      confirm: { endpoint: `/reservations/${reservation.uuid}/confirm`, label: "Confirmed" },
      "check-in": { endpoint: `/reservations/${reservation.uuid}/check-in`, label: "Checked In" },
      "check-out": { endpoint: `/reservations/${reservation.uuid}/check-out`, label: "Checked Out" },
    };
    const config = actionMap[action];
    if (!config) return;

    try {
      setActionLoading(reservation.id);
      await api.patch(config.endpoint);
      showMessage(`Reservation ${config.label} successfully`);
      fetchData();
    } catch (error) {
      showMessage(error.response?.data?.message || `Failed to ${action}`, "error");
    } finally {
      setActionLoading(null);
      setDropdownOpen({});
    }
  };

  const handleCancel = async (reservation) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      setActionLoading(reservation.id);
      await api.delete(`/reservations/${reservation.uuid}`);
      showMessage("Reservation cancelled successfully");
      fetchData();
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to cancel reservation", "error");
    } finally {
      setActionLoading(null);
      setDropdownOpen({});
    }
  };

  const getAvailableActions = (reservation) => {
    const actions = [];
    switch (reservation.status) {
      case "pending":
        actions.push({ label: "Confirm", action: "confirm", color: "text-blue-600" });
        actions.push({ label: "Cancel", action: "cancel", color: "text-red-600" });
        break;
      case "confirmed":
        actions.push({ label: "Check In", action: "check-in", color: "text-green-600" });
        actions.push({ label: "Cancel", action: "cancel", color: "text-red-600" });
        break;
      case "checked_in":
        actions.push({ label: "Check Out", action: "check-out", color: "text-orange-600" });
        break;
    }
    actions.push({ label: "View Details", action: "view", color: "text-gray-700" });
    return actions;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  const ReservationDetailsModal = ({ reservation, onClose }) => {
    if (!reservation) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Reservation Details</h2>
          <div className="space-y-3 text-sm">
            <p><span className="font-semibold">Code:</span> {reservation.reservation_code}</p>
            <p><span className="font-semibold">Guest:</span> {reservation.user?.name || "N/A"}</p>
            <p><span className="font-semibold">Email:</span> {reservation.user?.email || "N/A"}</p>
            <p><span className="font-semibold">Hotel:</span> {reservation.hotel?.name || "N/A"}</p>
            <p><span className="font-semibold">Room:</span> {reservation.room?.room_number || "N/A"} ({reservation.room?.room_type?.name || "N/A"})</p>
            <p><span className="font-semibold">Check-in:</span> {formatDate(reservation.check_in_date)}</p>
            <p><span className="font-semibold">Check-out:</span> {formatDate(reservation.check_out_date)}</p>
            <p><span className="font-semibold">Nights:</span> {reservation.nights}</p>
            <p><span className="font-semibold">Guests:</span> {reservation.adults} adults{reservation.children > 0 ? `, ${reservation.children} children` : ""}</p>
            <p><span className="font-semibold">Room Rate:</span> ${reservation.room_rate}/night</p>
            <p><span className="font-semibold">Total:</span> ${reservation.total_amount}</p>
            <p><span className="font-semibold">Paid:</span> ${reservation.paid_amount || 0}</p>
            <p><span className="font-semibold">Pending:</span> ${reservation.pending_amount || 0}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[reservation.status] || ""}`}>
                {reservation.status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Payment:</span>{" "}
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${PAYMENT_COLORS[reservation.payment_status] || ""}`}>
                {reservation.payment_status}
              </span>
            </p>
            {reservation.special_requests && (
              <p><span className="font-semibold">Special Requests:</span> {reservation.special_requests}</p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="w-full flex flex-col justify-center items-center shadow-sm sticky top-0 z-10 bg-white">
          <div className="w-10/12"><Header /></div>
        </div>
        <OwnerSubNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading reservations...</div>
        </main>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Reservation Management</h1>

          {message && (
            <div className={`mb-4 p-3 rounded-md text-sm ${message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {message.text}
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by guest name, email, or reservation code"
              className="p-2 border border-gray-300 rounded-md w-full max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredReservations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No reservations found</p>
              <p className="text-sm mt-1">Reservations will appear here when guests book rooms.</p>
            </div>
          ) : (
            <>
              {/* Reservation Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Guest</th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Room</th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Dates</th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                      <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.slice(0, visibleReservations).map((reservation, index) => (
                      <tr key={reservation.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="p-3 text-sm font-mono text-gray-600">{reservation.reservation_code}</td>
                        <td className="p-3">
                          <div className="text-sm font-semibold text-gray-900">{reservation.user?.name || "N/A"}</div>
                          <div className="text-xs text-gray-500">{reservation.user?.email || ""}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-sm text-gray-900">#{reservation.room?.room_number || "N/A"}</div>
                          <div className="text-xs text-gray-500">{reservation.room?.room_type?.name || ""}</div>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {formatDate(reservation.check_in_date)} - {formatDate(reservation.check_out_date)}
                          <div className="text-xs text-gray-400">{reservation.nights} night{reservation.nights !== 1 ? "s" : ""}</div>
                        </td>
                        <td className="p-3 text-sm font-medium text-gray-900">${reservation.total_amount}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[reservation.status] || ""}`}>
                            {reservation.status?.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${PAYMENT_COLORS[reservation.payment_status] || ""}`}>
                            {reservation.payment_status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="relative">
                            <button
                              className="p-2 rounded-full hover:bg-gray-200 focus:outline-none disabled:opacity-50"
                              disabled={actionLoading === reservation.id}
                              onClick={() => {
                                setDropdownOpen((prev) => ({
                                  ...prev,
                                  [reservation.id]: !prev[reservation.id],
                                }));
                              }}
                            >
                              {actionLoading === reservation.id ? (
                                <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              )}
                            </button>
                            {dropdownOpen[reservation.id] && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border">
                                <ul>
                                  {getAvailableActions(reservation).map((item) => (
                                    <li key={item.action}>
                                      <button
                                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${item.color}`}
                                        onClick={() => {
                                          if (item.action === "view") {
                                            setSelectedReservation(reservation);
                                            setDropdownOpen({});
                                          } else if (item.action === "cancel") {
                                            handleCancel(reservation);
                                          } else {
                                            handleStatusAction(reservation, item.action);
                                          }
                                        }}
                                      >
                                        {item.label}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* See More */}
              {visibleReservations < filteredReservations.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setVisibleReservations((prev) => prev + 15)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                  >
                    See More ({filteredReservations.length - visibleReservations} remaining)
                  </button>
                </div>
              )}
            </>
          )}

          {/* Reservation Details Modal */}
          {selectedReservation && (
            <ReservationDetailsModal
              reservation={selectedReservation}
              onClose={() => setSelectedReservation(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}