CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

CREATE DATABASE education;

CREATE TABLE courses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID NOT NULL,  
    tutor_email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
     description TEXT NOT NULL,
    image VARCHAR(255),
    tutor VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    level VARCHAR(50) NOT NULL DEFAULT 'Beginner',
    duration VARCHAR(50) NOT NULL DEFAULT 'Unknown',
    language VARCHAR(50) NOT NULL DEFAULT 'English',
    syllabus TEXT NOT NULL DEFAULT '',
    requirements TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_tutor FOREIGN KEY (tutor_email) REFERENCES users(user_email) ON DELETE CASCADE
);

CREATE TABLE course_pdfs (
     id UUID PRIMARY KEY,
  course_id UUID REFERENCES public."courses"(id) ON DELETE CASCADE,
  file TEXT NOT NULL,
  description TEXT
);

CREATE TABLE  course_videos (
  id UUID PRIMARY KEY,
  course_id UUID REFERENCES public."courses"(id) ON DELETE CASCADE,
  file TEXT NOT NULL,
  description TEXT
);

CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  user_password TEXT NOT NULL,
  type_register TEXT CHECK (type_register IN ('student', 'tutor','admin')) NOT NULL,
  phone_number TEXT,  
  gender TEXT CHECK (gender IN ('male', 'female')) ,
  date_of_birth DATE,
  photo TEXT,  
  bio TEXT ,
  is_verified  BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('accepted', 'rejected', 'waiting', 'approved'))
);
ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT false;

ALTER TABLE users ADD CONSTRAINT status_check CHECK (status IN ('accepted', 'rejected', 'waiting','aproved'))

CREATE TABLE tutors (
  tutor_email TEXT PRIMARY KEY REFERENCES users(user_email) ON DELETE CASCADE,
  country TEXT,
  price_per_hour DECIMAL(10, 2),
  specialty TEXT,
  degree TEXT,
  languages TEXT[], 
  availability TEXT,  
  rating DECIMAL(3, 2),  
  is_active BOOLEAN DEFAULT TRUE 
);

CREATE TABLE videos (
  id SERIAL PRIMARY KEY,
   user_id UUID NOT NULL,
  video_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE live_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tutor_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  room VARCHAR(50) NOT NULL UNIQUE,
  invite_link TEXT NOT NULL,
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP
);

CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room VARCHAR(50) NOT NULL REFERENCES live_sessions(room) ON DELETE CASCADE,
  sender VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tutor_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL,
   available_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'available'
);

CREATE TABLE student_bookings (
  id SERIAL PRIMARY KEY,
  tutor_id UUID NOT NULL,
  user_id UUID NOT NULL,
  booking_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined
  message TEXT,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   live_link TEXT
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,        
  type VARCHAR(50) NOT NULL,        
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  email_user VARCHAR(100) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (email_user) REFERENCES users(user_email) ON DELETE CASCADE
);

CREATE TABLE replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
  blog_id UUID NOT NULL,  
  reply_text TEXT NOT NULL,
  email_user VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,  
  FOREIGN KEY (email_user) REFERENCES users(user_email) ON DELETE CASCADE 
);


CREATE TABLE groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    range_end_date DATE NULL,
    range_start_date DATE NULL,
    daily_end TIME NULL,
    daily_start TIME NULL,
    schedule_mode VARCHAR(20) DEFAULT 'daily', -- daily ou ranged
    tutor_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (group_id, student_id)
);


CREATE TABLE group_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'active', --closed
    meeting_link TEXT,
    session_note TEXT NULL
);
ALTER TABLE group_sessions
ADD COLUMN session_note TEXT NULL;

CREATE TABLE session_pdfs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES group_sessions(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT now()
);


CREATE TABLE tutor_cours_ratings (
    id SERIAL PRIMARY KEY,
    tutor_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messagesChat (
  id SERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE course_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    paypal_order_id TEXT NOT NULL, -- PayPal order ID for verification
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cours_ratings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, course_id) -- one rating per user per course
);

CREATE TABLE session_attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES group_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'absent', -- present / absent / late
    time_spent INTERVAL NULL,            -- optional: how long the student attended
    joined_at TIMESTAMP NULL,
    left_at TIMESTAMP NULL,
     note TEXT NULL,  
    UNIQUE (session_id, student_id)
);

CREATE TABLE tutor_pdfs (
  id SERIAL PRIMARY KEY,
  tutor_email TEXT REFERENCES tutors(tutor_email) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  type TEXT NOT NULL,  -- e.g., "ID", "Degree"
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('all', 'students', 'tutors', 'custom')),
    pdf_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE announcement_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false
);

ALTER TABLE announcement_users
ADD COLUMN is_read BOOLEAN DEFAULT false;

SELECT * FROM tutor_pdfs;

INSERT INTO users (user_name,user_email,user_password) VALUES ('test','test@test.com','test');


--to test
INSERT INTO users (user_name,user_email,user_password,type_register) VALUES ('admin','admin@admin.com','$2b$10$C4nknEgHTiJ3igaHDLSmaufW4VujYJl90xxjCY1.Vz.9S3vl7KHei','admin');

--$2b$10$C4nknEgHTiJ3igaHDLSmaufW4VujYJl90xxjCY1.Vz.9S3vl7KHei === '0000'

--
--Se connecter à PostgreSQL :sudo -u postgres psql
--psql -U postgres
--\c jwtdb
--\dt
--heroku pg:psql
