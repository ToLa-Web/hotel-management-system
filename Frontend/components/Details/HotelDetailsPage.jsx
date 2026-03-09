import Link from "next/link";
import { HiWifi } from "react-icons/hi";
import { MdOutlineAirportShuttle } from "react-icons/md";
import { MdFamilyRestroom } from "react-icons/md";
import { TbSmokingNo } from "react-icons/tb";
import { PiFlowerLotusBold } from "react-icons/pi";
import { IoIosRestaurant } from "react-icons/io";
import { LuSquareParking } from "react-icons/lu";
import { MdOutlineRoomService } from "react-icons/md";
import { MdOutlineCoffeeMaker } from "react-icons/md";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import React, { useState } from "react";
import DateRangePicker from "../shared/DateRangePicker";
import GuestRoomSelector from "../shared/GuestRoomSelector";

const SHOW_LIMIT = 4;

const surroundingsData = [
  {
    icon: "🏞️",
    label: "What's nearby",
    items: [
      { name: "Riverside Park", distance: "600 m" },
      { name: "Vattanac Capital", distance: "1.2 km" },
      { name: "National Museum of Cambodia", distance: "1.4 km" },
      { name: "Royal Palace Phnom Penh", distance: "1.5 km" },
      { name: "Wat Botomvatey Playground", distance: "2 km" },
      { name: "Royal Palace Park", distance: "2 km" },
      { name: "Wat Botum Park", distance: "2.1 km" },
      { name: "Wat Botum Park", distance: "2.2 km" },
      { name: "Krom Ngoy Statue", distance: "2.3 km" },
      { name: "Cambodian Independence Monument", distance: "2.7 km" },
    ],
  },
  {
    icon: "🍽️",
    label: "Restaurants & cafes",
    items: [
      { name: "Cafe/bar - Bar Oz Riverside Guesthouse", distance: "100 m" },
      { name: "Cafe/bar - Khouly Cafe", distance: "400 m" },
      { name: "Cafe/bar - Merf Cafe", distance: "400 m" },
    ],
  },
  {
    icon: "🚌",
    label: "Public transport",
    items: [
      { name: "Bus · Sorya Bus Station", distance: "1.6 km" },
      { name: "Train · Cambodia Railway Station", distance: "1.5 km" },
      { name: "Bus · Mekong Express Bus Station", distance: "2.2 km" },
      { name: "Train · Airport", distance: "10 km" },
    ],
  },
  {
    icon: "⭐",
    label: "Top attractions",
    items: [
      { name: "Samdech Hun Sen Park", distance: "2.7 km" },
      { name: "Sontepheap Garden", distance: "2.8 km" },
      { name: "Preah Sihanouk Garden", distance: "2.8 km" },
      { name: "Phnom Penh Tower", distance: "2.8 km" },
      { name: "Statue of King Father Norodom Sihanouk", distance: "2.9 km" },
      { name: "Moha Montrei Pagoda", distance: "3.6 km" },
      { name: "Tuol Sleng Genocide Museum", distance: "4.2 km" },
      { name: "Sovanna Phum Art Association & Art Gallery", distance: "6 km" },
      { name: "Killing Fields of Choeung Ek", distance: "13 km" },
    ],
  },
  {
    icon: "✈️",
    label: "Closest airports",
    items: [
      { name: "Phnom Penh International Airport", distance: "9 km" },
    ],
  },
];

const simpleHouseRules = [
  { icon: "⏩", label: "Check-in", value: "Available 24 hours" },
  { icon: "⏪", label: "Check-out", value: "Available 24 hours" },
  { icon: "🚫", label: "No age restriction", value: "There is no age requirement for check-in" },
  { icon: "🐾", label: "Pets", value: "Pets are not allowed." },
];

const cotPolicies = [
  {
    icon: "🧒",
    ageLabel: "0 - 6 years",
    beds: [
      { type: "Extra bed upon request", cost: "US$10 per child, per night", isFree: false },
      { type: "Cot upon request", cost: "Free", isFree: true },
    ],
  },
  {
    icon: "🧒",
    ageLabel: "7 - 12 years",
    beds: [
      { type: "Extra bed upon request", cost: "US$10 per child, per night", isFree: false },
    ],
  },
  {
    icon: "🧑",
    ageLabel: "13+ years",
    beds: [
      { type: "Extra bed upon request", cost: "US$20 per person, per night", isFree: false },
    ],
  },
];

const paymentMethods = ["VISA", "MasterCard", "UnionPay", "Cash"];

const HotelDetailsPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (label) =>
    setExpandedCategories((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <div>
      <div className="w-12/12 flex justify-between border-b border-gray-300 bg-[#f8f7f5]">
        <div className="w-8/12">
          <div className="flex flex-col gap-4 p-4">
            <div>
              <div className="mb-4 text-sm">
                <p>
                  You might be eligible for a Genius discount at X One Hotel.
                  To check if a Genius discount is available for your selected
                  dates
                  <span className="text-bgDarkColor hover:text-textColor hover:opacity-70  hover:underline underline-offset-2">
                    <Link href="#"> sign in</Link>
                  </span>
                  .
                </p>
              </div>
              <p className="mb-4 text-sm">
                Genius discounts at this property are subject to book dates,
                stay dates and other available deals.
              </p>
              <p className="mb-4 text-sm">
                <span className="font-bold text-[#008234]">
                  Reliable info:
                </span>{" "}
                Guests say the description and photos for this property are
                very accurate.
              </p>
              <p className="mb-4 text-sm">
                Well situated in Phnom Penh, X One Hotel offers
                air-conditioned rooms with free WiFi, free private parking and
                room service. Featuring a 24-hour front desk, this property
                also welcomes guests with a restaurant and a terrace. The
                accommodation provides airport transfers, while a car rental
                service is also available. The units at the hotel come with a
                seating area, a flat-screen TV and a safety deposit box. With
                a private bathroom equipped with a shower and free toiletries,
                certain units at X One Hotel also have a city view. All guest
                rooms will provide guests with a desk and a kettle. Guests at
                the accommodation can enjoy an à la carte or an Asian
                breakfast. Popular points of interest near X One Hotel include
                Riverside Park, Wat Phnom and Sisowath Quay. Phnom Penh
                International Airport is 9 km away.
              </p>
              <p className="mb-4 text-sm">
                Couples particularly like the location — they rated it 9.6 for
                a two-person trip.
              </p>
            </div>
          </div>
          <div>
            <div className=" max-w-4xl p-6">
              <h2 className="text-lg font-semibold mb-4">
                Most popular facilities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 text-green-600">
                {/* <!-- Facility 1 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <HiWifi />
                  </span>
                  <span className="text-sm font-medium">Free WiFi</span>
                </div>
                {/* <!-- Facility 2 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <MdOutlineAirportShuttle />
                  </span>
                  <span className="text-sm font-medium">Airport shuttle</span>
                </div>
                {/* <!-- Facility 3 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <MdFamilyRestroom />
                  </span>
                  <span className="text-sm font-medium">Family rooms</span>
                </div>
                {/* <!-- Facility 4 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <TbSmokingNo />
                  </span>
                  <span className="text-sm font-medium">
                    Non-smoking rooms
                  </span>
                </div>
                {/* <!-- Facility 5 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <PiFlowerLotusBold />
                  </span>
                  <span className="text-sm font-medium">
                    Spa and wellness centre
                  </span>
                </div>
                {/* <!-- Facility 6 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <IoIosRestaurant />
                  </span>
                  <span className="text-sm font-medium">2 restaurants</span>
                </div>
                {/* <!-- Facility 7 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <LuSquareParking />
                  </span>
                  <span className="text-sm font-medium">Free parking</span>
                </div>
                {/* <!-- Facility 8 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <MdOutlineRoomService />
                  </span>
                  <span className="text-sm font-medium">Room service</span>
                </div>
                {/* <!-- Facility 9 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <MdOutlineCoffeeMaker />
                  </span>
                  <span className="text-sm font-medium">
                    Tea/coffee maker in all rooms
                  </span>
                </div>
                {/* <!-- Facility 10 --> */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    <MdOutlineFreeBreakfast />
                  </span>
                  <span className="text-sm font-medium">Breakfast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" w-4/12 max-w-sm mx-auto p-4 ">
          <div className=" max-w-sm mx-auto p-4 bg-bgtextColor rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Property highlights
            </h2>
            <div className="mb-4">
              <p className="flex items-start gap-2 text-sm">
                <span className="text-xl text-blue-500">&#128205;</span>
                Situated in the real heart of Phnom Penh, this hotel has an
                excellent location score of 9.2
              </p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-base">Breakfast info</h3>
              <p>Asian</p>
            </div>
            <div className="mb-4 flex items-center gap-2 text-sm">
              <span className="text-2xl text-gray-600">&#127359;</span>
              <p>Free private parking available at the hotel</p>
            </div>
            <button className="w-full py-2 bg-bgDarkColor hover:bg-buttonColor text-white font-semibold rounded-lg">
              Reserve
            </button>
          </div>
        </div>
      </div>
      <div className=" mt-4 flex justify-between gap-4 py-4 border-2 rounded-xl p-4 bg-white">
        <div className="flex flex-col justify-evenly">
          <h2 className="text-2xl font-bold ">Sign in, save money</h2>
          <p>To see if you can save 10% or more at this property, sign in</p>
          <div className="flex items-center gap-6">
            <button className="border border-bgDarkColor py-1 px-3 rounded-md text-textColor hover:bg-bgNavColor  transition-colors duration-300">
              Sign in
            </button>
            <Link
              href="#"
              className="text-bgDarkColor hover:text-textColor hover:opacity-70  hover:underline underline-offset-2"
            >
              Create an accout
            </Link>
          </div>
        </div>
        <div>
          <img
            src="/image/savingGift.jpg"
            alt="gift"
            className="w-40 h-full object-cover"
          />
        </div>
      </div>
      <div id="info-prices" className="mt-4 flex flex-col justify-center">
        <h2 className="text-3xl font-bold py-4">Availability</h2>
        <div className="flex max-w-[857px] gap-2 bg-amber-400  rounded-lg p-1 items-center">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <GuestRoomSelector
            guests={guests}
            setGuests={setGuests}
            rooms={rooms}
            setRooms={setRooms}
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
            Search
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col justify-center bg-[#9a8958]">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-separate border-spacing-1 border-[#7C6A46]">
            <thead>
              <tr className="bg-[#7C6A46] text-white text-left">
                <th className="p-4 rounded-tl-sm rounded-bl-sm">Room type</th>
                <th className="p-4">Number of guests</th>
                <th className="p-4">Today's price</th>
                <th className="p-4">Your choices</th>
                <th className="p-4 rounded-tr-sm">Select rooms</th>
              </tr>
            </thead>
            <tbody>
              {/* Standard Queen */}
              <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                  <div className="font-bold text-[#7C6A46] text-lg mb-1">
                    Standard Queen
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <span>1 large double bed</span>
                    <span className="text-xl">🛏️</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                    <span>24 m²</span>
                    <span>City view</span>
                    <span>Rooftop pool</span>
                    <span>Air conditioning</span>
                    <span>Private bathroom</span>
                    <span>Flat-screen TV</span>
                    <span>Minibar</span>
                    <span>Free WiFi</span>
                  </div>
                  <div className="text-red-600 font-semibold text-sm mt-2">
                    Only 2 rooms left on our site
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <div className="flex items-center gap-1 text-lg">
                    <span>2</span>
                    <span className="text-xl">👤👤</span>
                  </div>
                </td>
                <td className="p-4 align-top w-1/6">
                  <div className="text-gray-400 line-through text-sm">
                    KHR 615,223
                  </div>
                  <div className="text-[#7C6A46] font-bold text-xl">
                    KHR 159,970
                  </div>
                  <div className="text-xs text-gray-500">
                    Includes taxes and charges
                  </div>
                  <div className="bg-[#F8F6F2] text-[#7C6A46] px-2 py-1 rounded text-xs font-semibold mt-2 w-fit border border-[#7C6A46]">
                    74% off
                  </div>
                  <div className="bg-[#7C6A46] text-white px-2 py-1 rounded text-xs font-semibold mt-1 w-fit">
                    Getaway Deal
                  </div>
                </td>
                <td className="p-4 align-top w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#7C6A46] font-bold">✔</span>
                    <span className="font-semibold">Very good breakfast</span>
                    <span className="text-gray-500 text-xs">KHR 28,065</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                    <span>✔</span>
                    <span>Free cancellation before 8 May 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                    <span>✔</span>
                    <span>No prepayment needed</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Total cost to cancel
                  </div>
                  <div className="text-xs text-[#1A237E] font-semibold">
                    Genius discount may be available
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <select className="border border-[#7C6A46] rounded px-2 py-1">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                  </select>
                </td>
              </tr>

              {/* Deluxe Twin */}
              <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                  <div className="font-bold text-[#7C6A46] text-lg mb-1">
                    Deluxe Twin
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <span>2 single beds</span>
                    <span className="text-xl">🛏️🛏️</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                    <span>28 m²</span>
                    <span>Garden view</span>
                    <span>Balcony</span>
                    <span>Air conditioning</span>
                    <span>Private bathroom</span>
                    <span>Flat-screen TV</span>
                    <span>Free WiFi</span>
                  </div>
                  <div className="text-green-600 font-semibold text-sm mt-2">
                    Best seller
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <div className="flex items-center gap-1 text-lg">
                    <span>2</span>
                    <span className="text-xl">👤👤</span>
                  </div>
                </td>
                <td className="p-4 align-top w-1/6">
                  <div className="text-gray-400 line-through text-sm">
                    KHR 500,000
                  </div>
                  <div className="text-[#7C6A46] font-bold text-xl">
                    KHR 320,000
                  </div>
                  <div className="text-xs text-gray-500">
                    Includes taxes and charges
                  </div>
                  <div className="bg-[#F8F6F2] text-[#7C6A46] px-2 py-1 rounded text-xs font-semibold mt-2 w-fit border border-[#7C6A46]">
                    36% off
                  </div>
                </td>
                <td className="p-4 align-top w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#7C6A46] font-bold">✔</span>
                    <span className="font-semibold">Breakfast included</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                    <span>✔</span>
                    <span>Free cancellation before 10 May 2025</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Pay at the property
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <select className="border border-[#7C6A46] rounded px-2 py-1">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                  </select>
                </td>
              </tr>

              {/* Family Suite */}
              <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                  <div className="font-bold text-[#7C6A46] text-lg mb-1">
                    Family Suite
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <span>2 double beds & 1 sofa bed</span>
                    <span className="text-xl">🛏️🛏️🛋️</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                    <span>45 m²</span>
                    <span>Sea view</span>
                    <span>Balcony</span>
                    <span>Kitchenette</span>
                    <span>Private bathroom</span>
                    <span>Flat-screen TV</span>
                    <span>Minibar</span>
                    <span>Free WiFi</span>
                  </div>
                  <div className="text-[#1A237E] font-semibold text-sm mt-2">
                    Perfect for families
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <div className="flex items-center gap-1 text-lg">
                    <span>5</span>
                    <span className="text-xl">👤👤👤👤👤</span>
                  </div>
                </td>
                <td className="p-4 align-top w-1/6">
                  <div className="text-gray-400 line-through text-sm">
                    KHR 1,200,000
                  </div>
                  <div className="text-[#7C6A46] font-bold text-xl">
                    KHR 950,000
                  </div>
                  <div className="text-xs text-gray-500">
                    Includes taxes and charges
                  </div>
                  <div className="bg-[#7C6A46] text-white px-2 py-1 rounded text-xs font-semibold mt-1 w-fit">
                    Family Deal
                  </div>
                </td>
                <td className="p-4 align-top w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#7C6A46] font-bold">✔</span>
                    <span className="font-semibold">Breakfast included</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                    <span>✔</span>
                    <span>Free cancellation before 12 May 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                    <span>✔</span>
                    <span>No prepayment needed</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Pay at the property
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <select className="border border-[#7C6A46] rounded px-2 py-1">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                  </select>
                </td>
              </tr>

              {/* Executive Suite */}
              <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                  <div className="font-bold text-[#7C6A46] text-lg mb-1">
                    Executive Suite
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <span>1 king bed</span>
                    <span className="text-xl">🛏️</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                    <span>60 m²</span>
                    <span>City & river view</span>
                    <span>Private balcony</span>
                    <span>Jacuzzi</span>
                    <span>Private bathroom</span>
                    <span>Flat-screen TV</span>
                    <span>Minibar</span>
                    <span>Free WiFi</span>
                  </div>
                  <div className="text-[#7C6A46] font-semibold text-sm mt-2">
                    Exclusive offer
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <div className="flex items-center gap-1 text-lg">
                    <span>2</span>
                    <span className="text-xl">👤👤</span>
                  </div>
                </td>
                <td className="p-4 align-top w-1/6">
                  <div className="text-gray-400 line-through text-sm">
                    KHR 2,000,000
                  </div>
                  <div className="text-[#7C6A46] font-bold text-xl">
                    KHR 1,500,000
                  </div>
                  <div className="text-xs text-gray-500">
                    Includes taxes and charges
                  </div>
                  <div className="bg-[#7C6A46] text-white px-2 py-1 rounded text-xs font-semibold mt-1 w-fit">
                    25% off
                  </div>
                </td>
                <td className="p-4 align-top w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#7C6A46] font-bold">✔</span>
                    <span className="font-semibold">Breakfast included</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                    <span>✔</span>
                    <span>Free cancellation before 15 May 2025</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Pay at the property
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <select className="border border-[#7C6A46] rounded px-2 py-1">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                  </select>
                </td>
              </tr>

              {/* Luxury Suite */}
              <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                  <div className="font-bold text-[#7C6A46] text-lg mb-1">
                    Luxury Suite
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <span>1 king bed & 1 sofa bed</span>
                    <span className="text-xl">🛏️🛋️</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                    <span>75 m²</span>
                    <span>Panoramic view</span>
                    <span>Private terrace</span>
                    <span>Walk-in closet</span>
                    <span>Rain shower</span>
                    <span>Smart TV</span>
                    <span>Mini bar</span>
                    <span>Free WiFi</span>
                  </div>
                  <div className="text-[#7C6A46] font-semibold text-sm mt-2">
                    Premium experience
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <div className="flex items-center gap-1 text-lg">
                    <span>3</span>
                    <span className="text-xl">👤👤👤</span>
                  </div>
                </td>
                <td className="p-4 align-top w-1/6">
                  <div className="text-gray-400 line-through text-sm">
                    KHR 2,500,000
                  </div>
                  <div className="text-[#7C6A46] font-bold text-xl">
                    KHR 1,800,000
                  </div>
                  <div className="text-xs text-gray-500">
                    Includes taxes and charges
                  </div>
                  <div className="bg-[#7C6A46] text-white px-2 py-1 rounded text-xs font-semibold mt-1 w-fit">
                    28% off
                  </div>
                </td>
                <td className="p-4 align-top w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#7C6A46] font-bold">✔</span>
                    <span className="font-semibold">
                      Premium breakfast included
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                    <span>✔</span>
                    <span>Free cancellation before 20 May 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                    <span>✔</span>
                    <span>Complimentary airport transfer</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Pay at the property
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <select className="border border-[#7C6A46] rounded px-2 py-1">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                  </select>
                </td>
              </tr>

              {/* Presidential Suite */}
              <tr className="bg-white border-2 border-[#7C6A46] rounded-xl shadow-md">
                <td className="p-4 align-top w-1/4 border-[#7C6A46] rounded-l-xl">
                  <div className="font-bold text-[#7C6A46] text-lg mb-1">
                    Presidential Suite
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <span>1 king bed & 2 sofa beds</span>
                    <span className="text-xl">🛏️🛋️🛋️</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                    <span>120 m²</span>
                    <span>360° city view</span>
                    <span>Private pool</span>
                    <span>Butler service</span>
                    <span>Private elevator</span>
                    <span>Home theater</span>
                    <span>Full bar</span>
                    <span>Free WiFi</span>
                  </div>
                  <div className="text-[#7C6A46] font-semibold text-sm mt-2">
                    Ultimate luxury
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <div className="flex items-center gap-1 text-lg">
                    <span>4</span>
                    <span className="text-xl">👤👤👤👤</span>
                  </div>
                </td>
                <td className="p-4 align-top w-1/6">
                  <div className="text-gray-400 line-through text-sm">
                    KHR 4,000,000
                  </div>
                  <div className="text-[#7C6A46] font-bold text-xl">
                    KHR 3,200,000
                  </div>
                  <div className="text-xs text-gray-500">
                    Includes taxes and charges
                  </div>
                  <div className="bg-[#7C6A46] text-white px-2 py-1 rounded text-xs font-semibold mt-1 w-fit">
                    20% off
                  </div>
                </td>
                <td className="p-4 align-top w-1/4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#7C6A46] font-bold">✔</span>
                    <span className="font-semibold">
                      All-inclusive package
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                    <span>✔</span>
                    <span>Free cancellation before 25 May 2025</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7C6A46] text-sm mb-1">
                    <span>✔</span>
                    <span>Private chef available</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Pay at the property
                  </div>
                </td>
                <td className="p-4 align-top w-1/12">
                  <select className="border border-[#7C6A46] rounded px-2 py-1">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Hotel Surroundings Section */}
      <div className="bg-[#f8f7f5] mt-8 py-6 border-b border-t">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Hotel surroundings</h2>
            <div className="flex flex-wrap gap-4 items-center mt-5 text-sm">
              <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded">
                Guests loved walking around the neighbourhood!
              </span>
              <span className="text-blue-700 hover:underline cursor-pointer">
                Excellent location - show map
              </span>
            </div>
          </div>
          <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
            See availability
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-sm">
          {surroundingsData.map((category) => {
            const isExpanded = !!expandedCategories[category.label];
            const visibleItems = isExpanded
              ? category.items
              : category.items.slice(0, SHOW_LIMIT);
            const hasMore = category.items.length > SHOW_LIMIT;

            return (
              <div key={category.label}>
                <div className="font-semibold mb-3 flex items-center gap-2">
                  <span className="text-base">{category.icon}</span>
                  {category.label}
                </div>
                <ul className="space-y-3">
                  {visibleItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center gap-2">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {item.distance}
                      </span>
                    </li>
                  ))}
                </ul>
                {hasMore && (
                  <button
                    onClick={() => toggleCategory(category.label)}
                    className="mt-3 text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
                  >
                    {isExpanded
                      ? "Show less"
                      : `Show more (+${category.items.length - SHOW_LIMIT})`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col md:flex-row md:justify-between items-center mt-6 text-xs text-gray-500 gap-2">
          <span>
            Shortest estimated walking or driving distances displayed; actual
            distances may vary.
          </span>
          <span>
            Missing some information?{" "}
            <a href="#" className="text-blue-700 hover:underline">
              Yes
            </a>{" "}
            /{" "}
            <a href="#" className="text-blue-700 hover:underline">
              No
            </a>
          </span>
        </div>
      </div>
      <div>
        {/* Facilities Section */}
        <div className="mt-8 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div id="facilities">
              <h2 className="text-2xl font-bold mb-1">
                Facilities of M9 Kirirorm Hotel
              </h2>
              <div className="text-gray-600 mb-2">
                Great facilities! Review score, 8.4
              </div>
            </div>
            <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
              See availability
            </button>
          </div>
          <div className=" max-w-4xl px-6 pb-6">
            <h2 className="text-lg font-semibold mb-4">
              Most popular facilities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 text-green-600">
              {/* <!-- Facility 1 --> */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <HiWifi />
                </span>
                <span className="text-sm font-medium">Free WiFi</span>
              </div>
              {/* <!-- Facility 2 --> */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <MdOutlineAirportShuttle />
                </span>
                <span className="text-sm font-medium">Airport shuttle</span>
              </div>
              {/* <!-- Facility 3 --> */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <MdFamilyRestroom />
                </span>
                <span className="text-sm font-medium">Family rooms</span>
              </div>
              {/* <!-- Facility 4 --> */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <TbSmokingNo />
                </span>
                <span className="text-sm font-medium">Non-smoking rooms</span>
              </div>
              {/* <!-- Facility 5 --> */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <PiFlowerLotusBold />
                </span>
                <span className="text-sm font-medium">
                  Spa and wellness centre
                </span>
              </div>
              {/* <!-- Facility 6 --> */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <IoIosRestaurant />
                </span>
                <span className="text-sm font-medium">2 restaurants</span>
              </div>
              {/* <!-- Facility 7 --> */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <LuSquareParking />
                </span>
                <span className="text-sm font-medium">Free parking</span>
              </div>
              {/* <!-- Facility 8 --> */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <MdOutlineRoomService />
                </span>
                <span className="text-sm font-medium">Room service</span>
              </div>
              {/* <!-- Facility 9 --> */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <MdOutlineCoffeeMaker />
                </span>
                <span className="text-sm font-medium">
                  Tea/coffee maker in all rooms
                </span>
              </div>
              {/* <!-- Facility 10 --> */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <MdOutlineFreeBreakfast />
                </span>
                <span className="text-sm font-medium">Breakfast</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
            {/* Bathroom */}
            <div>
              <div className="font-semibold mb-4">Bathroom</div>
              <ul className="space-y-4 text-gray-700">
                <li>Toilet paper</li>
                <li>Towels</li>
                <li>Towels/sheets (extra fee)</li>
                <li>Additional toilet</li>
                <li>Slippers</li>
                <li>Private bathroom</li>
                <li>Toilet</li>
                <li>Free toiletries</li>
                <li>Bathrobe</li>
                <li>Hairdryer</li>
                <li>Shower</li>
              </ul>
            </div>
            {/* Bedroom, View, Outdoors, Kitchen, Room Amenities */}
            <div>
              <div className="font-semibold mb-4">Bedroom</div>
              <ul className="space-y-4 text-gray-700">
                <li>Linen</li>
                <li>Wardrobe or closet</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">View</div>
              <ul className="space-y-4 text-gray-700">
                <li>View</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">Outdoors</div>
              <ul className="space-y-4 text-gray-700">
                <li>Outdoor dining area</li>
                <li>Outdoor furniture</li>
                <li>Terrace</li>
                <li>Balcony</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">Kitchen</div>
              <ul className="space-y-4 text-gray-700">
                <li>Dining table</li>
                <li>Tumble dryer</li>
                <li>Electric kettle</li>
                <li>Refrigerator</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">Room Amenities</div>
              <ul className="space-y-4 text-gray-700">
                <li>Socket near the bed</li>
                <li>Clothes rack</li>
              </ul>
            </div>
            {/* Activities, Living Area, Media & Technology, Food & Drink, Internet, Parking, Reception services */}
            <div>
              <div className="font-semibold mb-4">Activities</div>
              <ul className="space-y-4 text-gray-700">
                <li>
                  Tour or class about local culture{" "}
                  <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    Additional charge
                  </span>
                </li>
                <li>
                  Happy hour{" "}
                  <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    Additional charge
                  </span>
                </li>
                <li>
                  Bike tours{" "}
                  <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    Additional charge
                  </span>
                </li>
                <li>Walking tours</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">Living Area</div>
              <ul className="space-y-4 text-gray-700">
                <li>Dining area</li>
                <li>Seating Area</li>
                <li>Desk</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">
                Media & Technology
              </div>
              <ul className="space-y-4 text-gray-700">
                <li>Flat-screen TV</li>
                <li>TV</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">Food & Drink</div>
              <ul className="space-y-4 text-gray-700">
                <li>Coffee house on site</li>
                <li>
                  Wine/champagne{" "}
                  <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    Additional charge
                  </span>
                </li>
                <li>Restaurant</li>
                <li>Tea/Coffee maker</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">Internet</div>
              <ul className="space-y-4 text-gray-700">
                <li>WiFi is available in the rooms and is free of charge.</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">Parking</div>
              <ul className="space-y-4 text-gray-700">
                <li>
                  Free public parking is possible on site (reservation is not
                  needed).
                </li>
              </ul>
              <div className="font-semibold mt-4 mb-4">
                Reception services
              </div>
              <ul className="space-y-4 text-gray-700">
                <li>Invoice provided</li>
                <li>Concierge service</li>
                <li>Luggage storage</li>
                <li>Tour desk</li>
                <li>24-hour front desk</li>
              </ul>
            </div>
            {/* Cleaning, Safety, General, Accessibility, Languages spoken */}
            <div>
              <div className="font-semibold mb-4">Cleaning services</div>
              <ul className="space-y-4 text-gray-700">
                <li>Daily housekeeping</li>
                <li>
                  Trouser press{" "}
                  <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    Additional charge
                  </span>
                </li>
                <li>
                  Ironing service{" "}
                  <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    Additional charge
                  </span>
                </li>
                <li>
                  Dry cleaning{" "}
                  <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    Additional charge
                  </span>
                </li>
                <li>
                  Laundry{" "}
                  <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    Additional charge
                  </span>
                </li>
              </ul>
              <div className="font-semibold mt-4 mb-4">Safety & security</div>
              <ul className="space-y-4 text-gray-700">
                <li>Fire extinguishers</li>
                <li>CCTV outside property</li>
                <li>CCTV in common areas</li>
                <li>Smoke alarms</li>
                <li>Security alarm</li>
                <li>Key card access</li>
                <li>Key access</li>
                <li>24-hour security</li>
                <li>Safety deposit box</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">General</div>
              <ul className="space-y-4 text-gray-700">
                <li>Minimarket on site</li>
                <li>Designated smoking area</li>
                <li>Air conditioning</li>
                <li>Tile/marble floor</li>
                <li>Car hire</li>
                <li>Soundproof rooms</li>
                <li>Lift</li>
                <li>Family rooms</li>
                <li>
                  Airport shuttle{" "}
                  <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded">
                    Additional charge
                  </span>
                </li>
                <li>Non-smoking rooms</li>
                <li>Room service</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">Accessibility</div>
              <ul className="space-y-4 text-gray-700">
                <li>Entire unit wheelchair accessible</li>
              </ul>
              <div className="font-semibold mt-4 mb-4">Languages spoken</div>
              <ul className="space-y-4 text-gray-700">
                <li>English</li>
                <li>Khmer</li>
                <li>Chinese</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between items-center mt-6 text-xs text-gray-500 gap-2">
            <span></span>
            <span>
              Missing some information?{" "}
              <a href="#" className="text-blue-700 hover:underline">
                Yes
              </a>{" "}
              /{" "}
              <a href="#" className="text-blue-700 hover:underline">
                No
              </a>
            </span>
          </div>
        </div>
      </div>
      {/* House Rules Section */}
      <div id="house-rules" className="bg-[#f8f7f5] mt-8 p-6 border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">House rules</h2>
            <div className="text-gray-600 mb-2">
              Phnom Penh 51 Hotel & Residences takes special requests - add in
              the next step!
            </div>
          </div>
          <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow">
            See availability
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {/* Check-in & Check-out */}
          {simpleHouseRules.slice(0, 2).map((rule) => (
            <div key={rule.label} className="flex items-start gap-4 py-4">
              <span className="text-xl mt-1">{rule.icon}</span>
              <div>
                <div className="font-semibold">{rule.label}</div>
                <div className="text-gray-700">{rule.value}</div>
              </div>
            </div>
          ))}
          {/* Cancellation/prepayment */}
          <div className="flex items-start gap-4 py-4">
            <span className="text-xl mt-1">❗</span>
            <div>
              <div className="font-semibold">Cancellation / prepayment</div>
              <div className="text-gray-700">
                Cancellation and prepayment policies vary according to
                accommodation type. Please check what{" "}
                <a href="#" className="text-blue-700 underline">
                  conditions
                </a>{" "}
                may apply to each option when making your selection.
              </div>
            </div>
          </div>
          {/* Children and beds */}
          <div className="flex items-start gap-4 py-4">
            <span className="text-xl mt-1">👶</span>
            <div className="w-full">
              <div className="font-semibold">Children and beds</div>
              <div className="flex flex-col md:flex-row md:gap-8 mt-2">
                <div className="w-full md:w-1/2">
                  <div className="font-semibold mb-1">Child policies</div>
                  <div className="text-gray-700 mb-2">
                    Children of any age are welcome.
                    <br />
                    Children 13 years and above will be charged as adults at
                    this property.
                    <br />
                    <br />
                    To see correct prices and occupancy information, please
                    add the number of children in your group and their ages to
                    your search.
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="font-semibold mb-1">
                    Cot and extra bed policies
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    {cotPolicies.map((group, gi) => (
                      <div key={group.ageLabel}>
                        <div className="flex items-center border-b p-2 bg-gray-50">
                          <span className="text-lg mr-2">{group.icon}</span>
                          <span className="font-semibold">{group.ageLabel}</span>
                        </div>
                        {group.beds.map((bed, bi) => {
                          const isLastBedInLastGroup =
                            gi === cotPolicies.length - 1 &&
                            bi === group.beds.length - 1;
                          const isLastBedInGroup = bi === group.beds.length - 1;
                          return (
                            <div
                              key={bed.type}
                              className={`flex flex-col md:flex-row${!isLastBedInLastGroup && isLastBedInGroup
                                  ? " border-b"
                                  : !isLastBedInGroup
                                    ? " border-b"
                                    : ""
                                }`}
                            >
                              <div className="flex-1 flex items-center gap-2 p-2 border-r">
                                <span className="text-base">🛏️</span>
                                <span>{bed.type}</span>
                              </div>
                              <div className="flex-1 flex items-center gap-2 p-2">
                                {bed.isFree ? (
                                  <span className="text-green-700 font-semibold">Free</span>
                                ) : (
                                  <span className="text-gray-700">{bed.cost}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Prices for cots and extra beds are not included in the
                    total price, and will have to be paid for separately
                    during your stay.
                    <br />
                    The number of extra beds and cots allowed is dependent on
                    the option you choose. Please check your selected option
                    for more information.
                    <br />
                    All cots and extra beds are subject to availability.
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* No age restriction & Pets */}
          {simpleHouseRules.slice(2).map((rule) => (
            <div key={rule.label} className="flex items-start gap-4 py-4">
              <span className="text-xl mt-1">{rule.icon}</span>
              <div>
                <div className="font-semibold">{rule.label}</div>
                <div className="text-gray-700">{rule.value}</div>
              </div>
            </div>
          ))}
          {/* Accepted payment methods */}
          <div className="flex items-start gap-4 py-4">
            <span className="text-xl mt-1">💳</span>
            <div>
              <div className="font-semibold">Accepted payment methods</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method}
                    className="inline-block bg-gray-100 px-3 py-1 rounded text-xs font-semibold border"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important and legal info placeholder */}
      <div id="legal-info" className="bg-white mt-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Important and legal info</h2>
        <p className="text-gray-600 text-sm">
          Please review the property's terms, conditions, and local regulations before booking.
        </p>
      </div>

      {/* Guest reviews placeholder */}
      <div id="reviews" className="bg-white mt-8 p-6 border rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Guest reviews</h2>
        <p className="text-gray-500 text-sm">Guest reviews will appear here.</p>
      </div>
    </div>
  )
}

export default HotelDetailsPage
