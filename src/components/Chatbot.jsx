import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaCalendar, FaFilePdf, FaComment, FaExternalLinkAlt } from 'react-icons/fa';
import { validateProfessionalEmail } from '../utils/emailValidation';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationState, setConversationState] = useState('idle'); // idle, resume_firstname, resume_lastname, resume_email, meeting_firstname, meeting_lastname, meeting_email, meeting_type
  const [collectedData, setCollectedData] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message and quick actions
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage('bot', "Hi! I'm here to help you connect with Zohaib. What would you like to do?");
      addMessage('bot', '', { showQuickActions: true });
    }
  }, [isOpen]);

  // Reset when chat is closed
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setConversationState('idle');
      setCollectedData({});
      setInputValue('');
    }
  }, [isOpen]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && conversationState !== 'idle') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, conversationState]);

  const addMessage = (sender, text, options = {}) => {
    setMessages(prev => [...prev, { sender, text, id: Date.now(), ...options }]);
  };

  const handleResumeRequest = () => {
    setConversationState('resume_firstname');
    setCollectedData({ type: 'resume' });
    addMessage('user', 'Request Resume');
    addMessage('bot', "Great! I'd be happy to share Zohaib's resume with you. To ensure it reaches the right contact, I'll need a few details from you.");
    addMessage('bot', "Let's start with your first name. What's your first name?");
  };

  const handleMeetingRequest = () => {
    setConversationState('meeting_firstname');
    setCollectedData({ type: 'meeting' });
    addMessage('user', 'Schedule Meeting');
    addMessage('bot', "Perfect! I can help you schedule a meeting with Zohaib. Let me collect a few details to get you set up.");
    addMessage('bot', "Let's start with your first name. What's your first name?");
  };

  const handleFirstName = (firstName) => {
    if (!firstName.trim()) {
      addMessage('bot', "Please provide your first name.");
      return;
    }
    setCollectedData(prev => ({ ...prev, firstName: firstName.trim() }));
    addMessage('user', firstName.trim());
    
    if (collectedData.type === 'resume') {
      setConversationState('resume_lastname');
      addMessage('bot', `Nice to meet you, ${firstName.trim()}! What's your last name?`);
    } else {
      setConversationState('meeting_lastname');
      addMessage('bot', `Nice to meet you, ${firstName.trim()}! What's your last name?`);
    }
  };

  const handleLastName = (lastName) => {
    if (!lastName.trim()) {
      addMessage('bot', "Please provide your last name.");
      return;
    }
    setCollectedData(prev => ({ ...prev, lastName: lastName.trim() }));
    addMessage('user', lastName.trim());
    
    if (collectedData.type === 'resume') {
      setConversationState('resume_email');
      addMessage('bot', `Thanks, ${collectedData.firstName} ${lastName.trim()}! Now I'll need your professional email address. This helps ensure Zohaib's resume reaches the right contacts for talent acquisition and recruitment purposes.`);
      addMessage('bot', "What's your professional email address? (e.g., name@company.com or name@company.edu)");
    } else {
      setConversationState('meeting_request');
      addMessage('bot', `Thanks, ${collectedData.firstName} ${lastName.trim()}! What type of meeting are you interested in?`);
      addMessage('bot', "You can choose: Mentorship, Career Discussion, Interview Prep, or Other.", { isOptions: true });
    }
  };

  const handleMeetingTypeSelected = async (type) => {
    if (type === 'Other') {
      setConversationState('meeting_other_topic');
      addMessage('user', type);
      addMessage('bot', "Sure! What would you like to discuss in the meeting?");
    } else {
      setCollectedData(prev => ({ ...prev, meetingType: type }));
      setConversationState('meeting_email');
      addMessage('user', type);
      addMessage('bot', `Perfect! A ${type} meeting sounds great. Now I'll need your professional email address to send you the calendar link.`);
      addMessage('bot', "What's your professional email address? (e.g., name@company.com or name@company.edu)");
    }
  };

  const handleOtherTopicSubmit = async (topic) => {
    if (!topic.trim()) {
      addMessage('bot', "Please tell me what the meeting is about.");
      return;
    }

    setCollectedData(prev => ({ ...prev, meetingType: 'Other', otherTopic: topic.trim() }));
    addMessage('user', topic.trim());

    // Generate AI response
    try {
      addMessage('bot', '...', { isProcessing: true });
      
      const response = await fetch('/api/ai/generate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.response) {
          // Remove processing message
          setMessages(prev => prev.slice(0, -1));
          addMessage('bot', data.response);
        } else {
          setMessages(prev => prev.slice(0, -1));
          addMessage('bot', `A meeting about ${topic.trim()} sounds great!`);
        }
      } else {
        setMessages(prev => prev.slice(0, -1));
        addMessage('bot', `A meeting about ${topic.trim()} sounds great!`);
      }
    } catch (error) {
      console.error('AI response error:', error);
      setMessages(prev => prev.slice(0, -1));
      addMessage('bot', `A meeting about ${topic.trim()} sounds great!`);
    }

    setConversationState('meeting_email');
    addMessage('bot', "Now I'll need your email address to send you the calendar link.");
    addMessage('bot', "What's your email address?");
  };

  const handleResumeEmailSubmit = async (email) => {
    const validation = validateProfessionalEmail(email);
    
    if (!validation.valid) {
      addMessage('bot', validation.message);
      return;
    }

    addMessage('user', email);
    addMessage('bot', `Perfect! I've got all the information I need, ${collectedData.firstName}.`, { isProcessing: true });

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
        addMessage('bot', `Resume request submitted! I've sent a notification to Zohaib. You'll receive an email once it's approved. Is there anything else I can help you with?`);
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

  const handleMeetingEmailSubmit = (email) => {
    // Basic email format validation for meetings (any email is fine)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addMessage('bot', 'Please enter a valid email address.');
      return;
    }

    setCollectedData(prev => ({ ...prev, email }));
    addMessage('user', email);
    addMessage('bot', `Perfect! I have all your information, ${collectedData.firstName}.`);
    addMessage('bot', `Click the button below to open the calendar page where you can view available time slots and book your meeting.`, { showCalendarButton: true });
    setConversationState('idle');
  };

  const handleOpenCalendar = () => {
    // Open calendar in new tab with pre-filled data in URL or localStorage
    const calendarUrl = '/calendar';
    const dataToPass = {
      name: `${collectedData.firstName} ${collectedData.lastName}`,
      email: collectedData.email,
      meetingType: collectedData.meetingType === 'Other' && collectedData.otherTopic 
        ? collectedData.otherTopic 
        : collectedData.meetingType,
    };
    
    // Store in sessionStorage for the calendar page to pick up
    sessionStorage.setItem('bookingPrefills', JSON.stringify(dataToPass));
    
    window.open(calendarUrl, '_blank');
    addMessage('bot', "I've opened the calendar in a new tab. You can select an available time slot and complete your booking there. Is there anything else I can help you with?");
    setConversationState('idle');
    setCollectedData({});
  };

  const handleFeedbackClick = () => {
    setIsOpen(false);
    window.open('/feedback', '_blank');
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    switch (conversationState) {
      case 'resume_firstname':
        handleFirstName(userMessage);
        break;
      case 'resume_lastname':
        handleLastName(userMessage);
        break;
      case 'resume_email':
        handleResumeEmailSubmit(userMessage);
        break;
      case 'meeting_firstname':
        handleFirstName(userMessage);
        break;
      case 'meeting_lastname':
        handleLastName(userMessage);
        break;
      case 'meeting_other_topic':
        handleOtherTopicSubmit(userMessage);
        break;
      case 'meeting_email':
        handleMeetingEmailSubmit(userMessage);
        break;
      case 'meeting_request':
        // Handle meeting type selection via text
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
        break;
      default:
        // Handle general queries
        addMessage('user', userMessage);
        if (userMessage.toLowerCase().includes('resume') || userMessage.toLowerCase().includes('cv')) {
          handleResumeRequest();
        } else if (userMessage.toLowerCase().includes('meeting') || userMessage.toLowerCase().includes('schedule') || userMessage.toLowerCase().includes('book')) {
          handleMeetingRequest();
        } else {
          addMessage('bot', "I can help you request Zohaib's resume or schedule a meeting. What would you like to do?");
          addMessage('bot', '', { showQuickActions: true });
        }
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
                    {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
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
                    {message.showQuickActions && (
                      <div className="mt-3 space-y-2">
                        <button
                          onClick={handleResumeRequest}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 rounded-lg text-sm font-medium text-white transition-all"
                        >
                          <FaFilePdf /> Request Resume (HR/Talent Acquisition)
                        </button>
                        <button
                          onClick={handleMeetingRequest}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 rounded-lg text-sm font-medium text-white transition-all"
                        >
                          <FaCalendar /> Schedule a Meeting
                        </button>
                      </div>
                    )}
                    {message.showCalendarButton && (
                      <button
                        onClick={handleOpenCalendar}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 rounded-lg text-sm font-medium text-white transition-opacity"
                      >
                        <FaCalendar /> Open Calendar
                        <FaExternalLinkAlt className="text-xs" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

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
                placeholder={conversationState === 'idle' ? "Type your message..." : "Type your response..."}
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
