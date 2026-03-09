'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@app/loading';
import { Calendar, MapPin, Users, BedDouble, DollarSign, Eye, Printer, X, CheckCircle, Clock, XCircle, Search, SlidersHorizontal } from 'lucide-react';

export default function ReservationsPage() {
  const LARAVEL_API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL;
  const searchParams = useSearchParams();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
    fetchReservations();
  }, [searchParams]);

  const fetchReservations = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication required - please login');
      if (!LARAVEL_API_URL) throw new Error('API URL not configured');

      const response = await fetch(`${LARAVEL_API_URL}/api/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      let reservationsData = [];
      if (data?.data && Array.isArray(data.data.data)) {
        reservationsData = data.data.data;
      } else if (Array.isArray(data.data)) {
        reservationsData = data.data;
      } else if (Array.isArray(data)) {
        reservationsData = data;
      } else if (Array.isArray(data?.reservations)) {
        reservationsData = data.reservations;
      }
      setReservations(reservationsData);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError(error.message || 'Failed to load reservations');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    if (!status) return { color: 'bg-gray-50 text-gray-600 border-gray-200', icon: Clock, label: 'Unknown' };
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Confirmed' };
      case 'pending':
        return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock, label: 'Pending' };
      case 'cancelled':
        return { color: 'bg-red-50 text-red-600 border-red-200', icon: XCircle, label: 'Cancelled' };
      case 'completed':
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle, label: 'Completed' };
      default:
        return { color: 'bg-gray-50 text-gray-600 border-gray-200', icon: Clock, label: status };
    }
  };

  const filterReservations = (list) => {
    if (!Array.isArray(list)) return [];
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return list.filter(r => r.check_in_date && new Date(r.check_in_date) > now && r.status?.toLowerCase() !== 'cancelled');
      case 'past':
        return list.filter(r => r.check_out_date && new Date(r.check_out_date) < now);
      case 'cancelled':
        return list.filter(r => r.status?.toLowerCase() === 'cancelled');
      default:
        return list;
    }
  };

  const cancelReservation = async (reservationId) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${LARAVEL_API_URL}/api/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      if (response.ok) {
        fetchReservations();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel reservation');
      }
    } catch (error) {
      alert(error.message || 'Failed to cancel reservation');
    }
  };

  const getFirstImage = (images) => {
    try {
      if (Array.isArray(images)) return images[0];
      if (typeof images === 'string') {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) return parsed[0];
      }
      return null;
    } catch { return null; }
  };

  const filteredReservations = filterReservations(reservations);
  const counts = {
    all: reservations.length,
    upcoming: filterReservations(reservations.filter(r => { const now = new Date(); return r.check_in_date && new Date(r.check_in_date) > now && r.status?.toLowerCase() !== 'cancelled'; })).length,
    past: reservations.filter(r => r.check_out_date && new Date(r.check_out_date) < new Date()).length,
    cancelled: reservations.filter(r => r.status?.toLowerCase() === 'cancelled').length,
  };
  // Recalculate properly
  const now = new Date();
  const upcomingCount = reservations.filter(r => r.check_in_date && new Date(r.check_in_date) > now && r.status?.toLowerCase() !== 'cancelled').length;
  const pastCount = reservations.filter(r => r.check_out_date && new Date(r.check_out_date) < now).length;
  const cancelledCount = reservations.filter(r => r.status?.toLowerCase() === 'cancelled').length;

  if (loading) return <Loading />;

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Reservations</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={fetchReservations} className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Success Toast */}
        {showSuccess && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in slide-in-from-top">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-emerald-800 font-medium">Payment successful! Your reservation has been confirmed.</p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">My Reservations</h1>
            <p className="mt-1 text-gray-500">{reservations.length} total booking{reservations.length !== 1 ? 's' : ''}</p>
          </div>
          <Link 
            href="/hotels"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all font-semibold text-sm shadow-sm shadow-blue-200"
          >
            <Search className="w-4 h-4" />
            Book New Hotel
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100/80 rounded-xl mb-8 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: reservations.length },
            { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
            { key: 'past', label: 'Past', count: pastCount },
            { key: 'cancelled', label: 'Cancelled', count: cancelledCount },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                filter === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs ${filter === tab.key ? 'text-blue-600' : 'text-gray-400'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredReservations.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <BedDouble className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {filter === 'all' ? 'No reservations yet' : `No ${filter} reservations`}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {reservations.length === 0 
                ? "You haven't made any hotel reservations yet. Start exploring!"
                : `You have ${reservations.length} total reservations, but none match the "${filter}" filter.`
              }
            </p>
            <Link href="/hotels" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all font-semibold">
              <Search className="w-4 h-4" /> Browse Hotels
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map(reservation => {
              const firstImage = getFirstImage(reservation.hotel?.images);
              const statusConfig = getStatusConfig(reservation.status);
              const StatusIcon = statusConfig.icon;
              const nights = reservation.nights || 1;
              const isUpcoming = reservation.check_in_date && new Date(reservation.check_in_date) > new Date();
              const canCancel = reservation.status?.toLowerCase() === 'confirmed' && isUpcoming;

              return (
                <div 
                  key={reservation.uuid} 
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Hotel Image — left side */}
                    <div className="relative md:w-64 h-48 md:h-auto flex-shrink-0">
                      {firstImage ? (
                        <img src={firstImage} alt={reservation.hotel?.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <BedDouble className="w-12 h-12 text-blue-300" />
                        </div>
                      )}
                      {/* Status pill on image */}
                      <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Content — right side */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col">
                      {/* Top: hotel name + total */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {reservation.hotel?.name || 'Unknown Hotel'}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{reservation.hotel?.city || ''}{reservation.hotel?.state ? `, ${reservation.hotel.state}` : ''}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-gray-900">${reservation.total_amount}</p>
                          <p className="text-xs text-gray-400">{nights} night{nights > 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      {/* Info chips */}
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {reservation.check_in_date 
                              ? new Date(reservation.check_in_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : 'N/A'}
                            {' — '}
                            {reservation.check_out_date 
                              ? new Date(reservation.check_out_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BedDouble className="w-4 h-4 text-gray-400" />
                          <span>{reservation.room?.room_type?.name || 'Room'} · #{reservation.room?.room_number || '—'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>
                            {reservation.adults || 0} adult{(reservation.adults || 0) !== 1 ? 's' : ''}
                            {(reservation.children || 0) > 0 && `, ${reservation.children} child${reservation.children !== 1 ? 'ren' : ''}`}
                          </span>
                        </div>
                      </div>

                      {/* Confirmation code */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm mb-4 self-start">
                        <span className="text-gray-400">Code:</span>
                        <span className="font-mono font-semibold text-gray-700">{reservation.reservation_code || 'N/A'}</span>
                      </div>

                      {/* Special Requests */}
                      {reservation.special_requests && (
                        <p className="text-sm text-gray-500 italic mb-4 border-l-2 border-amber-300 pl-3">
                          &ldquo;{reservation.special_requests}&rdquo;
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                        <Link 
                          href={`/reservations/${reservation.uuid}`}
                          className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all text-sm font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Details
                        </Link>
                        
                        {canCancel && (
                          <button 
                            onClick={() => cancelReservation(reservation.uuid)}
                            className="inline-flex items-center gap-1.5 border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 active:scale-[0.98] transition-all text-sm font-medium"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </button>
                        )}

                        {reservation.status?.toLowerCase() === 'confirmed' && (
                          <button 
                            onClick={() => window.open(`/reservations/${reservation.uuid}?print=true`, '_blank')}
                            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all text-sm font-medium"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Print
                          </button>
                        )}

                        {reservation.status?.toLowerCase() === 'pending' && reservation.payment_status?.toLowerCase() === 'pending' && (
                          <Link 
                            href={`/payment/${reservation.uuid}`}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 active:scale-[0.98] transition-all text-sm font-medium"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            Pay Now
                          </Link>
                        )}
                      </div>
                    </div>
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