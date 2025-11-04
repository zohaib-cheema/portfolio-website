-- Database Schema for Portfolio Chatbot and Calendar System

-- Slots table for calendar bookings
CREATE TABLE IF NOT EXISTS slots (
  id VARCHAR(255) PRIMARY KEY,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  datetime TIMESTAMP NOT NULL,
  available BOOLEAN DEFAULT true,
  booked_by VARCHAR(255),
  booked_email VARCHAR(255),
  meeting_type VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  booked_at TIMESTAMP
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id VARCHAR(255) PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Resume Requests table
CREATE TABLE IF NOT EXISTS resume_requests (
  id VARCHAR(255) PRIMARY KEY,
  requester_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, denied
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  denied_at TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_slots_date ON slots(date);
CREATE INDEX IF NOT EXISTS idx_slots_available ON slots(available);
CREATE INDEX IF NOT EXISTS idx_slots_datetime ON slots(datetime);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_resume_requests_status ON resume_requests(status);
CREATE INDEX IF NOT EXISTS idx_resume_requests_created_at ON resume_requests(created_at);

