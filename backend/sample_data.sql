-- ==========================================
-- PostgreSQL Schema & Sample Data Script
-- Smart Library Management System
-- ==========================================

-- 1. CLEANUP EXISTING TABLES (Optional)
-- DROP TABLE IF EXISTS borrows CASCADE;
-- DROP TABLE IF EXISTS books CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE TABLES

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Books Table
CREATE TABLE IF NOT EXISTS books (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    category_id BIGINT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    available_copies INTEGER NOT NULL CHECK (available_copies >= 0),
    published_year INTEGER NOT NULL,
    language VARCHAR(30) NOT NULL,
    shelf_location VARCHAR(50),
    cover_image TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Borrows Table
CREATE TABLE IF NOT EXISTS borrows (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 3. INSERT SAMPLE DATA

-- Passwords (BCrypt encrypted):
-- admin123 -> $2a$10$wK1k6aC3t48Lq26N/n1CHeL1zXjU5YmO6YQxWd/iU1RzJ9uA/1wS6 (Role: ADMIN)
-- librarian123 -> $2a$10$tZg/P2W1Wv/hNlZt/n1CHeL1zXjU5YmO6YQxWd/iU1RzJ9uA/1wS6 (Role: LIBRARIAN)
-- user123 -> $2a$10$1Y8c7aC3t48Lq26N/n1CHeL1zXjU5YmO6YQxWd/iU1RzJ9uA/1wS6 (Role: USER)

INSERT INTO users (first_name, last_name, username, email, password, role, phone_number, created_at)
VALUES 
('System', 'Admin', 'admin', 'admin@smartlibrary.com', '$2a$10$1Y8c7aC3t48Lq26N/n1CHeL1zXjU5YmO6YQxWd/iU1RzJ9uA/1wS6', 'ADMIN', '+1234567890', CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (first_name, last_name, username, email, password, role, phone_number, created_at)
VALUES 
('Sarah', 'Connor', 'librarian', 'librarian@smartlibrary.com', '$2a$10$1Y8c7aC3t48Lq26N/n1CHeL1zXjU5YmO6YQxWd/iU1RzJ9uA/1wS6', 'LIBRARIAN', '+1234567891', CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (first_name, last_name, username, email, password, role, phone_number, created_at)
VALUES 
('John', 'Doe', 'user', 'user@smartlibrary.com', '$2a$10$1Y8c7aC3t48Lq26N/n1CHeL1zXjU5YmO6YQxWd/iU1RzJ9uA/1wS6', 'USER', '+1234567892', CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- Categories
INSERT INTO categories (name, description)
VALUES 
('Science Fiction', 'Futuristic, technological themes, and outer space adventures.'),
('Biography', 'Biographies and autobiographies of historical and modern figures.'),
('Technology', 'Computing, programming, engineering, and digital systems.'),
('History', 'Historical analyses, ancient civilizations, and war studies.')
ON CONFLICT (name) DO NOTHING;

-- Books (Assumes category IDs 1, 2, 3, 4 match the categories above)
INSERT INTO books (title, author, isbn, category_id, description, quantity, available_copies, published_year, language, shelf_location, cover_image, created_at)
VALUES 
('Dune', 'Frank Herbert', '9780441172719', 1, 'Follows the adventures of Paul Atreides, the son of a noble family entrusted with the ruling of the desert planet Arrakis.', 5, 4, 1965, 'English', 'SF-A1', NULL, CURRENT_TIMESTAMP),
('I, Robot', 'Isaac Asimov', '9780553382563', 1, 'A collection of science fiction short stories featuring robots operating under the Three Laws of Robotics.', 3, 3, 1950, 'English', 'SF-A2', NULL, CURRENT_TIMESTAMP),
('Steve Jobs', 'Walter Isaacson', '9781451648539', 2, 'The exclusive biography of Steve Jobs, co-founder of Apple Inc., based on more than forty interviews.', 2, 1, 2011, 'English', 'BIO-B1', NULL, CURRENT_TIMESTAMP),
('Clean Code', 'Robert C. Martin', '9780132350884', 3, 'A handbook of agile software craftsmanship that guides developers in writing cleaner, highly maintainable code.', 4, 4, 2008, 'English', 'TECH-C1', NULL, CURRENT_TIMESTAMP),
('The Art of War', 'Sun Tzu', '9781590302255', 4, 'An ancient Chinese military treatise attributed to Sun Tzu, a high-ranking military general, strategist, and tactician.', 10, 9, 1910, 'English', 'HIST-D1', NULL, CURRENT_TIMESTAMP),
('Sapiens', 'Yuval Noah Harari', '9780062316097', 4, 'Spans the history of the human species, tracing evolutionary phases from Homo sapiens in the Stone Age to contemporary times.', 3, 3, 2011, 'English', 'HIST-D2', NULL, CURRENT_TIMESTAMP)
ON CONFLICT (isbn) DO NOTHING;

-- Borrows (Assumes user ID 3 is John Doe, book ID 1 is Dune, book ID 3 is Steve Jobs, book ID 5 is The Art of War)
INSERT INTO borrows (user_id, book_id, borrow_date, due_date, return_date, status)
VALUES 
(3, 1, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '9 days', NULL, 'BORROWED'),
(3, 3, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE - INTERVAL '5 days', 'RETURNED'),
(3, 5, CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '11 days', NULL, 'OVERDUE');
