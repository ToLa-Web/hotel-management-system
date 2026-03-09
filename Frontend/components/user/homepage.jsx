"use client";
import TiltCard from "@components/motion/TiltCard";
import { RoomDetail, HotelData } from "@data/HotelData";
import Image from "next/image";
import { FacilitiesHotel } from "@data/HotelData";
import MenuFilter from "@components/user/layout/MenuFilter";
import { Button } from "@components/user/layout/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@app/loading";

const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000';
const roomIds = [1, 2, 3];

const parseImages = (images) => {
  if (!images) return [];
  if (Array.isArray(images)) return images;
  try { return JSON.parse(images) ?? []; } catch { return []; }
};

// Static enrichment for the Top Properties section
const topProperties = [
  {
    id: 1,
    type: "Guesthouse",
    stars: 5,
    name: "Paradise Lodge Resort",
    location: "Siem Reap, Cambodia",
    score: 8.7,
    scoreLabel: "Excellent",
    reviews: 1075,
    originalPrice: 250,
    price: 183,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    type: "Resort",
    stars: 4,
    name: "Nature Escape Resort",
    location: "Kampot, Cambodia",
    score: 8.2,
    scoreLabel: "Very Good",
    reviews: 279,
    originalPrice: 180,
    price: 92,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    type: "Hotel",
    stars: 5,
    name: "Royal Grand Hotel",
    location: "Phnom Penh, Cambodia",
    score: 9.6,
    scoreLabel: "Exceptional",
    reviews: 486,
    originalPrice: 420,
    price: 316,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    type: "Hotel",
    stars: 4,
    name: "Victoria Riverside Hotel",
    location: "Battambang, Cambodia",
    score: 8.8,
    scoreLabel: "Excellent",
    reviews: 389,
    originalPrice: 310,
    price: 205,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070&auto=format&fit=crop",
  },
];

const getScoreColor = (score) => {
  if (score >= 9) return "bg-[#857749]";
  if (score >= 8) return "bg-[#6b5e35]";
  if (score >= 7) return "bg-[#9a8a56]";
  return "bg-[#b5a88a]";
};

const StarRating = ({ count }) => (
  <span className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-3.5 h-3.5 ${i < count ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </span>
);

export const HomePage = () => {
  const router = useRouter();
  const [roomsInHomePage, setRoomsInHomePage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const [scrolled, setScrolled] = useState(false);

  const toggleWishlist = (id) =>
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL(`${API_URL}/api/room-types/featured`);
        roomIds.forEach((id) => url.searchParams.append("ids[]", id));

        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setRoomsInHomePage(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative mt-2 bg-white overflow-x-hidden">
      <div aria-hidden="true" className="pointer-events-none select-none">
        {/* Top-right gold glow */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#857749]/8 blur-[120px]" />
        {/* Mid-left warm glow */}
        <div className="absolute top-[40%] -left-40 w-[500px] h-[500px] rounded-full bg-[#c4a96a]/10 blur-[100px]" />
        {/* Bottom-right accent */}
        <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#857749]/6 blur-[90px]" />
        {/* Center faint warm haze */}
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[#f5efe6]/60 blur-[80px]" />
      </div>

      {/* ── Hero ── */}
      <div className="w-full h-screen flex flex-col gap-8 mt-8 pb-8">
        <div className="flex justify-center items-center w-full">
          <div className="w-10/12 flex justify-between h-[70vh]">
            <div className="w-5/12 flex flex-col gap-8 justify-center h-full">
              <h2 className="text-textColor text-3xl font-semibold">
                Paradise View
              </h2>
              <h1 className="text-black text-5xl font-bold">
                Hotel for every <br /> moment rich in <br /> emotion
              </h1>
              <p className="text-sm text-gray-500">
                Every moment feels like the first time <br /> in paradise view
              </p>
              <div className="w-fit">
                <Button param="Book Now" style="rounded-lg" Rooms={() => router.push('/hotels')} />
              </div>
            </div>
            <div className="w-5/12 h-full lg:h-[80vh] relative">
              <Image
                src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="banner"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Menu Filter (sticky) ── */}
      <div
        className={`lg:-mt-[19%] w-full flex justify-center items-center sticky top-16 z-30 transition-all duration-500 ${
          scrolled ? "py-2" : ""
        }`}
      >
        <div
          className={`w-10/12 transition-all duration-500 ${
            scrolled
              ? "rounded-2xl shadow-2xl shadow-black/20 ring-1 ring-black/5 backdrop-blur-xl bg-white/90"
              : ""
          }`}
        >
          <MenuFilter />
        </div>
      </div>

      {/* ── Promo Deal Banner ── */}
      <div className="w-full flex justify-center items-center mt-20 px-4">
        <div className="w-10/12 flex items-center justify-between bg-white border border-gray-200 rounded-2xl shadow-md px-8 py-6 gap-6 overflow-hidden relative">
          {/* Decorative gradient blob */}
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#f5edd8] rounded-full opacity-60 pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#857749] tracking-wide uppercase">
              Early 2026 Deals
            </span>
            <h3 className="text-3xl font-extrabold text-gray-900">
              At least 15% off
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Save on your next stay with Early 2026 Deals. Book now, stay
              until April 1, 2026.
            </p>
            <div className="mt-3 w-fit">
              <button className="px-6 py-2.5 bg-[#857749] hover:bg-[#9a8a56] active:scale-95 transition-all duration-200 text-white font-semibold rounded-lg text-sm shadow">
                Explore deals
              </button>
            </div>
          </div>
          <div className="relative w-36 h-36 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=800&auto=format&fit=crop"
              alt="deals"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* ── Facilities ── */}
      <div className="flex flex-col gap-8 w-full h-full justify-center items-center mt-16">
        <div className="flex flex-col gap-3 justify-center items-center w-10/12">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#857749]">
            What we offer
          </span>
          <h2 className="text-3xl font-bold text-gray-900">Our Facilities</h2>
          <p className="text-gray-500 text-base text-center max-w-md">
            We offer modern 5-star hotel facilities crafted for your ultimate
            comfort.
          </p>
        </div>
        <div className="w-10/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-textColor">
          {FacilitiesHotel.map((fh) => (
            <TiltCard key={fh.id} icon={fh.icon} text={fh.facility} />
          ))}
        </div>
      </div>

      {/* ── Luxurious Rooms ── */}
      <div className="w-full py-8 mt-16">
        <div className="w-10/12 mx-auto flex flex-col gap-12">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#857749]">
                Premium Collection
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Luxurious{" "}
                <span className="text-[#857749]">Rooms</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-xs text-sm leading-relaxed md:text-right">
              Each room is crafted with the finest materials and meticulous
              attention to detail for an unforgettable stay.
            </p>
          </div>

          {/* Asymmetric card grid */}
          {roomsInHomePage.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:auto-rows-[260px]">

              {/* Featured card — 2 cols × 2 rows */}
              {roomsInHomePage[0] && (
                <div
                  className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer"
                  onClick={() => router.push(`/hotels/${roomsInHomePage[0].hotel?.uuid || roomsInHomePage[0].hotel_id}`)}
                >
                  <Image
                    src={parseImages(roomsInHomePage[0].images)[0] || "/image/HotelImage5.jpg"}
                    alt={roomsInHomePage[0].name || "Room"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute top-5 left-5 flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-[#857749] text-white text-xs font-bold rounded-full shadow">
                      Most Popular
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm shadow ${
                        roomsInHomePage[0].status === "active"
                          ? "bg-green-100/90 text-green-700"
                          : "bg-red-100/90 text-red-700"
                      }`}
                    >
                      {roomsInHomePage[0].status === "active" ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(roomsInHomePage[0].amenities)
                        ? roomsInHomePage[0].amenities
                        : []
                      ).slice(0, 4).map((a, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/15 backdrop-blur-sm text-white text-xs rounded-lg border border-white/30">
                          {a}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-white text-xl font-bold drop-shadow">
                      {roomsInHomePage[0].name}
                    </h3>
                    <p className="text-white/70 text-xs line-clamp-1">
                      {roomsInHomePage[0].description}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-white">
                          ${roomsInHomePage[0].base_price}
                        </span>
                        <span className="text-white/60 text-xs">/ night</span>
                      </div>
                      <button
                        className="px-4 py-2 bg-[#857749] hover:bg-[#9a8a56] active:scale-95 text-white font-semibold rounded-xl transition-all duration-200 text-xs shadow-lg"
                        onClick={(e) => { e.stopPropagation(); router.push(`/hotels/${roomsInHomePage[0].hotel?.uuid || roomsInHomePage[0].hotel_id}`); }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Smaller side cards */}
              {roomsInHomePage.slice(1).map((room) => (
                <div
                  key={room.id}
                  className="group relative overflow-hidden rounded-3xl shadow-xl cursor-pointer"
                  onClick={() => router.push(`/hotels/${room.hotel?.uuid || room.hotel_id}`)}
                >
                  <Image
                    src={parseImages(room.images)[0] || "/image/HotelImage5.jpg"}
                    alt={room.name || "Room"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm shadow ${
                        room.status === "active"
                          ? "bg-green-100/90 text-green-700"
                          : "bg-red-100/90 text-red-700"
                      }`}
                    >
                      {room.status === "active" ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(room.amenities) ? room.amenities : [])
                        .slice(0, 3)
                        .map((a, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white/15 backdrop-blur-sm text-white text-xs rounded-lg border border-white/30">
                            {a}
                          </span>
                        ))}
                    </div>
                    <h3 className="text-white text-lg font-bold drop-shadow">
                      {room.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-white">
                          ${room.base_price}
                        </span>
                        <span className="text-white/60 text-xs">/ night</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/70 text-xs">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium">{room.size} m²</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All */}
          <div className="flex justify-center">
            <button
              className="group flex items-center gap-2 px-8 py-3.5 border-2 border-[#857749] text-[#857749] font-semibold rounded-xl hover:bg-[#857749] hover:text-white transition-all duration-300 text-sm tracking-wide"
              onClick={() => router.push('/hotels')}
            >
              View All Rooms
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Top Unique Properties ── */}
      <div className="w-full flex justify-center items-center mt-10 mb-12">
        <div className="w-10/12 flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#857749]">
              Handpicked for you
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Stay at our top unique properties
            </h2>
            <p className="text-[#857749] text-sm font-medium">
              From luxury suites to boutique retreats, we have it all
            </p>
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topProperties.map((prop) => (
              <div
                key={prop.id}
                className="group flex flex-col bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-400 overflow-hidden border border-gray-100 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={prop.image}
                    alt={prop.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-600"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  {/* Wishlist button */}
                  <button
                    onClick={() => toggleWishlist(prop.id)}
                    className="absolute top-3 right-3 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 transition-colors ${
                        wishlist[prop.id]
                          ? "text-red-500 fill-red-500"
                          : "text-gray-500"
                      }`}
                      fill={wishlist[prop.id] ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 p-4">
                  {/* Type + Stars */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                      {prop.type}
                    </span>
                    <StarRating count={prop.stars} />
                    <span className="ml-auto text-[10px] font-bold bg-[#857749] text-white px-2 py-0.5 rounded">
                      Genius
                    </span>
                  </div>

                  {/* Name & Location */}
                  <div>
                    <h4 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#857749] transition-colors">
                      {prop.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">{prop.location}</p>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-white text-sm font-bold px-2 py-0.5 rounded-md ${getScoreColor(
                        prop.score
                      )}`}
                    >
                      {prop.score}
                    </span>
                    <div className="text-xs text-gray-600">
                      <span className="font-semibold">{prop.scoreLabel}</span>
                      <span className="text-gray-400 ml-1">
                        · {prop.reviews.toLocaleString()} reviews
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-2 pt-3 border-t border-gray-100 text-right">
                    <p className="text-xs text-gray-400">Starting from</p>
                    <div className="flex items-baseline justify-end gap-2">
                      <span className="text-sm text-[#b5a88a] line-through">
                        ${prop.originalPrice}
                      </span>
                      <span className="text-xl font-extrabold text-gray-900">
                        ${prop.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All button */}
          <div className="flex justify-center mt-2">
            <button
              onClick={() => router.push('/hotels')} 
              className="px-8 py-3 border-2 border-[#857749] text-[#857749] font-semibold rounded-xl hover:bg-[#857749] hover:text-white transition-all duration-300 text-sm tracking-wide">
              View all properties
            </button>
          </div>
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <div className="w-full py-16 flex justify-center">
        <div className="w-10/12 flex flex-col gap-10">
          <div className="flex flex-col gap-2 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#857749]">
              Our Promise
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose Paradise View?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-[#857749]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Best Price Guarantee",
                desc: "Find a lower price and we'll match it — no questions asked.",
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-[#857749]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                ),
                title: "24/7 Customer Support",
                desc: "Our dedicated team is available around the clock to assist you.",
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-[#857749]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                title: "Curated Experiences",
                desc: "Every property is handpicked to ensure an unforgettable stay.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-4 p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-[#857749]/10 rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
