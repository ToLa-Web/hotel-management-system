import { useState, useCallback } from 'react';
import { api } from '@/lib/authService';

export const useDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to safely count rooms for a hotel
  const countHotelRooms = (hotel) => {
    // Try different possible room count fields
    if (hotel.totalRooms && !isNaN(parseInt(hotel.totalRooms))) {
      return parseInt(hotel.totalRooms, 10);
    }
    if (hotel.total_rooms && !isNaN(parseInt(hotel.total_rooms))) {
      return parseInt(hotel.total_rooms, 10);
    }
    if (hotel.rooms && Array.isArray(hotel.rooms)) {
      return hotel.rooms.length;
    }
    if (hotel.room_count && !isNaN(parseInt(hotel.room_count))) {
      return parseInt(hotel.room_count, 10);
    }
    
    return 0;
  };

  // Helper function to calculate monthly revenue for a specific hotel
  const calculateHotelMonthlyRevenue = (hotelId, reservations) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return reservations.reduce((acc, res) => {
      try {
        // Only calculate revenue for this specific hotel
        if (res.hotel_id?.toString() !== hotelId?.toString()) {
          return acc;
        }

        const checkInValue = res.check_in_date;
        
        if (!checkInValue) return acc;
        
        const checkInDate = new Date(checkInValue);
        const isValidDate = !isNaN(checkInDate.getTime());
        
        if (!isValidDate) return acc;
        
        const resMonth = checkInDate.getMonth();
        const resYear = checkInDate.getFullYear();
        const isCurrentMonth = resMonth === currentMonth && resYear === currentYear;
        const validStatuses = ['confirmed', 'checked_in', 'checked_out'];
        const hasValidStatus = validStatuses.includes(res.status);
        
        if (isCurrentMonth && hasValidStatus) {
          const amount = parseFloat(res.total_amount) || 0;
          return acc + amount;
        }
        
        return acc;
      } catch (error) {
        return acc;
      }
    }, 0);
  };

  // Helper function to get detailed room statistics per hotel
  const getHotelRoomStats = (hotels, reservations) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return hotels.map(hotel => {
      const totalRooms = countHotelRooms(hotel);
      
      // Get reservations for this specific hotel
      const hotelReservations = reservations.filter(res => 
        res.hotel_id?.toString() === hotel.id?.toString()
      );

      // Count occupied rooms for this hotel
      const occupiedRooms = hotelReservations.filter(res => {
        const checkInValue = res.check_in_date;
        const checkOutValue = res.check_out_date;
        
        if (!checkInValue) return false;
        
        const checkIn = new Date(checkInValue);
        const checkOut = checkOutValue ? new Date(checkOutValue) : null;
        
        checkIn.setHours(0, 0, 0, 0);
        if (checkOut) checkOut.setHours(23, 59, 59, 999);
        
        const occupiedStatuses = ['confirmed', 'checked_in'];
        const hasOccupiedStatus = occupiedStatuses.includes(res.status);
        const isInDateRange = checkIn <= today && (!checkOut || checkOut >= today);
        
        return hasOccupiedStatus && isInDateRange;
      }).length;

      const occupancyRate = totalRooms > 0 
        ? parseFloat(((occupiedRooms / totalRooms) * 100).toFixed(2))
        : 0;

      // Calculate monthly revenue for this specific hotel
      const monthlyRevenue = calculateHotelMonthlyRevenue(hotel.id, reservations);

      return {
        hotelId: hotel.id,
        hotelName: hotel.name || `Hotel ${hotel.id}`,
        totalRooms,
        occupiedRooms,
        availableRooms: totalRooms - occupiedRooms,
        occupancyRate,
        activeReservations: hotelReservations.filter(res => 
          ['pending', 'confirmed', 'checked_in'].includes(res.status)
        ).length,
        monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)) // Format to 2 decimal places
      };
    });
  };

  const fetchOwnerData = useCallback(async (ownerId) => {
    setLoading(true);
    setError(null);
    
    try {
      const hotelsResponse = await api.get('/owner/hotels?per_page=100');
      // Backend already filters by authenticated owner, extract the paginated array
      const rawData = hotelsResponse.data?.data;
      const ownerHotels = Array.isArray(rawData?.data) ? rawData.data : (Array.isArray(rawData) ? rawData : []);
      setHotels(ownerHotels);

      const reservationsResponse = await api.get('/owner/reservations');
      const rawResData = reservationsResponse.data?.data;
      const ownerReservations = Array.isArray(rawResData?.data) ? rawResData.data : (Array.isArray(rawResData) ? rawResData : []);
      setReservations(ownerReservations);

      const totalHotels = ownerHotels.length;
      
      const totalRooms = ownerHotels.reduce((acc, hotel) => {
        const roomCount = countHotelRooms(hotel);
        return acc + roomCount;
      }, 0);

      const activeReservations = ownerReservations.filter(res => {
        return ['pending', 'confirmed', 'checked_in'].includes(res.status);
      }).length;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const totalMonthlyRevenue = ownerReservations.reduce((acc, res) => {
        try {
          const checkInValue = res.check_in_date;
          
          if (!checkInValue) return acc;
          
          const checkInDate = new Date(checkInValue);
          const isValidDate = !isNaN(checkInDate.getTime());
          
          if (!isValidDate) return acc;
          
          const resMonth = checkInDate.getMonth();
          const resYear = checkInDate.getFullYear();
          const isCurrentMonth = resMonth === currentMonth && resYear === currentYear;
          const validStatuses = ['confirmed', 'checked_in', 'checked_out'];
          const hasValidStatus = validStatuses.includes(res.status);
          
          if (isCurrentMonth && hasValidStatus) {
            const amount = parseFloat(res.total_amount) || 0;
            return acc + amount;
          }
          
          return acc;
        } catch (error) {
          return acc;
        }
      }, 0);

      // Calculate total occupied rooms across all hotels
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const totalOccupiedRooms = ownerReservations.filter(res => {
        const checkInValue = res.check_in_date;
        const checkOutValue = res.check_out_date;
        
        if (!checkInValue) return false;
        
        const checkIn = new Date(checkInValue);
        const checkOut = checkOutValue ? new Date(checkOutValue) : null;
        
        checkIn.setHours(0, 0, 0, 0);
        if (checkOut) checkOut.setHours(23, 59, 59, 999);
        
        const occupiedStatuses = ['confirmed', 'checked_in'];
        const hasOccupiedStatus = occupiedStatuses.includes(res.status);
        const isInDateRange = checkIn <= today && (!checkOut || checkOut >= today);
        
        return hasOccupiedStatus && isInDateRange;
      }).length;

      const avgOccupancy = totalRooms > 0 
        ? parseFloat(((totalOccupiedRooms / totalRooms) * 100).toFixed(2))
        : 0;

      // Get detailed stats per hotel
      const hotelStats = getHotelRoomStats(ownerHotels, ownerReservations);

      setStats({
        monthlyRevenue: parseFloat(totalMonthlyRevenue.toFixed(2)), // Renamed from monthlyRevenues for clarity
        avgOccupancy,
        totalHotels,
        activeReservations,
        totalRooms,
        totalOccupiedRooms,
        availableRooms: totalRooms - totalOccupiedRooms,
        totalReservations: ownerReservations.length,
        // Add detailed per-hotel statistics
        hotelStats,
        // Add summary by hotel for quick reference
        hotelSummary: hotelStats.reduce((acc, hotel) => {
          acc[hotel.hotelId] = {
            name: hotel.hotelName,
            rooms: hotel.totalRooms,
            occupied: hotel.occupiedRooms,
            occupancyRate: hotel.occupancyRate,
            monthlyRevenue: hotel.monthlyRevenue
          };
          return acc;
        }, {})
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response) {
        if (err.response.status === 401) {

        }
      }
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    hotels, 
    reservations, 
    stats, 
    loading, 
    error, 
    fetchOwnerData 
  };
};