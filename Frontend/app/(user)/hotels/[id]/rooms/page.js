'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Users, DollarSign, Search, RotateCcw, ChevronRight, BedDouble, Star, Shield, AlertTriangle } from 'lucide-react';

export default function RoomTypesPage() {
  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  const params = useParams();
  const searchParams = useSearchParams();
  
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [showingAvailability, setShowingAvailability] = useState(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  const [checkIn, setCheckIn] = useState(searchParams.get('check_in') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('check_out') || '');

  useEffect(() => {
    if (params.id) {
      if (checkIn && checkOut) {
        setShowingAvailability(true);
        setHasCheckedAvailability(true);
        fetchRoomTypesWithAvailability();
      } else {
        fetchRoomTypes();
      }
    }
  }, [params.id]);

  const fetchRoomTypes = async () => {
    try {
      const roomTypesResponse = await fetch(`${LARAVEL_API_URL}/api/room-types?hotel_id=${params.id}`);
      const roomTypesData = await roomTypesResponse.json();
      setRoomTypes(roomTypesData.data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypesWithAvailability = async () => {
    try {
      const roomTypesResponse = await fetch(`${LARAVEL_API_URL}/api/room-types?hotel_id=${params.id}`);
      const roomTypesData = await roomTypesResponse.json();
      setRoomTypes(roomTypesData.data);

      if (checkIn && checkOut) {
        const availabilityPromises = roomTypesData.data.map(async (roomType) => {
          const response = await fetch(
            `${LARAVEL_API_URL}/api/room-types/${roomType.uuid}/availability?check_in=${checkIn}&check_out=${checkOut}`
          );
          const data = await response.json();
          return { roomTypeId: roomType.uuid, ...data };
        });

        const availabilityResults = await Promise.all(availabilityPromises);
        const availabilityMap = {};
        const availableRoomTypes = [];

        availabilityResults.forEach(result => {
          availabilityMap[result.roomTypeId] = result;
          const roomType = roomTypesData.data.find(rt => rt.uuid === result.roomTypeId);
          if (roomType && (result.available_count > 0 || (result.available_rooms && result.available_rooms.length > 0))) {
            availableRoomTypes.push({
              ...roomType,
              available_count: result.available_count || result.available_rooms?.length || 0,
              available_rooms: result.available_rooms || []
            });
          }
        });

        setAvailability(availabilityMap);
        setAvailableRooms(availableRoomTypes);
      }
    } catch (error) {
      console.error('Error fetching room types:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    setCheckingAvailability(true);
    try {
      const availabilityPromises = roomTypes.map(async (roomType) => {
        const response = await fetch(
          `${LARAVEL_API_URL}/api/room-types/${roomType.uuid}/availability?check_in=${checkIn}&check_out=${checkOut}`
        );
        const data = await response.json();
        
        if (data.room_type) {
          return {
            ...roomType,
            available_count: data.available_count || data.available_rooms?.length || 1,
            available_rooms: data.available_rooms || [{ id: 1, room_number: "Available" }]
          };
        }
        if (data.available_count && data.available_count > 0) {
          return { ...roomType, available_count: data.available_count, available_rooms: data.available_rooms || [] };
        }
        if (data.available_rooms && Array.isArray(data.available_rooms) && data.available_rooms.length > 0) {
          return { ...roomType, available_count: data.available_rooms.length, available_rooms: data.available_rooms };
        }
        return null;
      });

      const results = await Promise.all(availabilityPromises);
      const availableRoomTypes = results.filter(room => room !== null);
      
      setAvailableRooms(availableRoomTypes);
      setShowingAvailability(true);
      setHasCheckedAvailability(true);
      setShowWarning(false);
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("Error checking availability. Please try again.");
      setAvailableRooms([]);
      setShowingAvailability(false);
      setHasCheckedAvailability(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const resetAvailability = () => {
    setShowingAvailability(false);
    setAvailableRooms([]);
    setHasCheckedAvailability(false);
    setShowWarning(false);
    setCheckIn('');
    setCheckOut('');
  };

  const handleSelectRoomClick = (e) => {
    e.preventDefault();
    setShowWarning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const parseImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    try { return JSON.parse(images) ?? []; } catch { return []; }
  };

  const roomsToDisplay = showingAvailability 
    ? (Array.isArray(availableRooms) ? availableRooms : [])
    : (Array.isArray(roomTypes) ? roomTypes : []);

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24">
        <div className="max-w-6xl mx-auto px-4">
          {/* Skeleton for search bar */}
          <div className="h-24 bg-white rounded-2xl shadow-sm animate-pulse mb-10" />
          {/* Skeleton cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            {showingAvailability ? 'Available Rooms' : 'Choose Your Room'}
          </h1>
          <p className="mt-2 text-gray-500 text-lg">
            {showingAvailability 
              ? `${roomsToDisplay.length} room type${roomsToDisplay.length !== 1 ? 's' : ''} available for your dates`
              : 'Select dates to check availability and book your stay'
            }
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
            <div className="flex-1 min-w-0">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-1.5 text-blue-600" />
                Check-in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-1.5 text-blue-600" />
                Check-out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 hover:bg-white"
              />
            </div>
            <div className="flex gap-2 sm:flex-shrink-0">
              <button
                onClick={checkAvailability}
                disabled={checkingAvailability}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-sm shadow-blue-200"
              >
                {checkingAvailability ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
              {showingAvailability && (
                <button
                  onClick={resetAvailability}
                  className="inline-flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Warning */}
          {!hasCheckedAvailability && showWarning && (
            <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Please check availability first</p>
                <p className="text-amber-600 text-sm mt-0.5">Select your dates and search to see which rooms are available.</p>
              </div>
            </div>
          )}

          {/* Availability summary */}
          {showingAvailability && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-blue-800 text-sm">
                  Showing availability for {new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {getNights() > 0 && <span className="font-normal text-blue-600"> · {getNights()} night{getNights() !== 1 ? 's' : ''}</span>}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {roomsToDisplay.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <BedDouble className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {showingAvailability ? 'No rooms available' : 'No room types found'}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {showingAvailability 
                ? 'No rooms are available for your selected dates. Try adjusting your dates.'
                : 'This hotel has no room types listed yet.'
              }
            </p>
            {showingAvailability && (
              <button onClick={resetAvailability} className="mt-6 inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
                <RotateCcw className="w-4 h-4" /> Try different dates
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomsToDisplay.map(roomType => {
              const roomAvailability = availability[roomType.uuid];
              const availableCount = roomAvailability?.available_count || roomType.available_count || 0;
              const hasAvailability = showingAvailability ? availableCount > 0 : true;
              const images = parseImages(roomType.images);
              const nights = getNights();

              return (
                <div 
                  key={roomType.uuid} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {images[0] ? (
                      <img 
                        src={images[0]} 
                        alt={roomType.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BedDouble className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
                      <span className="text-lg font-bold text-gray-900">${roomType.base_price}</span>
                      <span className="text-gray-500 text-sm">/night</span>
                    </div>

                    {/* Availability Badge */}
                    {showingAvailability && hasAvailability && (
                      <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        {availableCount} available
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                      {roomType.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {roomType.description}
                    </p>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{roomType.capacity} guest{roomType.capacity !== 1 ? 's' : ''}</span>
                      </div>
                      {roomType.size && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-300">·</span>
                          <span>{roomType.size} sqm</span>
                        </div>
                      )}
                    </div>

                    {/* Total for dates */}
                    {showingAvailability && nights > 0 && (
                      <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-xl mb-4 text-sm">
                        <span className="text-blue-700">{nights} night{nights !== 1 ? 's' : ''} total</span>
                        <span className="font-bold text-blue-800">${(roomType.base_price * nights).toFixed(2)}</span>
                      </div>
                    )}

                    {/* CTA Button */}
                    {hasCheckedAvailability && hasAvailability ? (
                      <Link 
                        href={`/hotels/${params.id}/rooms/${roomType.uuid}${checkIn && checkOut ? `?check_in=${checkIn}&check_out=${checkOut}` : ''}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all font-semibold text-sm shadow-sm shadow-blue-200"
                      >
                        Select Room
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ) : hasCheckedAvailability && !hasAvailability ? (
                      <button 
                        disabled 
                        className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-semibold text-sm cursor-not-allowed"
                      >
                        Not Available
                      </button>
                    ) : (
                      <button 
                        onClick={handleSelectRoomClick}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all font-semibold text-sm"
                      >
                        Select Room
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}