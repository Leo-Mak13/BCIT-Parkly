CREATE DATABASE IF NOT EXISTS `bcit_parkly`;

USE `bcit_parkly`;

DROP TABLE IF EXISTS `reservations`;

DROP TABLE IF EXISTS `parking_stall_vertices`;

DROP TABLE IF EXISTS `parking_stalls`;

DROP TABLE IF EXISTS `parking_lot_valid_permits`;

DROP TABLE IF EXISTS `parking_lot_schedules`;

DROP TABLE IF EXISTS `parking_lots`;

DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(10),
    valid_permits VARCHAR(20) NOT NULL CHECK (valid_permits IN ('staff', 'student', 'public'))
);

CREATE TABLE `parking_lots` (
    lot_id INT PRIMARY KEY AUTO_INCREMENT,
    lot_floor VARCHAR(10) NOT NULL UNIQUE,
    lot_type TEXT NOT NULL CHECK (lot_type IN ('staff', 'student', 'public')),
    lot_capacity INT NOT NULL,
    street VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    lot_availability TEXT CHECK (
        lot_availability IN ('available', 'full', 'closed')
    ),
    lat DECIMAL(10, 7),
    lon DECIMAL(10, 7)
);

CREATE TABLE `parking_lot_schedules` (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    lot_id INT NOT NULL,
    start_time TIME,
    end_time TIME,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (lot_id) REFERENCES parking_lots (lot_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `parking_lot_valid_permits` (
    lot_id INT NOT NULL,
    valid_permits VARCHAR(20) NOT NULL CHECK (valid_permits IN ('staff', 'student', 'public')),
    PRIMARY KEY (lot_id, valid_permits),
    FOREIGN KEY (lot_id) REFERENCES parking_lots (lot_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `parking_stalls` (
    stall_id INT PRIMARY KEY AUTO_INCREMENT,
    occupied BOOLEAN DEFAULT FALSE,
    parking_type TEXT NOT NULL CHECK (
        parking_type IN ('regular', 'electric', 'small', 'handicap')
    ),
    centroid_lat DECIMAL(10, 7),
    centroid_lng DECIMAL(10, 7),
    polygon_wkt TEXT,
    coordinates_json JSON,
    POLYGON GEOMETRY SRID 4326 NULL,
    lot_id INT,
    FOREIGN KEY (lot_id) REFERENCES parking_lots (lot_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `parking_stall_vertices` (
    vertex_order INT NOT NULL,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL,
    stall_id INT NOT NULL,
    PRIMARY KEY (stall_id, vertex_order),
    FOREIGN KEY (stall_id) REFERENCES parking_stalls (stall_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `reservations` (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    license_plate VARCHAR(10) NOT NULL UNIQUE,
    total_cost DECIMAL(10, 2) NOT NULL,
    stall_location VARCHAR(20) NOT NULL,
    lot_id INT,
    stall_id INT,
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (lot_id) REFERENCES parking_lots (lot_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (stall_id) REFERENCES parking_stalls (stall_id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO
    customers (customer_name, email, phone, valid_permits)
VALUES
    ('leo', 'lmak@dsdf', '123', 'student'),
    ('chris', 'cgoat@dsdf', '6767', 'staff');

INSERT INTO
    parking_lots (
        lot_floor,
        lot_type,
        lot_capacity,
        street,
        city,
        province,
        postal_code,
        lot_availability
    )
VALUES
    (
        'P1',
        'staff',
        100,
        '3700 Willingdon Ave',
        'Burnaby',
        'BC',
        'V5G3H2',
        'available'
    ),
    (
        'P2',
        'student',
        150,
        '3700 Willingdon Ave',
        'Burnaby',
        'BC',
        'V5G3H2',
        'available'
    ),
    (
        'P3',
        'public',
        200,
        '3700 Willingdon Ave',
        'Burnaby',
        'BC',
        'V5G3H2',
        'available'
    );

INSERT INTO
    parking_lot_valid_permits (lot_id, valid_permits)
VALUES
    (3, 'staff'),
    (3, 'student'),
    (3, 'public'),
    (2, 'public'),
    (1, 'staff'),
    (2, 'student');

INSERT INTO
    parking_stalls (occupied, parking_type, lot_id)
VALUES
    (FALSE, 'regular', 1),
    (FALSE, 'electric', 1),
    (FALSE, 'small', 1),
    (FALSE, 'handicap', 1),
    (FALSE, 'regular', 2),
    (FALSE, 'electric', 2),
    (FALSE, 'small', 2),
    (FALSE, 'handicap', 2),
    (FALSE, 'regular', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'small', 3),
    (FALSE, 'handicap', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'small', 3),
    (FALSE, 'handicap', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'small', 3),
    (FALSE, 'handicap', 3);

INSERT INTO
    reservations (
        license_plate,
        total_cost,
        stall_location,
        lot_id,
        stall_id,
        customer_id
    )
VALUES
    ('ABC123', 10.00, 'P1-01', 1, 1, 1),
    ('XYZ789', 8.00, 'P2-01', 2, 5, 2),
    ('LMN456', 12.00, 'P3-01', 2, 9, 1),
    ('DEF456', 12.00, 'P3-02', 2, 10, 2),
    ('GHI789', 12.00, 'P3-03', 1, 11, 1),
    ('JKL012', 12.00, 'P3-04', 3, 12, 2),
    ('MNO345', 12.00, 'P3-05', 3, 13, 1),
    ('PQR678', 12.00, 'P3-06', 3, 14, 2),
    ('STU901', 12.00, 'P3-07', 3, 15, 1),
    ('VWX234', 12.00, 'P3-08', 3, 16, 2),
    ('YZA567', 12.00, 'P3-09', 3, 17, 1),
    ('BCD890', 12.00, 'P3-10', 3, 18, 2);