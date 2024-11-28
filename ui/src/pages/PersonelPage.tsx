import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import API from '../services/api';

const PersonelPage: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [attendanceInfo, setAttendanceInfo] = useState<{
    message: string;
    lateMinutes: number | null;
    remainingLeaves: number | null;
  }>({
    message: '',
    lateMinutes: null,
    remainingLeaves: null,
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAttendanceInfo = async () => {
    try {
      const response = await API.get('/attendance/summary/');
      setAttendanceInfo({
        message: response.data.message || '',
        lateMinutes: response.data.lateMinutes || 0,
        remainingLeaves: response.data.remainingLeaves || 0,
      });
      setIsCheckedIn(response.data.isCheckedIn || false);
      setIsCheckedOut(response.data.isCheckedOut || false);
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await API.post('/attendance/', {
        type: 'check-in',
      });
      alert('Check-in successful!');
      setIsCheckedIn(true);
      setIsCheckedOut(false);
      await fetchAttendanceInfo(); // Summary bilgilerini güncelle
    } catch (error: any) {
      setMessage(
        error.response?.data?.error || 'An error occurred during check-in.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await API.post('/attendance/', {
        type: 'check-out',
      });
      alert('Check-out successful!');
      setIsCheckedOut(true);
      await fetchAttendanceInfo(); // Summary bilgilerini güncelle
    } catch (error: any) {
      setMessage(
        error.response?.data?.error || 'An error occurred during check-out.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceInfo();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-grow flex flex-col">
        <Header title="Employee Dashboard" />
        <div className="p-6 flex-grow">
          <h1 className="text-2xl font-bold mb-4">Hello, Welcome!</h1>
          <div className="mb-4">
            <p>{attendanceInfo.message}</p>
            {attendanceInfo.lateMinutes !== null && (
              <p>Bugün işe {attendanceInfo.lateMinutes} dakika geç kaldınız.</p>
            )}
            {attendanceInfo.remainingLeaves !== null && (
              <p>
                Kalan izin günleriniz: {attendanceInfo.remainingLeaves} gün.
              </p>
            )}
          </div>
          <div className="space-y-4">
            {!isCheckedIn && !isCheckedOut && (
              <button
                type="button"
                onClick={handleCheckIn}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {loading ? 'Checking In...' : 'Check In'}
              </button>
            )}
            {isCheckedIn && !isCheckedOut && (
              <button
                type="button"
                onClick={handleCheckOut}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {loading ? 'Checking Out...' : 'Check Out'}
              </button>
            )}
            {isCheckedIn && isCheckedOut && (
              <p className="text-gray-700 font-bold">
                You have already checked in and checked out for the day.
              </p>
            )}
          </div>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default PersonelPage;
