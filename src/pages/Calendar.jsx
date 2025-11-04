import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarCheck, FaClock } from 'react-icons/fa';
import { format, addDays, isWeekend, startOfWeek, addWeeks, parseISO } from 'date-fns';
import { validateProfessionalEmail } from '../utils/emailValidation';

const Calendar = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    meetingType: 'Mentorship',
    notes: '',
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await fetch('/api/calendar/slots');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setSlots(data.slots || []);
      } else {
        console.error('Failed to fetch slots:', data.error);
        setSlots([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      // On error, show empty state instead of crashing
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const groupSlotsByDate = (slots) => {
    const grouped = {};
    slots.forEach(slot => {
      const date = slot.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    return grouped;
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setBookingForm(prev => ({
      ...prev,
      email: prev.email || '', // Keep existing email if available
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    const emailValidation = validateProfessionalEmail(bookingForm.email);
    if (!emailValidation.valid) {
      alert(emailValidation.message);
      return;
    }

    if (!bookingForm.name.trim()) {
      alert('Please enter your name.');
      return;
    }

    setIsBooking(true);

    try {
      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          ...bookingForm,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingSuccess(true);
        // Refresh slots to update availability
        setTimeout(() => {
          fetchSlots();
          setSelectedSlot(null);
          setBookingForm({ name: '', email: '', meetingType: 'Mentorship', notes: '' });
        }, 2000);
      } else {
        alert(data.error || 'Failed to book the slot. It may have been taken by someone else.');
        fetchSlots(); // Refresh to get updated availability
      }
    } catch (error) {
      alert('Sorry, there was an issue booking the slot. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const groupedSlots = groupSlotsByDate(slots);
  const sortedDates = Object.keys(groupedSlots).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-300 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading available time slots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300">
      {/* Background gradient */}
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4 sm:px-8 md:px-16 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <FaArrowLeft /> Back to Portfolio
          </button>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent text-center mb-4">
            Schedule a Meeting
          </h1>
          <p className="text-center text-neutral-400">
            Select an available time slot to book a meeting with Zohaib
          </p>
        </motion.div>

        {bookingSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 p-8 rounded-3xl shadow-lg text-center"
          >
            <FaCalendarCheck className="text-green-400 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-neutral-300 mb-4">
              Your meeting has been scheduled. You'll receive a confirmation email shortly.
            </p>
            <button
              onClick={() => {
                setBookingSuccess(false);
                setSelectedSlot(null);
                fetchSlots();
              }}
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Book Another Meeting
            </button>
          </motion.div>
        ) : selectedSlot ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 p-6 sm:p-8 rounded-3xl shadow-lg">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
                Booking Details
              </h2>
              <div className="mb-6 p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-neutral-400 text-sm">Selected Time</p>
                <p className="text-white font-semibold">
                  {format(parseISO(selectedSlot.datetime), 'EEEE, MMMM d, yyyy')} at{' '}
                  {format(parseISO(selectedSlot.datetime), 'h:mm a')}
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Professional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="name@company.com"
                  />
                  <p className="text-xs text-neutral-400 mt-1">
                    Please use a professional email address
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Meeting Type *
                  </label>
                  <select
                    required
                    value={bookingForm.meetingType}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, meetingType: e.target.value }))}
                    className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="Mentorship">Mentorship</option>
                    <option value="Career Discussion">Career Discussion</option>
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="flex-1 px-6 py-3 bg-neutral-800 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBooking}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isBooking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Booking...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {sortedDates.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 rounded-3xl">
                <FaClock className="text-5xl text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400 text-lg">
                  No available time slots at the moment. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedDates.map((date) => (
                  <motion.div
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 p-6 rounded-3xl shadow-lg"
                  >
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
                      {format(parseISO(date), 'EEEE, MMMM d')}
                    </h3>
                    <div className="space-y-2">
                      {groupedSlots[date]
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => handleSlotSelect(slot)}
                            disabled={!slot.available}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                              slot.available
                                ? 'bg-neutral-800 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 border border-neutral-700 hover:border-pink-500/50 cursor-pointer'
                                : 'bg-neutral-900/50 text-neutral-600 cursor-not-allowed border border-neutral-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{slot.time}</span>
                              {!slot.available && (
                                <span className="text-xs text-neutral-600">Booked</span>
                              )}
                            </div>
                          </button>
                        ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;

