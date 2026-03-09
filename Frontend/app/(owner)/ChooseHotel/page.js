
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/authService";
import { useHotelContext } from "@Context/owner/ChooseHotelContext";
import Header from "@components/user/layout/Header";
import { Building } from "lucide-react";
import { FaTv, FaWifi } from "@node_modules/react-icons/fa";
import { PiShower } from "@node_modules/react-icons/pi";

const Page = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setHotelId, setHotelName } = useHotelContext();

  const fetchData = async () => {
    try {
      const res = await api.get('/owner/hotels');
      const data = res.data?.data?.data || res.data?.data || [];
      setHotels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching owner hotels:", error.message);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = (hotel) => {
    setHotelId(hotel.id);
    setHotelName(hotel.name || "Hotel");
    router.push("/ChooseHotel/Reservation");
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your hotels...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className='w-full flex flex-col justify-center items-center shadow-sm sticky top-0 z-10 bg-white'>
        <div className='w-10/12'>
          <Header />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Select a Hotel</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a hotel to manage its reservations and reports</p>
        </div>

        {hotels.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border">
            <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-700">No hotels found</p>
            <p className="text-sm text-gray-500 mt-1">You haven&apos;t added any hotels yet.</p>
            <button
              onClick={() => router.push("/OwnerDashboard")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => handleNextPage(hotel)}
                className="bg-white rounded-lg border shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.images?.[0] || hotel.image || "/default-hotel.jpg"}
                    alt={hotel.name || "Hotel Image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {hotel.status && (
                    <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium ${
                      hotel.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {hotel.status}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-gray-900 text-lg">{hotel.name || "Unnamed Hotel"}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {hotel.city ? `${hotel.city}, ${hotel.country}` : "Unknown Location"}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex gap-3 text-gray-400">
                      <div className="flex items-center gap-1 text-xs">
                        <FaTv size={14} />
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <PiShower size={14} />
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <FaWifi size={14} />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {hotel.total_rooms || hotel.rooms?.length || 0} rooms
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;