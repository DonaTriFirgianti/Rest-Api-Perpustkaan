CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(10) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO members (name, email, phone, join_date) VALUES
('Budi Santoso', 'budi@email.com', '08112345678', '2024-01-10'),
('Kinan Rahayu', 'kinan@email.com', '08223456789', '2024-02-15'),
('Ahmad Fauzi', 'ahmad@email.com', '08334567890', '2024-03-20'),
('Dewi Lestari', 'dewi@email.com', '08445678901', '2024-04-05'),
('Reza Firmansyah', 'reza@email.com', '08556789012', '2024-05-12');

CREATE TABLE member_cards (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL UNIQUE,
    card_number VARCHAR(20) NOT NULL UNIQUE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    card_status VARCHAR(10) NOT NULL DEFAULT 'active'
        CHECK (card_status IN ('active', 'expired', 'lost', 'blocked')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_card_member
        FOREIGN KEY (member_id) REFERENCES members(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO member_cards (member_id, card_number, issue_date, expiry_date) VALUES
(1, 'KAR-2024-001', '2024-01-10', '2027-01-10'),
(2, 'KAR-2024-002', '2024-02-15', '2027-02-15'),
(3, 'KAR-2024-003', '2024-03-20', '2027-03-20'),
(4, 'KAR-2024-004', '2024-04-05', '2027-04-05'),
(5, 'KAR-2024-005', '2024-05-12', '2027-05-12');

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    publisher VARCHAR(100),
    year INT CHECK (year > 1000 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    stock INT NOT NULL DEFAULT 1 CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO books (isbn, title, author, publisher, year, stock) VALUES
('978-602-0853-65-3', 'Bumi Manusia', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 2005, 3),
('978-602-0853-70-7', 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 5),
('978-979-22-8019-8', 'Perahu Kertas', 'Dee Lestari', 'Bentang Pustaka', 2009, 4),
('978-602-0853-90-5', 'Filosofi Teras', 'Henry Manampiring', 'Kompas', 2018, 6),
('978-602-220-434-6', 'Atomic Habits', 'James Clear', 'Gramedia', 2019, 4),
('978-602-060-327-4', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 2008, 2),
('978-979-29-0255-6', 'Pemrograman Web', 'Betha Sidik', 'Informatika', 2020, 3),
('978-602-262-153-4', 'Belajar Python', 'Agus Kurniawan', 'Jasakom', 2021, 4);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, description) VALUES
('Sastra', 'Karya fiksi, novel, puisi, dan cerpen Indonesia maupun mancanegara'),
('Pengembangan Diri', 'Buku motivasi, produktivitas, dan peningkatan kualitas diri'),
('Teknologi', 'Pemrograman, jaringan komputer, sistem informasi, dan IT umum'),
('Sejarah', 'Sejarah Indonesia, dunia, dan biografi tokoh'),
('Sains', 'Ilmu pengetahuan alam, matematika, dan penelitian ilmiah');

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL,
    book_id INT NOT NULL,
    loan_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(10) NOT NULL DEFAULT 'borrowed'
        CHECK (status IN ('borrowed', 'returned', 'overdue')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_loan_member
        FOREIGN KEY (member_id) REFERENCES members(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_loan_book
        FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

INSERT INTO loans (member_id, book_id, loan_date, due_date, return_date, status) VALUES
(1, 1, '2025-01-05', '2025-01-19', '2025-01-17', 'returned'),
(1, 5, '2025-02-10', '2025-02-24', '2025-02-20', 'returned'),
(2, 2, '2025-02-01', '2025-02-15', '2025-02-13', 'returned'),
(2, 4, '2025-03-01', '2025-03-15', NULL, 'overdue'),
(3, 6, '2025-03-10', '2025-03-24', NULL, 'borrowed'),
(4, 3, '2025-03-12', '2025-03-26', NULL, 'borrowed'),
(5, 7, '2025-01-20', '2025-02-03', '2025-01-30', 'returned'),
(5, 8, '2025-03-15', '2025-03-29', NULL, 'borrowed');

CREATE TABLE book_categories (
    book_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (book_id, category_id),

    CONSTRAINT fk_bc_book
        FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_bc_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO book_categories (book_id, category_id) VALUES
(1, 1),
(1, 4),
(2, 1),
(3, 1),
(4, 2),
(5, 2),
(6, 3),
(7, 3),
(8, 3),
(8, 5);