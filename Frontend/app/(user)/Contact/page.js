import BannerContact from "@components/user/Banners/BannerContact";
import Footer from "@components/user/layout/Footer";
import Header from "@components/user/layout/Header";
import PageTransition from "@components/motion/PageTransition";
import React from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

const contactCards = [
  {
    icon: FaMapMarkerAlt,
    title: "Visit Us",
    lines: ["123 Paradise View Drive", "Phnom Penh, Cambodia"],
  },
  {
    icon: FaPhone,
    title: "Call Us",
    lines: ["+855 12 345 678", "+855 23 456 789"],
  },
  {
    icon: FaEnvelope,
    title: "Email Us",
    lines: ["info@paradiseview.com", "reservations@paradiseview.com"],
  },
  {
    icon: FaClock,
    title: "Working Hours",
    lines: ["Mon – Fri: 8AM – 10PM", "Sat – Sun: 9AM – 11PM"],
  },
];

const page = () => {
  return (
    <PageTransition>
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <BannerContact />

      {/* ── Contact Info Cards ── */}
      <section className="py-20 bg-white">
        <div className="w-10/12 max-w-6xl mx-auto flex flex-col gap-14">
          {/* Section header */}
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#857749]">
              Reach Out
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How to <span className="text-[#857749]">Find Us</span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
              Whether you prefer a call, email, or visit — we are always happy
              to hear from you.
            </p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactCards.map((card, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-4 p-7 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[#857749]/10 flex items-center justify-center">
                  <card.icon className="text-[#857749]" size={22} />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  {card.title}
                </h3>
                <div className="flex flex-col gap-0.5">
                  {card.lines.map((line, j) => (
                    <span key={j} className="text-sm text-gray-500">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form + Map ── */}
      <section className="py-20 bg-gray-50">
        <div className="w-10/12 max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
          {/* Form side */}
          <div className="w-full lg:w-7/12 bg-white rounded-3xl shadow-sm p-8 md:p-12 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#857749]">
                Send a Message
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                We&apos;d Love to{" "}
                <span className="text-[#857749]">Hear From You</span>
              </h3>
            </div>

            <form className="flex flex-col gap-5">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#857749] focus:ring-1 focus:ring-[#857749]/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#857749] focus:ring-1 focus:ring-[#857749]/20 transition-all"
                  />
                </div>
              </div>

              {/* Email + Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#857749] focus:ring-1 focus:ring-[#857749]/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+855 12 345 678"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#857749] focus:ring-1 focus:ring-[#857749]/20 transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Subject
                </label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:border-[#857749] focus:ring-1 focus:ring-[#857749]/20 transition-all">
                  <option value="">Select a topic</option>
                  <option value="reservation">Reservation Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  rows="5"
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-[#857749] focus:ring-1 focus:ring-[#857749]/20 transition-all"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full sm:w-auto self-start px-8 py-3.5 bg-[#857749] hover:bg-[#6d6139] text-white font-semibold rounded-xl transition-all duration-300 text-sm shadow-lg shadow-[#857749]/20 active:scale-95"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Map / Visual side */}
          <div className="w-full lg:w-5/12 flex flex-col gap-6">
            {/* Map placeholder */}
            <div className="flex-1 min-h-[300px] bg-gray-200 rounded-3xl overflow-hidden shadow-sm relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125355.06990478817!2d104.82361905!3d11.568270449999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6be3%3A0x9c010ee85ab525bb!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1709000000000"
                className="w-full h-full absolute inset-0"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hotel Location"
              />
            </div>

            {/* Quick contact card */}
            <div className="bg-[#857749] rounded-3xl p-8 flex flex-col gap-4 text-white">
              <h4 className="text-lg font-bold">Need immediate help?</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Our front desk team is available 24/7 to assist with
                reservations, special requests, and any questions.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                  <FaPhone className="text-white" size={16} />
                </div>
                <div>
                  <span className="text-xs text-white/60 block">
                    Call us directly
                  </span>
                  <span className="text-base font-semibold">
                    +855 12 345 678
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-20 bg-white">
        <div className="w-10/12 max-w-4xl mx-auto flex flex-col gap-14">
          <div className="text-center flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#857749]">
              Common Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently <span className="text-[#857749]">Asked</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: "What are the check-in and check-out times?",
                a: "Check-in is from 2:00 PM and check-out is until 12:00 PM. Early check-in and late check-out can be arranged upon request, subject to availability.",
              },
              {
                q: "Do you offer airport shuttle services?",
                a: "Yes, we provide complimentary airport pickup for guests staying 3 nights or more. For other guests, shuttle service is available at a nominal fee.",
              },
              {
                q: "Is there parking available at the hotel?",
                a: "We offer free on-site parking for all guests, including covered and valet parking options.",
              },
              {
                q: "Can I make special requests for my room?",
                a: "Absolutely! We accommodate special requests including extra pillows, dietary needs, room decoration for celebrations, and accessibility requirements.",
              },
              {
                q: "What is your cancellation policy?",
                a: "Free cancellation up to 48 hours before check-in. Cancellations within 48 hours may be subject to a one-night charge.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-gray-50 rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors">
                  {faq.q}
                  <svg
                    className="w-5 h-5 text-[#857749] shrink-0 ml-4 group-open:rotate-180 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
    </PageTransition>
  );
};

export default page;