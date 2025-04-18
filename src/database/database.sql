CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 

CREATE DATABASE education;
CREATE TABLE courses (
     tutor_email VARCHAR(255) PRIMARY KEY,
    id SERIAL PRIMARY KEY,
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
        CONSTRAINT fk_tutor FOREIGN KEY (tutor_email) REFERENCES users(email) ON DELETE CASCADE


);

CREATE TABLE course_pdfs (
    id SERIAL PRIMARY KEY,
    course_id UUID NOT NULL,  
    pdf_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
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
  bio TEXT
);

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
  available_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE tutor_availability ADD COLUMN status VARCHAR(20) DEFAULT 'available';


CREATE TABLE student_bookings (
  id SERIAL PRIMARY KEY,
  tutor_id UUID NOT NULL,
  user_id UUID NOT NULL,
  requested_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE student_bookings ADD COLUMN message TEXT;
ALTER TABLE student_bookings ADD COLUMN name TEXT;

SELECT * FROM users;

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