import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { format, parseISO, startOfWeek, addWeeks, addDays, isSameDay, isSameMonth, startOfMonth, endOfMonth, eachWeekOfInterval, getDay } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

const Calendar = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    meetingType: 'Mentorship',
    notes: '',
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [userTimezone, setUserTimezone] = useState('');
  const [expandedDates, setExpandedDates] = useState(new Set());

  useEffect(() => {
    // Detect user's timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(tz);
    
    fetchSlots();
    
    // Check for pre-filled data from chatbot
    try {
      const prefillData = sessionStorage.getItem('bookingPrefills');
      if (prefillData) {
        const data = JSON.parse(prefillData);
        setBookingForm(prev => ({
          ...prev,
          name: data.name || prev.name,
          email: data.email || prev.email,
          meetingType: data.meetingType || prev.meetingType,
        }));
        sessionStorage.removeItem('bookingPrefills');
      }
    } catch (error) {
      console.error('Error reading prefill data:', error);
    }
  }, []);

  const fetchSlots = async (skipAutoGenerate = false) => {
    try {
      const response = await fetch('/api/calendar/slots');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setSlots(data.slots || []);
        
        // Auto-generate slots if none exist (silent, no user interaction)
        if (!skipAutoGenerate && data.slots && data.slots.length === 0) {
          await generateSlots();
        }
      } else {
        console.error('Failed to fetch slots:', data.error);
        setSlots([]);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSlots = async () => {
    try {
      const response = await fetch('/api/calendar/generate-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          await fetchSlots(true);
        }
      }
    } catch (error) {
      console.error('Error generating slots:', error);
    }
  };

  const getSlotsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return slots
      .filter(slot => {
        // Convert UTC datetime to user's timezone and check if date matches
        if (!slot.datetime) return false;
        const slotDate = parseISO(slot.datetime);
        const userLocalDate = toZonedTime(slotDate, userTimezone || 'UTC');
        return format(userLocalDate, 'yyyy-MM-dd') === dateStr && slot.available;
      })
      .sort((a, b) => {
        // Sort by time in user's timezone
        const timeA = parseISO(a.datetime);
        const timeB = parseISO(b.datetime);
        const userTimeA = toZonedTime(timeA, userTimezone || 'UTC');
        const userTimeB = toZonedTime(timeB, userTimezone || 'UTC');
        return userTimeA.getTime() - userTimeB.getTime();
      });
  };

  const formatSlotTime = (slot) => {
    // Convert UTC datetime to user's timezone for display
    if (!slot.datetime) return slot.time || 'N/A';
    const slotDate = parseISO(slot.datetime);
    // toZonedTime converts UTC datetime to user's local timezone
    const userLocalTime = toZonedTime(slotDate, userTimezone || 'UTC');
    return format(userLocalTime, 'h:mm a');
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setBookingForm(prev => ({
      ...prev,
      email: prev.email || '',
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // Basic email format validation (any email is fine for meetings)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingForm.email)) {
      alert('Please enter a valid email address.');
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
        // Store booking details for display and Google Calendar
        setBookingDetails({
          ...bookingForm,
          date: data.booking.date,
          time: data.booking.time,
          datetime: data.booking.datetime,
          meetingType: data.booking.meetingType,
          zoomLink: data.booking.zoomLink || '', // Include zoom link from booking response
        });
        setBookingSuccess(true);
        setTimeout(() => {
          fetchSlots(true);
          setSelectedSlot(null);
          setBookingForm({ name: '', email: '', meetingType: 'Mentorship', notes: '' });
        }, 8000); // Increased timeout to give user time to see spam reminder and add to calendar
      } else {
        alert(data.error || 'This slot has already been booked. Please select another time.');
        fetchSlots(true);
      }
    } catch (error) {
      alert('Sorry, there was an issue booking the slot. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addDays(startOfMonth(currentMonth), 32));
  };

  const prevMonth = () => {
    setCurrentMonth(addDays(startOfMonth(currentMonth), -1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-300 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300">
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      </div>

      <div className="container mx-auto px-4 sm:px-8 md:px-16 py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent text-center mb-4">
            Schedule a Meeting
          </h1>
          <p className="text-center text-neutral-400">
            Select an available time slot to book a meeting with Zohaib
          </p>
          {userTimezone && (
            <p className="text-center text-neutral-500 text-sm mt-2">
              Times shown in your timezone: {userTimezone}
            </p>
          )}
        </motion.div>

        {bookingSuccess && bookingDetails ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 p-8 rounded-3xl shadow-lg"
          >
            <div className="text-center mb-6">
              <FaCalendarCheck className="text-green-400 text-5xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
              <div className="bg-neutral-800/50 p-4 rounded-lg mb-4 text-left">
                <p className="text-neutral-400 text-sm mb-1">Meeting Details</p>
                <p className="text-white font-semibold">
                  {format(toZonedTime(parseISO(bookingDetails.datetime), userTimezone || 'UTC'), 'EEEE, MMMM d, yyyy')} at {format(toZonedTime(parseISO(bookingDetails.datetime), userTimezone || 'UTC'), 'h:mm a')}
                </p>
                <p className="text-neutral-400 text-sm mt-1">{bookingDetails.meetingType}</p>
              </div>
            </div>

            {/* Google Calendar Reminder */}
            <div className="bg-blue-500/20 border-2 border-blue-500/50 rounded-lg p-4 mb-6">
              <p className="text-blue-200 font-semibold text-lg mb-2">📅 Add to Your Calendar</p>
              <p className="text-blue-100 text-sm">
                Don't forget to add this meeting to your Google Calendar using the button below. 
                This will help you remember the meeting time and includes all the meeting details.
              </p>
            </div>

            {/* Google Calendar Button */}
            {(() => {
              // Convert datetime to Google Calendar format (YYYYMMDDTHHmmssZ in UTC)
              const startDate = parseISO(bookingDetails.datetime);
              const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes later
              
              const formatGoogleDate = (date) => {
                return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
              };
              
              // Build Google Calendar description with Zoom link
              let calendarDescription = `Meeting Type: ${bookingDetails.meetingType}`;
              if (bookingDetails.notes) {
                calendarDescription += `\n\nNotes: ${bookingDetails.notes}`;
              }
              if (bookingDetails.zoomLink) {
                calendarDescription += `\n\nZoom Link: ${bookingDetails.zoomLink}`;
              }
              calendarDescription += `\n\nContact: zohaib.s.cheema9@gmail.com`;
              
              const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
              googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
              googleCalendarUrl.searchParams.set('text', `Meeting with Zohaib - ${bookingDetails.meetingType}`);
              googleCalendarUrl.searchParams.set('dates', `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`);
              googleCalendarUrl.searchParams.set('details', calendarDescription);
              googleCalendarUrl.searchParams.set('location', bookingDetails.zoomLink || 'Zoom - Link will be sent via email');
              
              return (
                <div className="mb-6">
                  <a
                    href={googleCalendarUrl.toString()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
                    </svg>
                    Add to Google Calendar
                  </a>
                </div>
              );
            })()}

            <button
              onClick={() => {
                setBookingSuccess(false);
                setBookingDetails(null);
                setSelectedSlot(null);
                fetchSlots(true);
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
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
                  {format(toZonedTime(parseISO(selectedSlot.datetime), userTimezone || 'UTC'), 'EEEE, MMMM d, yyyy')} at {formatSlotTime(selectedSlot)}
                </p>
                <p className="text-neutral-500 text-xs mt-1">
                  {userTimezone ? `(${userTimezone})` : ''}
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
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Meeting Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.meetingType}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, meetingType: e.target.value }))}
                    className="w-full bg-neutral-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Mentorship, Career Discussion, Interview Prep"
                  />
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
            {/* Calendar Header */}
            <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 p-6 rounded-3xl shadow-lg mb-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <FaChevronLeft className="text-neutral-400" />
                </button>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <FaChevronRight className="text-neutral-400" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-neutral-400 pb-2">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="contents">
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                      const date = addDays(week, dayIdx);
                      const isCurrentMonth = isSameMonth(date, currentMonth);
                      const isToday = isSameDay(date, new Date());
                      const dateSlots = getSlotsForDate(date);

                      return (
                        <div
                          key={dayIdx}
                          className={`min-h-[120px] p-2 border border-neutral-800 rounded-lg ${
                            isCurrentMonth ? 'bg-neutral-900/30' : 'bg-neutral-950/50'
                          } ${isToday ? 'ring-2 ring-pink-500/50' : ''}`}
                        >
                          <div className={`text-sm font-medium mb-1 ${
                            isCurrentMonth ? 'text-neutral-300' : 'text-neutral-600'
                          } ${isToday ? 'text-pink-400' : ''}`}>
                            {format(date, 'd')}
                          </div>
                          <div className="space-y-1">
                            {dateSlots.length === 0 ? (
                              <div className="text-xs text-neutral-600">No slots</div>
                            ) : (
                              <>
                                {dateSlots.slice(0, expandedDates.has(format(date, 'yyyy-MM-dd')) ? dateSlots.length : 2).map((slot) => (
                                  <button
                                    key={slot.id}
                                    onClick={() => handleSlotSelect(slot)}
                                    className="w-full text-xs px-2 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 rounded text-neutral-200 hover:text-white transition-all text-left"
                                  >
                                    {formatSlotTime(slot)}
                                  </button>
                                ))}
                                {dateSlots.length > 2 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const dateKey = format(date, 'yyyy-MM-dd');
                                      setExpandedDates(prev => {
                                        const newSet = new Set(prev);
                                        if (newSet.has(dateKey)) {
                                          newSet.delete(dateKey);
                                        } else {
                                          newSet.add(dateKey);
                                        }
                                        return newSet;
                                      });
                                    }}
                                    className="w-full text-xs px-2 py-1 text-neutral-400 hover:text-neutral-200 transition-colors text-left"
                                  >
                                    {expandedDates.has(format(date, 'yyyy-MM-dd')) 
                                      ? 'Show less' 
                                      : `+${dateSlots.length - 2} more`}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed View for Selected Date */}
            {slots.length > 0 && (
              <div className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/50 p-6 rounded-3xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-transparent">
                  Available Time Slots
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {slots
                    .filter(slot => slot.available)
                    .sort((a, b) => {
                      const dateCompare = a.date.localeCompare(b.date);
                      if (dateCompare !== 0) return dateCompare;
                      return a.time.localeCompare(b.time);
                    })
                    .map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot)}
                        className="px-4 py-3 bg-neutral-800 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20 border border-neutral-700 hover:border-pink-500/50 rounded-lg transition-all text-left"
                      >
                        <div className="text-sm font-medium text-white">
                          {format(toZonedTime(parseISO(slot.datetime), userTimezone || 'UTC'), 'MMM d')}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {formatSlotTime(slot)}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
