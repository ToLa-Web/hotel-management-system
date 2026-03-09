
"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiSend,
  FiArrowRight,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTripadvisor,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/Explore" },
    { label: "Hotels", href: "/hotels" },
    { label: "About Us", href: "/About" },
    { label: "Contact", href: "/Contact" },
  ];

  const services = [
    "Luxury Suites",
    "Fine Dining",
    "Spa & Wellness",
    "Event Hosting",
    "Airport Transfer",
    "Concierge Service",
  ];

  return (
    <footer>
      {/* ── CTA Banner ── */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://watermark.lovepik.com/photo/20211122/large/lovepik-hotel-lobby-picture_500742423.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative w-10/12 max-w-3xl mx-auto text-center flex flex-col gap-6 items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Ready to Experience{" "}
            <span className="text-[#c4a96a]">Paradise View</span>?
          </h2>
          <p className="text-white/60 max-w-lg text-sm leading-relaxed">
            Book your stay today and discover why thousands of guests choose us
            for their most cherished moments.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Link
              href="/hotels"
              className="px-7 py-3.5 bg-[#857749] hover:bg-[#9a8a56] text-white font-semibold rounded-xl transition-all duration-300 text-sm shadow-lg shadow-[#857749]/30"
            >
              Book Now
            </Link>
            <Link
              href="/Contact"
              className="px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-white/20 transition-all duration-300 text-sm border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer body ── */}
      <div className="bg-[#2e291e] text-[#b5a88a]">
      {/* ── Gold accent top bar ── */}
      <div className="h-1 w-full bg-gradient-to-r from-[#857749] via-[#c4a96a] to-[#857749]" />

      {/* ── Main footer content ── */}
      <div className="mx-auto w-11/12 max-w-7xl py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-wide text-white">
              Paradise<span className="text-[#c4a96a]"> View</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#8a7e6a]">
              Experience world-class hospitality with breathtaking views,
              exceptional service, and unforgettable moments at every stay.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: <FaFacebookF size={14} />, label: "Facebook" },
                { icon: <FaInstagram size={14} />, label: "Instagram" },
                { icon: <FaTwitter size={14} />, label: "Twitter" },
                { icon: <FaTripadvisor size={15} />, label: "TripAdvisor" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3d3526] text-[#8a7e6a] transition hover:border-[#c4a96a] hover:text-[#c4a96a]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#c4a96a]">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-[#8a7e6a] transition hover:text-white"
                  >
                    <span className="inline-block h-px w-3 bg-[#3d3526] transition-all group-hover:w-5 group-hover:bg-[#c4a96a]" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#c4a96a]">
              Our Services
            </h3>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s}>
                  <span className="group flex items-center gap-2 text-sm text-[#8a7e6a] transition hover:text-white cursor-default">
                    <span className="inline-block h-px w-3 bg-[#3d3526] transition-all group-hover:w-5 group-hover:bg-[#c4a96a]" />
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact + Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#c4a96a]">
              Get in Touch
            </h3>

            <ul className="mt-5 space-y-4 text-sm text-[#8a7e6a]">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-0.5 shrink-0 text-[#c4a96a]" size={16} />
                <span>
                  123 Paradise Road,
                  <br />
                  Phnom Penh, Cambodia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="shrink-0 text-[#c4a96a]" size={16} />
                <span>+855 12 345 678</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="shrink-0 text-[#c4a96a]" size={16} />
                <span>info@paradiseview.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-[#c4a96a]">
              Newsletter
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEmail("");
              }}
              className="mt-3 flex"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full rounded-l-md border border-[#3d3526] bg-[#241f16] px-3 py-2 text-sm text-white placeholder:text-[#6b6050] outline-none focus:border-[#c4a96a] transition"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-r-md bg-[#857749] px-3 text-white transition hover:bg-[#c4a96a]"
              >
                <FiSend size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#2e2820]">
        <div className="mx-auto flex w-11/12 max-w-7xl flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-[#6b6050]">
            &copy; {new Date().getFullYear()} Paradise View. All rights
            reserved.
          </p>
          <ul className="flex flex-wrap gap-6 text-xs text-[#6b6050]">
            <li>
              <a href="#" className="transition hover:text-[#c4a96a]">
                Terms &amp; Conditions
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-[#c4a96a]">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="transition hover:text-[#c4a96a]">
                Cookies
              </a>
            </li>
          </ul>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
