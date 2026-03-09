"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import HotelDetailsPage from "@components/Details/HotelDetailsPage";
import Loading from "@app/loading";

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hotel, setHotel] = useState(null);

  // Updated image handling to work with both array and JSON string formats
  const getHotelImages = (hotel) => {
    if (!hotel?.images) return [];

    if (Array.isArray(hotel.images)) {
      return hotel.images;
    }

    if (typeof hotel.images === "string") {
      try {
        return JSON.parse(hotel.images);
      } catch {
        return [];
      }
    }

    return [];
  };

  const images = getHotelImages(hotel);
  const detailImages = images.slice(1);

  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availability, setAvailability] = useState({});
  const [showingAvailability, setShowingAvailability] = useState(false);
  const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [checkIn, setCheckIn] = useState(searchParams.get("check_in") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("check_out") || "");
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const HEADER_HEIGHT = 62;

  const NAV_TABS = [
    { label: "Overview",                  id: "overview" },
    { label: "Info & prices",             id: "info-prices" },
    { label: "Facilities",                id: "facilities" },
    { label: "House rules",               id: "house-rules" },
    { label: "Important and legal info",  id: "legal-info" },
    { label: "Guest reviews (1,076)",     id: "reviews" },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 48;
      const offset = (headerVisible ? HEADER_HEIGHT : 0) + navHeight + 8;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setActiveTab(id);
  };

  // Track header visibility to coordinate sticky nav position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollYRef.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_TABS.map((t) => t.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveTab(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [loading]);

  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;

  useEffect(() => {
    if (params.id) {
      // If dates are provided in URL, automatically check availability
      if (checkIn && checkOut) {
        setShowingAvailability(true);
        setHasCheckedAvailability(true);
        fetchHotelDetailsWithAvailability();
      } else {
        fetchHotelDetails();
        fetchRoomTypes();
      }
    }
  }, [params.id]);

  const fetchHotelDetails = async () => {
    try {
      const response = await fetch(
        `${LARAVEL_API_URL}/api/hotels/${params.id}`
      );
      const data = await response.json();
      setHotel(data.data);
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    } finally {
      setLoading(false);
    }
  };

  // In your fetchRoomTypes function:
  const fetchRoomTypes = async () => {
    try {
      const response = await fetch(
        `${LARAVEL_API_URL}/api/room-types?hotel_id=${params.id}`
      );
      const data = await response.json();
      setRoomTypes(data.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  const fetchHotelDetailsWithAvailability = async () => {
    try {
      // Get hotel details
      const hotelResponse = await fetch(
        `${LARAVEL_API_URL}/api/hotels/${params.id}`
      );
      const hotelData = await hotelResponse.json();
      setHotel(hotelData.data);

      // Get room types
      const roomTypesResponse = await fetch(
        `${LARAVEL_API_URL}/api/room-types?hotel_id=${params.id}`
      );
      const roomTypesData = await roomTypesResponse.json();
      setRoomTypes(roomTypesData.data);

      // Check availability for each room type if dates are provided
      if (checkIn && checkOut) {
        const availabilityPromises = roomTypesData.data.map(
          async (roomType) => {
            const response = await fetch(
              `${LARAVEL_API_URL}/api/room-types/${roomType.uuid}/availability?check_in=${checkIn}&check_out=${checkOut}`,
              { headers: { Accept: 'application/json' } }
            );
            const data = await response.json();
            return { roomTypeId: roomType.uuid, ...data };
          }
        );

        const availabilityResults = await Promise.all(availabilityPromises);
        const availabilityMap = {};
        const availableRoomTypes = [];

        availabilityResults.forEach((result) => {
          availabilityMap[result.roomTypeId] = result;
          // Find the corresponding room type and add availability info
          const roomType = roomTypesData.data.find(
            (rt) => rt.uuid === result.roomTypeId
          );
          if (
            roomType &&
            (result.available_count > 0 ||
              (result.available_rooms && result.available_rooms.length > 0))
          ) {
            availableRoomTypes.push({
              ...roomType,
              available_count:
                result.available_count || result.available_rooms?.length || 0,
              available_rooms: result.available_rooms || [],
            });
          }
        });

        setAvailability(availabilityMap);
        setAvailableRooms(availableRoomTypes);
      }
    } catch (error) {
      console.error("Error fetching hotel details with availability:", error);
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
          `${LARAVEL_API_URL}/api/room-types/${roomType.uuid}/availability?check_in=${checkIn}&check_out=${checkOut}`,
          { headers: { Accept: 'application/json' } }
        );
        const data = await response.json();

        const availableCount = data.available_count || data.available_rooms?.length || 0;
        if (availableCount > 0) {
          return {
            ...roomType,
            available_count: availableCount,
            available_rooms: data.available_rooms || [],
          };
        }

        return null;
      });

      const results = await Promise.all(availabilityPromises);
      const availableRoomTypes = results.filter((room) => room !== null);

      // Set available rooms and show filtered results
      setAvailableRooms(availableRoomTypes);
      setShowingAvailability(true);
      setHasCheckedAvailability(true); // Mark that availability has been checked
      setShowWarning(false); // Hide warning once availability is checked
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

  const handleViewDetails = (roomTypeId) => {
    if (!hasCheckedAvailability) {
      setShowWarning(true);
      // Scroll to availability section to show the warning
      window.scrollTo({
        top: document.querySelector(".availability-section")?.offsetTop || 0,
        behavior: "smooth",
      });
      return;
    }

    if (!checkIn || !checkOut) {
      alert(
        "Please select check-in and check-out dates before viewing room details"
      );
      return;
    }

    router.push(
      `/hotels/${params.id}/rooms/${roomTypeId}?check_in=${checkIn}&check_out=${checkOut}`
    );
  };

  const resetAvailability = () => {
    setShowingAvailability(false);
    setAvailableRooms([]);
    setHasCheckedAvailability(false);
    setShowWarning(false);
    setCheckIn("");
    setCheckOut("");
  };

  // Function to handle "View All Rooms" button click
  const handleViewAllRooms = () => {
    const queryParams =
      checkIn && checkOut ? `?check_in=${checkIn}&check_out=${checkOut}` : "";
    router.push(`/hotels/${params.id}/rooms${queryParams}`);
  };

  // Function to handle "View Details" click when availability hasn't been checked
  const handleViewDetailsClick = (e, roomTypeId) => {
    if (!hasCheckedAvailability) {
      e.preventDefault();
      setShowWarning(true);
      // Scroll to availability section to show the warning
      window.scrollTo({
        top: document.querySelector(".availability-section")?.offsetTop || 0,
        behavior: "smooth",
      });
      return;
    }
  };

  // Determine which rooms to display - ensure we always have an array
  const roomsToDisplay = showingAvailability
    ? Array.isArray(availableRooms)
      ? availableRooms
      : []
    : Array.isArray(roomTypes)
    ? roomTypes
    : [];

  if (loading) return <Loading message="Loading hotel details..." />;
  if (!hotel) return <div>Hotel not found</div>;

  return (
    <div className="min-h-screen mt-10 bg-[#f8f7f5]">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Hotel Header ── */}
        <div id="overview" className="mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#857749] mb-2 block">
                Premium Property
              </span>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-2">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <svg className="w-4 h-4 text-[#857749] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{hotel.address}, {hotel.city}</span>
              </div>
            </div>
            {/* Star rating */}
            <div className="flex items-center gap-1 mt-1">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className="w-5 h-5 text-[#c4a96a]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-gray-500 mt-3 max-w-3xl text-sm leading-relaxed">
            {hotel.description}
          </p>
          {/* Divider */}
          <div className="mt-5 h-px bg-gradient-to-r from-[#c4a96a]/40 via-[#857749]/20 to-transparent" />
        </div>

        {/* ── Image Grid + Sidebar ── */}
        <div className="flex gap-5 mb-8">
          {/* Image grid (unchanged) */}
          <div className="w-9/12">
            <div
              className="grid gap-3 py-2"
              style={{
                gridTemplateColumns: "repeat(5, 168px)",
                gridTemplateRows: "236px 236px 112px",
              }}
            >
              {detailImages[0] && (
                <div className="col-span-3 row-span-2">
                  <img src={detailImages[0]} alt="detail-0"
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                    style={{ width: "528px", height: "484px" }} />
                </div>
              )}
              {detailImages[1] && (
                <div className="col-span-2 col-start-4">
                  <img src={detailImages[1]} alt="detail-1"
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                    style={{ width: "348px", height: "236px" }} />
                </div>
              )}
              {detailImages[2] && (
                <div className="col-span-2 col-start-4 row-start-2">
                  <img src={detailImages[2]} alt="detail-2"
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                    style={{ width: "348px", height: "236px" }} />
                </div>
              )}
              {detailImages.slice(3, 8).map((url, index) => (
                <div key={index + 3} className="row-start-3">
                  <img src={url} alt={`detail-${index + 3}`}
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                    style={{ width: "168px", height: "112px" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-3/12 flex flex-col gap-4">
            {/* Guest review card */}
            <div className="flex flex-col gap-4 border border-[#e8dcc8] rounded-2xl p-5 shadow-sm bg-white">
              <div className="flex items-center gap-2 border-b border-[#f0e8d8] pb-3">
                <div className="w-1 h-5 rounded-full bg-[#857749]" />
                <h3 className="text-sm font-semibold text-gray-800">Guest Highlights</h3>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Guests loved</p>
                <div className="bg-[#f9f6f0] rounded-xl p-3 border border-[#ede5d5]">
                  <p className="text-gray-600 italic text-xs leading-relaxed">
                    "The receptionists were friendly and helpful at all times. The hotel manager is lucky to have them in the hotel's service..."
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#857749] uppercase tracking-wider">Excellent Location</span>
                <span className="text-xs bg-[#f0ead8] text-[#857749] font-bold px-2 py-0.5 rounded-lg">9.2 / 10</span>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden border border-[#e8dcc8] shadow-sm flex-1 min-h-[180px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62565.16404994723!2d104.90470142800619!3d11.456613727772911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109599384325cdd%3A0xe25c308bc6822c0a!2sKrong%20Ta%20Khmau!5e0!3m2!1sen!2skh!4v1738388659069!5m2!1sen!2skh"
                className="w-full h-full min-h-[180px]"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* ── Sticky Section Nav ── */}
        <div
          className="sticky z-40 bg-white border-b border-[#e0d6c2] -mx-6 px-6 mb-8 transition-[top] duration-500 ease-out"
          style={{ top: headerVisible ? `${HEADER_HEIGHT}px` : "0px" }}
        >
          <nav className="max-w-7xl flex items-stretch overflow-x-auto scrollbar-hide gap-1">
            {NAV_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={`relative shrink-0 px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap outline-none cursor-pointer
                  ${activeTab === tab.id
                    ? "text-[#6b5e3a]"
                    : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {tab.label}
                {/* Active bottom bar */}
                <span
                  className={`absolute bottom-0 left-2 right-2 h-[2.5px] rounded-t-full transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-[#857749]"
                      : "bg-transparent hover:bg-gray-200"
                  }`}
                />
              </button>
            ))}
          </nav>
        </div>

        {/* ── Check Availability ── */}
        <div id="info-prices" className="bg-white border border-[#e8dcc8] rounded-2xl p-6 mb-8 shadow-sm availability-section">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-[#857749]" />
              <h2 className="text-xl font-bold text-gray-900">Check Availability</h2>
            </div>
            {showingAvailability && (
              <button onClick={resetAvailability}
                className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                Clear Search
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="border border-[#ddd5c0] rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-[#fafaf8] focus:outline-none focus:ring-2 focus:ring-[#857749]/30 focus:border-[#857749] transition"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn}
                className="border border-[#ddd5c0] rounded-xl px-4 py-2.5 text-sm text-gray-700 bg-[#fafaf8] focus:outline-none focus:ring-2 focus:ring-[#857749]/30 focus:border-[#857749] transition"
              />
            </div>
            <button
              onClick={checkAvailability}
              disabled={checkingAvailability}
              className="px-7 py-2.5 bg-[#857749] hover:bg-[#6b5e35] active:scale-95 text-white font-semibold rounded-xl transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              {checkingAvailability ? "Checking..." : "Search Rooms"}
            </button>
          </div>

          {/* Warning */}
          {!hasCheckedAvailability && showWarning && (
            <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-amber-500 text-base mt-0.5">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-amber-800">Select dates first</p>
                <p className="text-xs text-amber-700 mt-0.5">Choose your check-in and check-out dates, then search to see available rooms.</p>
              </div>
            </div>
          )}

          {/* Status */}
          {showingAvailability && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-[#f5edd8] border border-[#ddd0b0] rounded-xl">
              <div className="w-2 h-2 rounded-full bg-[#857749] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#5a4a28]">
                  {roomsToDisplay.length} room type{roomsToDisplay.length !== 1 ? "s" : ""} available · {checkIn} → {checkOut}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Room Types ── */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 rounded-full bg-[#857749]" />
              <h2 className="text-xl font-bold text-gray-900">
                {showingAvailability ? "Available Rooms" : "Room Types"}
              </h2>
            </div>
            <button
              onClick={handleViewAllRooms}
              className="group flex items-center gap-2 px-5 py-2 border border-[#857749] text-[#857749] font-semibold rounded-xl hover:bg-[#857749] hover:text-white transition-all duration-200 text-sm"
            >
              View All Rooms
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {roomsToDisplay.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#e8dcc8]">
              <div className="w-14 h-14 rounded-full bg-[#f5edd8] flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#857749]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold">
                {showingAvailability ? "No rooms available for those dates" : "No room types found"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {showingAvailability ? "Try different check-in / check-out dates." : "Please check back later."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {roomsToDisplay.map((roomType) => {
                const roomImages = roomType.images || [];
                const mainImage = roomImages[0] || "/default-room.jpg";
                const roomAvailability = availability[roomType.id];
                const availableCount = roomAvailability?.available_count || roomType.available_count || 0;
                const hasAvailability = showingAvailability ? availableCount > 0 : true;
                const amenities = Array.isArray(roomType.amenities) ? roomType.amenities : [];

                return (
                  <div key={roomType.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#e8dcc8] shadow-sm hover:shadow-md hover:border-[#c4a96a] transition-all duration-300">

                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={mainImage}
                        alt={`${roomType.name} room`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                      {/* Availability badge */}
                      {showingAvailability && availableCount > 0 && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-[#857749] text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                            {availableCount} left
                          </span>
                        </div>
                      )}

                      {/* Price overlay */}
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow">
                          <span className="text-base font-bold text-gray-900">${roomType.base_price}</span>
                          <span className="text-gray-500 text-xs ml-1">/ night</span>
                        </div>
                      </div>

                      {/* Size */}
                      {roomType.size && (
                        <div className="absolute bottom-3 right-3">
                          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs">
                            {roomType.size} m²
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#857749] transition-colors">
                          {roomType.name}
                        </h3>
                        {roomType.capacity && (
                          <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                            Up to {roomType.capacity} guests
                          </span>
                        )}
                      </div>

                      {roomType.description && (
                        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                          {roomType.description}
                        </p>
                      )}

                      {/* Amenities */}
                      {amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {amenities.slice(0, 4).map((a, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#f5edd8] text-[#6b5e35] text-xs rounded-lg font-medium">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Divider */}
                      <div className="h-px bg-[#f0e8d8]" />

                      {/* Action */}
                      {hasCheckedAvailability && hasAvailability ? (
                        <button
                          onClick={() => handleViewDetails(roomType.uuid)}
                          className="w-full bg-[#857749] hover:bg-[#6b5e35] active:scale-95 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 text-sm shadow-sm"
                        >
                          Book Now
                        </button>
                      ) : hasCheckedAvailability && !hasAvailability ? (
                        <button disabled
                          className="w-full bg-gray-100 text-gray-400 font-medium py-2 px-4 rounded-xl cursor-not-allowed text-sm">
                          Fully Booked
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleViewDetailsClick(e, roomType.uuid)}
                          className="w-full border border-[#857749] text-[#857749] hover:bg-[#857749] hover:text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 text-sm"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <HotelDetailsPage />
      </div>
    </div>
  );
}
