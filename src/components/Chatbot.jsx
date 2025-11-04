import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaCalendar, FaFilePdf, FaComment } from 'react-icons/fa';
import { validateProfessionalEmail } from '../utils/emailValidation';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationState, setConversationState] = useState('idle'); // idle, resume_request, meeting_request, feedback
  const [collectedData, setCollectedData] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage('bot', "Hi! I'm here to help you connect with Zohaib. How can I assist you today? You can request his resume or schedule a meeting.");
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const addMessage = (sender, text, options = {}) => {
    setMessages(prev => [...prev, { sender, text, id: Date.now(), ...options }]);
  };

  const handleResumeRequest = () => {
    setConversationState('resume_request');
    addMessage('bot', "I'd be happy to send you Zohaib's resume. To make sure it reaches the right place, I'll need your professional email address. What email should I use?");
  };

  const handleMeetingRequest = () => {
    setConversationState('meeting_request');
    addMessage('bot', "Great! I can help you schedule a meeting with Zohaib. Are you looking for a mentorship session, or something else?");
    addMessage('bot', "You can choose: Mentorship, Career Discussion, Interview Prep, or Other.", { isOptions: true });
  };

  const handleMeetingTypeSelected = (type) => {
    setCollectedData(prev => ({ ...prev, meetingType: type }));
    setConversationState('meeting_email');
    addMessage('user', type);
    addMessage('bot', `Perfect! To send you the calendar link, I'll need your professional email. What email should I use?`);
  };

  const handleResumeEmailSubmit = async (email) => {
    const validation = validateProfessionalEmail(email);
    
    if (!validation.valid) {
      addMessage('bot', validation.message);
      return;
    }

    addMessage('user', email);
    addMessage('bot', `Perfect! I'll send the resume to ${email}. It should arrive shortly in your inbox.`, { isProcessing: true });

    try {
      const response = await fetch('/api/resume/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send resume');
      }

      const data = await response.json();

      if (data.success) {
        addMessage('bot', 'Resume request submitted! I\'ve sent a notification to Zohaib. You\'ll receive an email once it\'s approved. Is there anything else I can help you with?');
        setConversationState('idle');
        setCollectedData({});
      } else {
        addMessage('bot', data.error || 'Sorry, there was an issue sending the resume. Please try again later or contact Zohaib directly at zohaib.s.cheema9@gmail.com');
      }
    } catch (error) {
      console.error('Resume request error:', error);
      addMessage('bot', error.message || 'Sorry, there was an issue sending the resume. Please try again later or contact Zohaib directly at zohaib.s.cheema9@gmail.com');
    }
  };

  const handleMeetingEmailSubmit = async (email) => {
    const validation = validateProfessionalEmail(email);
    
    if (!validation.valid) {
      addMessage('bot', validation.message);
      return;
    }

    setCollectedData(prev => ({ ...prev, email }));
    addMessage('user', email);
    addMessage('bot', 'Perfect! Let me open the scheduling calendar for you. You can see available time slots and book a meeting.');
    
    // Redirect to calendar page
    setTimeout(() => {
      window.location.href = '/calendar';
    }, 1500);
  };

  const handleFeedbackClick = () => {
    setIsOpen(false);
    // Open feedback modal or redirect to feedback page
    // For now, we'll show an alert - can be replaced with a modal component
    const feedbackUrl = '/feedback';
    window.location.href = feedbackUrl;
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    if (conversationState === 'resume_request') {
      handleResumeEmailSubmit(userMessage);
    } else if (conversationState === 'meeting_email') {
      handleMeetingEmailSubmit(userMessage);
    } else if (conversationState === 'meeting_request') {
      // Handle meeting type selection
      const type = userMessage.toLowerCase();
      if (type.includes('mentorship') || type.includes('mentor')) {
        handleMeetingTypeSelected('Mentorship');
      } else if (type.includes('career')) {
        handleMeetingTypeSelected('Career Discussion');
      } else if (type.includes('interview')) {
        handleMeetingTypeSelected('Interview Prep');
      } else {
        handleMeetingTypeSelected('Other');
      }
    } else {
      // Handle general queries
      addMessage('user', userMessage);
      if (userMessage.toLowerCase().includes('resume') || userMessage.toLowerCase().includes('cv')) {
        handleResumeRequest();
      } else if (userMessage.toLowerCase().includes('meeting') || userMessage.toLowerCase().includes('schedule') || userMessage.toLowerCase().includes('book')) {
        handleMeetingRequest();
      } else {
        addMessage('bot', "I can help you request Zohaib's resume or schedule a meeting. What would you like to do?");
      }
    }
  };

  const handleQuickAction = (action) => {
    if (action === 'resume') {
      handleResumeRequest();
    } else if (action === 'meeting') {
      handleMeetingRequest();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-pink-400 via-slate-400 to-purple-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        {isOpen ? (
          <FaTimes className="text-white text-xl" />
        ) : (
          <FaComments className="text-white text-xl" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-gradient-to-br from-neutral-900/95 to-neutral-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500/20 via-slate-500/20 to-purple-500/20 px-4 py-3 border-b border-neutral-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="text-white font-semibold">Chat with Zohaib's Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'bg-neutral-800 text-neutral-200'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    {message.isProcessing && (
                      <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    )}
                    {message.isOptions && (
                      <div className="mt-2 space-y-2">
                        {['Mentorship', 'Career Discussion', 'Interview Prep', 'Other'].map((option) => (
                          <button
                            key={option}
                            onClick={() => handleMeetingTypeSelected(option)}
                            className="block w-full text-left px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {conversationState === 'idle' && messages.length > 1 && (
              <div className="px-4 py-2 border-t border-neutral-700 flex gap-2">
                <button
                  onClick={() => handleQuickAction('resume')}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-neutral-200 transition-colors"
                >
                  <FaFilePdf /> Resume
                </button>
                <button
                  onClick={() => handleQuickAction('meeting')}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm text-neutral-200 transition-colors"
                >
                  <FaCalendar /> Schedule
                </button>
              </div>
            )}

            {/* Feedback Link */}
            <div className="px-4 py-2 border-t border-neutral-700">
              <button
                onClick={handleFeedbackClick}
                className="w-full flex items-center justify-center gap-2 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <FaComment /> Give Feedback
              </button>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-neutral-700 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-neutral-800 text-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

