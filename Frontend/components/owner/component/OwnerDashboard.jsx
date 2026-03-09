"use client"
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { useAuth } from '@/Context/AuthContext/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { api } from '@/lib/authService';
import CRUDModal from './dashboard/CRUDModal';
import Loading from '@app/loading';
import { 
  Calendar, 
  Building, 
  TrendingUp, 
  DollarSign,
  Eye,
  Plus,
  Edit,
  BarChart3,
  BedDouble,
  XCircle,
  AlertCircle
} from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
    case 'confirmed': return 'text-green-600 bg-green-100';
    case 'inactive':
    case 'cancelled': return 'text-red-600 bg-red-100';
    case 'maintenance':
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'checked_in': return 'text-blue-600 bg-blue-100';
    case 'checked_out': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const OwnerDashboard = () => {
  const { userData: user, loading: authLoading, token, permissions, hasPermission } = useAuth();
  const { hotels, stats, loading: dashboardLoading, fetchOwnerData, reservations, error: dashboardError } = useDashboard();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (user?.id && token && isInitialLoad) {
      fetchOwnerData(user.id).then(() => setIsInitialLoad(false)).catch(console.error);
    }
  }, [user, token, fetchOwnerData, isInitialLoad]);

  const handleCreateNew = (type) => {
    setModalType(type);
    setModalMode('create');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setModalMode('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (type, item) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const endpoint = type === 'hotel' ? `/owner/hotels/${item.uuid}` : `/reservations/${item.uuid}`;
      await api.delete(endpoint);
      fetchOwnerData(user.id);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      alert(`Failed to delete ${type}: ${msg}`);
    }
  };

  const handleSaveModal = async (formData) => {
    try {
      const isHotel = modalType === 'hotel';
      const endpoint = isHotel
        ? modalMode === 'create' ? '/owner/hotels' : `/owner/hotels/${selectedItem.uuid}`
        : modalMode === 'create' ? '/reservations' : `/reservations/${selectedItem.uuid}`;
      const method = modalMode === 'create' ? 'post' : 'put';

      if (formData instanceof FormData) {
        await api[method](endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        const dataToSend = { ...formData };
        if (isHotel) {
          if (dataToSend.latitude) dataToSend.latitude = parseFloat(dataToSend.latitude);
          if (dataToSend.longitude) dataToSend.longitude = parseFloat(dataToSend.longitude);
          if (Array.isArray(dataToSend.amenities)) dataToSend.amenities = JSON.stringify(dataToSend.amenities);
        } else {
          dataToSend.check_in = new Date(dataToSend.check_in).toISOString();
          dataToSend.check_out = new Date(dataToSend.check_out).toISOString();
          dataToSend.total_amount = parseFloat(dataToSend.total_amount);
        }
        await api[method](endpoint, dataToSend);
      }

      setIsModalOpen(false);
      fetchOwnerData(user.id);
    } catch (error) {
      if (error.response?.status === 422) {
        const errors = error.response.data?.errors || error.response.data?.message;
        const msg = typeof errors === 'object' ? Object.values(errors).flat().join('\n') : errors;
        alert(`Validation failed:\n${msg}`);
      } else {
        alert(`Failed to ${modalMode} ${modalType}: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const hotelFields = [
    { name: "name", label: "Hotel Name", type: "text", required: true, section: "Basic Information", placeholder: "e.g. Sunrise Hotel" },
    { name: "description", label: "Description", type: "textarea", required: true, placeholder: "Describe what makes your hotel special..." },
    { name: "address", label: "Street Address", type: "text", required: true, section: "Location", placeholder: "e.g. 100 Beach Road" },
    { name: "city", label: "City", type: "text", required: true, half: true, placeholder: "e.g. Miami" },
    { name: "state", label: "State / Province", type: "text", required: true, half: true, placeholder: "e.g. Florida" },
    { name: "country", label: "Country", type: "text", required: true, half: true, placeholder: "e.g. USA" },
    { name: "postal_code", label: "Postal Code", type: "text", required: true, half: true, placeholder: "e.g. 33101" },
    { name: "latitude", label: "Latitude", type: "number", required: false, step: "any", half: true, placeholder: "e.g. 25.7617" },
    { name: "longitude", label: "Longitude", type: "number", required: false, step: "any", half: true, placeholder: "e.g. -80.1918" },
    { name: "phone", label: "Phone", type: "tel", required: true, section: "Contact", half: true, placeholder: "e.g. 3051234567" },
    { name: "email", label: "Email", type: "email", required: true, half: true, placeholder: "e.g. info@hotel.com" },
    { name: "website", label: "Website", type: "url", required: false, placeholder: "e.g. https://hotel.com" },
    { name: "amenities", label: "Amenities", type: "multiselect", options: ["Pool", "Gym", "Spa", "Restaurant", "WiFi", "Parking", "Bar", "Room Service", "Airport Shuttle", "Pet Friendly"], required: false, section: "Features & Media" },
    { name: "images", label: "Hotel Images", type: "file", required: true, multiple: true, accept: "image/*" },
    { name: "status", label: "Status", type: "select", options: ["active", "inactive", "under_review"], required: true, section: "Settings" },
  ];

  const reservationFields = [
    { name: "guest_name", label: "Guest Name", type: "text", required: true },
    { name: "hotel_id", label: "Hotel", type: "select", options: Array.isArray(hotels) ? hotels.map(h => ({ value: h.uuid, label: h.name })) : [], required: true },
    { name: "room_number", label: "Room Number", type: "text", required: true },
    { name: "check_in", label: "Check-in Date", type: "date", required: true },
    { name: "check_out", label: "Check-out Date", type: "date", required: true },
    { name: "total_amount", label: "Total Amount", type: "number", required: true },
    { name: "status", label: "Status", type: "select", options: ["pending", "confirmed", "checked_in", "checked_out", "cancelled"], required: true },
    { name: "guest_email", label: "Guest Email", type: "email", required: false },
    { name: "guest_phone", label: "Guest Phone", type: "text", required: false },
  ];

  const currentFields = modalType === 'hotel' ? hotelFields : reservationFields;
  const loading = authLoading || dashboardLoading;

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen mt-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hotel Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user?.name}</p>
          </div>
          <Link
            href="/ChooseHotel"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Building className="w-4 h-4" />
            Hotel View
          </Link>
        </div>
        {dashboardError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{dashboardError}</span>
          </div>
        )}
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Dashboard
          </button>
          {hasPermission('reservation') && (
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'reservations' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Reservations
            </button>
          )}
          {hasPermission('properties') && (
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'properties' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building className="w-4 h-4 inline mr-2" />
              Properties
            </button>
          )}
          {hasPermission('reports') && (
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'reports' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Reports
            </button>
          )}
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats?.monthlyRevenue || 0}</p>
                    <p className="text-xs text-gray-500">This Month</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.avgOccupancy || 0}%</p>
                    <p className="text-xs text-gray-500">{stats?.totalOccupiedRooms || 0}/{stats?.totalRooms || 0} rooms</p>
                  </div>
                  <BedDouble className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalHotels || 0}</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <Building className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Reservations</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.activeReservations || 0}</p>
                    <p className="text-xs text-gray-500">Total: {stats?.totalReservations || 0}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Recent Hotels Table */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">Your Hotels</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rooms</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupancy</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(hotels) && hotels.slice(0, 5).map((hotel) => (
                      <tr key={hotel.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hotel.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hotel.city}, {hotel.country}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stats.hotelStats?.find(h => h.hotelId === hotel.id)?.totalRooms || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stats.hotelStats?.find(h => h.hotelId === hotel.id)?.occupancyRate || 0}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(hotel.status)}`}>{hotel.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEdit('hotel', hotel)} className="text-green-600 hover:text-green-900"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete('hotel', hotel)} className="text-red-600 hover:text-red-900"><XCircle className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Reservations */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">Recent Reservations</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(reservations) && reservations.slice(0, 5).map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.user?.name || reservation.guest_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {hotels.find(h => h.id === reservation.hotel_id)?.name || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.check_in_date ? format(parseISO(reservation.check_in_date), 'MMM d, yyyy') : '—'} – {reservation.check_out_date ? format(parseISO(reservation.check_out_date), 'MMM d, yyyy') : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${reservation.total_amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>{reservation.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && hasPermission('reservation') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Reservations Management</h2>
              <button onClick={() => handleCreateNew('reservation')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                New Reservation
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hotel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.isArray(reservations) && reservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{reservation.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.user?.name || reservation.guest_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {hotels.find(h => h.id === reservation.hotel_id)?.name || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.check_in_date ? format(parseISO(reservation.check_in_date), 'MMM d, yyyy') : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.check_out_date ? format(parseISO(reservation.check_out_date), 'MMM d, yyyy') : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${reservation.total_amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>{reservation.status}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button onClick={() => handleEdit('reservation', reservation)} className="text-green-600 hover:text-green-900"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete('reservation', reservation)} className="text-red-600 hover:text-red-900"><XCircle className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && hasPermission('properties') && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Properties Management</h2>
              <button onClick={() => handleCreateNew('hotel')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(hotels) && hotels.map((hotel) => {
                const hotelStat = stats.hotelStats?.find(h => h.hotelId === hotel.id);
                return (
                  <div key={hotel.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(hotel.status)}`}>{hotel.status}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{hotel.city}, {hotel.country}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Rooms:</span>
                          <span className="text-sm font-medium">{hotelStat?.totalRooms || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Occupancy:</span>
                          <span className="text-sm font-medium">{hotelStat?.occupancyRate || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Monthly Revenue:</span>
                          <span className="text-sm font-medium text-green-600">${hotelStat?.monthlyRevenue || 0}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between">
                        <button onClick={() => handleEdit('hotel', hotel)} className="text-blue-600 hover:text-blue-900 text-sm font-medium">Edit</button>
                        <button onClick={() => handleDelete('hotel', hotel)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && hasPermission('reports') && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">This Month:</span>
                    <span className="font-semibold">${stats?.monthlyRevenue || 0}</span>
                  </div>
                  {stats.hotelStats?.map(h => (
                    <div key={h.hotelId} className="flex justify-between">
                      <span className="text-gray-600">{h.hotelName}:</span>
                      <span className="font-semibold">${h.monthlyRevenue || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Occupancy Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Occupancy:</span>
                    <span className="font-semibold">{stats?.avgOccupancy || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Rooms:</span>
                    <span className="font-semibold">{stats?.availableRooms || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Properties:</span>
                    <span className="font-semibold">{stats?.totalHotels || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Permission Message */}
        {((activeTab === 'reservations' && !hasPermission('reservation')) ||
          (activeTab === 'properties' && !hasPermission('properties')) ||
          (activeTab === 'reports' && !hasPermission('reports'))) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Access Restricted</h3>
            <p className="text-yellow-700">You don&apos;t have permission to access this section.</p>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      <CRUDModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        type={modalType}
        data={selectedItem}
        onSave={handleSaveModal}
        fields={currentFields}
        hotels={hotels}
      />
    </div>
  );
};

export default OwnerDashboard;