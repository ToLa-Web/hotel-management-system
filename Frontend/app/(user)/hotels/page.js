"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LARAVEL_ENDPOINT } from "@utils/apiEndpoints";
import PageTransition from "@components/motion/PageTransition";
import {
  FaCar,
  FaConciergeBell,
  FaDog,
  FaDumbbell,
  FaMapMarkerAlt,
  FaSkiing,
  FaStar,
  FaSuitcase,
  FaSwimmingPool,
  FaTv,
  FaUmbrellaBeach,
  FaWifi,
} from "@node_modules/react-icons/fa";
import { PiShower } from "@node_modules/react-icons/pi";
import {
  MdAcUnit,
  MdBalcony,
  MdLocalBar,
  MdLocalFireDepartment,
  MdPets,
  MdRestaurant,
  MdRoomService,
  MdSpa,
} from "@node_modules/react-icons/md";
import {
  GiBinoculars,
  GiCanoe,
  GiCompass,
  GiDesert,
  GiGardeningShears,
  GiHotSpices,
  GiSnowflake1,
  GiSofa,
  GiVendingMachine,
  GiWaterSplash,
} from "@node_modules/react-icons/gi";
import BannerHotel from "@components/user/Banners/BannerHotel";
import Loading from "@app/loading";
const HotelCard = ({ Rooms, onExplore }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${LARAVEL_ENDPOINT.HOTELS}?per_page=100`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const json = await res.json();
      const hotelsArray = json?.data?.data ?? [];

      const hotelsWithValidImages = hotelsArray.map((hotel) => {
        let images = [];

        if (Array.isArray(hotel.images)) {
          images = hotel.images;
        } else if (typeof hotel.images === "string") {
          try {
            images = JSON.parse(hotel.images);
          } catch {
            images = [];
          }
        }

        return { ...hotel, images };
      });

      setHotels(hotelsWithValidImages);
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Unable to connect to the server. Please check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Amenity icon mapping
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "wifi": FaWifi,
      "tv": FaTv,
      "shower": PiShower,
      "parking": FaCar,
      "gym": FaDumbbell,
      "pool": FaSwimmingPool,
      "restaurant": MdRestaurant,
      "spa": MdSpa,
      "ac": MdAcUnit,
      "pets": MdPets,
      "pet friendly": MdPets,
      "bar": MdLocalBar,
      "beach": FaUmbrellaBeach,
      "concierge": FaConciergeBell,
      "fireplace": MdLocalFireDepartment,
      "garden": GiGardeningShears,
      "onsen": GiHotSpices,
      "ski": FaSkiing,
      "terrace": MdBalcony,
      "sauna": MdSpa,
      "lounge": GiSofa,
      "luggage-storage": FaSuitcase,
      "vending": GiVendingMachine,
      "room service": MdRoomService,
      "watersports": GiWaterSplash,
      "kayaking": GiCanoe,
      "guided-tours": GiCompass,
      "desert-tours": GiDesert,
      "aurora-tours": GiSnowflake1,
      "wildlife-watching": GiBinoculars,
      "dog-sledding": FaDog,
    };

    const IconComponent = iconMap[amenity.toLowerCase()] || FaWifi;
    return <IconComponent size={16} />;
  };

  // Generate star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-yellow-400 opacity-50" />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const handleExplore = (hotel) => {
    if (onExplore) {
      onExplore(hotel);
    } else {
      // Default behavior - could navigate to hotel details page
      window.location.href = `/hotels/${hotel.slug || hotel.uuid}`;
    }
  };

  const openMap = (lat, lng, name) => {
    if (lat && lng) {
      window.open(
        `https://maps.google.com/?q=${lat},${lng}&label=${encodeURIComponent(
          name
        )}`,
        "_blank"
      );
    }
  };

  if (loading) return <Loading message="Hotels loading..." />;

  if (error)
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">Failed to load hotels</h3>
          <p className="text-sm text-gray-500 max-w-sm">{error}</p>
        </div>
        <button
          onClick={fetchHotels}
          className="px-6 py-2.5 bg-[#857749] hover:bg-[#9a8a56] text-white text-sm font-semibold rounded-xl transition"
        >
          Try again
        </button>
      </div>
    );

  if (!Array.isArray(hotels) || hotels.length === 0)
    return <p className="text-center">No hotels available.</p>;

  return (
    <PageTransition>
    <div className="w-full bg-gray-50">
      {/* Banner */}
      <section className="w-full">
        <BannerHotel />
      </section>

      {/* Section header */}
      <div className="w-10/12 max-w-7xl mx-auto pt-16 pb-10 flex flex-col gap-3 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#857749]">
          Our Collection
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Explore <span className="text-[#857749]">Hotels</span>
        </h2>
        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
          Handpicked accommodations offering extraordinary comfort, service, and
          unforgettable experiences.
        </p>
      </div>

      {/* Cards grid */}
      <div className="w-10/12 max-w-7xl mx-auto pb-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={
                  hotel.images?.[0] ||
                  hotel.images ||
                  "/image/default-hotel.jpg"
                }
                alt={hotel.name || "Hotel"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Status */}
              {hotel.status && (
                <span
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
                    hotel.status === "active"
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {hotel.status === "active" ? "Available" : "Unavailable"}
                </span>
              )}

              {/* Featured */}
              {hotel.featured && (
                <span className="absolute top-4 right-4 bg-[#857749] text-white px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase">
                  Featured
                </span>
              )}

              {/* Price overlay */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
                <span className="text-lg font-bold text-[#857749]">
                  ${hotel.starting_price || hotel.price || "N/A"}
                </span>
                <span className="text-[10px] text-gray-500 ml-1">/night</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-5 gap-3">
              {/* Title + Rating row */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 leading-tight">
                  {hotel.name}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  <div className="flex gap-0.5">
                    {renderStars(hotel.average_rating || hotel.rating)}
                  </div>
                  <span className="text-xs text-gray-400 ml-0.5">
                    ({hotel.reviews_count || hotel.reviewCount || 0})
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {hotel.description || "A wonderful place to stay!"}
              </p>

              {/* Location */}
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt
                  className="text-[#857749]/60 mt-0.5 flex-shrink-0"
                  size={13}
                />
                <div className="text-xs text-gray-500 leading-relaxed">
                  <span>{hotel.address}</span>
                  {(hotel.city || hotel.state || hotel.country) && (
                    <span className="text-gray-400">
                      {" "}
                      · {[hotel.city, hotel.state, hotel.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  )}
                </div>
                {hotel.latitude && hotel.longitude && (
                  <button
                    onClick={() =>
                      openMap(hotel.latitude, hotel.longitude, hotel.name)
                    }
                    className="text-[#857749] hover:text-[#6d6139] text-xs font-medium ml-auto shrink-0"
                  >
                    Map
                  </button>
                )}
              </div>

              {/* Amenities */}
              {hotel.amenities &&
                Array.isArray(hotel.amenities) &&
                hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hotel.amenities.slice(0, 5).map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-gray-50 text-gray-500 px-2.5 py-1 rounded-lg text-[11px]"
                        title={amenity}
                      >
                        {getAmenityIcon(amenity)}
                        <span className="capitalize">{amenity}</span>
                      </div>
                    ))}
                    {hotel.amenities.length > 5 && (
                      <span className="text-[11px] text-gray-400 px-2 py-1">
                        +{hotel.amenities.length - 5}
                      </span>
                    )}
                  </div>
                )}

              {/* Divider */}
              <div className="border-t border-gray-100 mt-auto" />

              {/* Footer: rooms info + CTA */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">
                    {hotel.room_types_count ||
                      hotel.roomTypesCount ||
                      "Multiple"}{" "}
                    room types
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">
                    {hotel.available_rooms || hotel.amountRoom || 0} available
                  </span>
                </div>

                <Link
                  href={`/hotels/${hotel.uuid}`}
                  className="flex items-center gap-2 bg-[#857749] hover:bg-[#6d6139] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
                >
                  Explore
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </PageTransition>
  );
};

export default HotelCard;
