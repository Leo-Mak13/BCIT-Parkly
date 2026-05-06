CREATE DATABASE IF NOT EXISTS `bcit_parkly`;

USE `bcit_parkly`;

DROP TABLE IF EXISTS `reservations`;

DROP TABLE IF EXISTS `parking_stall_vertices`;

DROP TABLE IF EXISTS `parking_stalls`;

DROP TABLE IF EXISTS `parking_lot_valid_permits`;

DROP TABLE IF EXISTS `parking_lot_schedules`;

DROP TABLE IF EXISTS `parking_lot_address`;
DROP TABLE IF EXISTS `parking_lots`;

DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `customers` (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(10),
    valid_permits VARCHAR(20) NOT NULL
);

CREATE TABLE `parking_lots` (
    lot_id INT PRIMARY KEY AUTO_INCREMENT,
    lot_floor VARCHAR(10) NOT NULL UNIQUE,
    lot_type TEXT NOT NULL CHECK (lot_type IN ('staff', 'student')),
    lot_capacity INT NOT NULL,
    lat DECIMAL(30, 20),
    lon DECIMAL(30, 20),
    lot_description TEXT,
    valid_permits TEXT
    );

CREATE TABLE `parking_lot_address`(
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    street VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    lot_id INT NOT NULL,
    FOREIGN KEY (lot_id) REFERENCES parking_lots (lot_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `parking_lot_schedules` (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    daytimePrice DECIMAL(10,2),
    daytimeRate DECIMAL(10,2),
    daytimeTime TIME,
    daytimeMaxPrice DECIMAL(10,2),
    eveningPrice DECIMAL(10,2),
    eveningRate DECIMAL(10,2),
    eveningTime TIME,
    eveningMaxPrice DECIMAL(10,2),
    weekendPrice DECIMAL(10,2),
    weekendRate DECIMAL(10,2),
    weekendTime TIME,
    weekendMaxPrice DECIMAL(10,2),
    rate_unit VARCHAR(5) NOT NULL CHECK (rate_unit IN ('min', 'hr')),
    lot_id INT NOT NULL,
    FOREIGN KEY (lot_id) REFERENCES parking_lots (lot_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `parking_lot_valid_permits` (
    lot_id INT NOT NULL,
    valid_permits VARCHAR(20) NOT NULL CHECK (valid_permits IN ('staff', 'student')),
    PRIMARY KEY (lot_id, valid_permits),
    FOREIGN KEY (lot_id) REFERENCES parking_lots (lot_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `parking_stalls` (
    stall_id INT PRIMARY KEY AUTO_INCREMENT,
    occupied BOOLEAN DEFAULT FALSE,
    parking_type TEXT NOT NULL CHECK (
        parking_type IN ('regular', 'electric', 'small', 'handicap')
    ),
    -- centroid_lat DECIMAL(10, 7),
    -- centroid_lng DECIMAL(10, 7),
    -- polygon_wkt TEXT,
    -- coordinates_json JSON,
    -- POLYGON GEOMETRY SRID 4326 NULL,
    lot_id INT,
    FOREIGN KEY (lot_id) REFERENCES parking_lots (lot_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- CREATE TABLE `parking_stall_vertices` (
--     vertex_order INT NOT NULL,
--     lat DECIMAL(10, 7) NOT NULL,
--     lng DECIMAL(10, 7) NOT NULL,
--     stall_id INT NOT NULL,
--     PRIMARY KEY (stall_id, vertex_order),
--     FOREIGN KEY (stall_id) REFERENCES parking_stalls (stall_id) ON DELETE CASCADE ON UPDATE CASCADE
-- );

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

CREATE TABLE `sessions` (
    id VARCHAR(200) NOT NULL PRIMARY KEY,
    secret_hash MEDIUMBLOB NOT NULL,
    created_at DATETIME NOT NULL
);

INSERT INTO parking_lots(lot_floor, lot_type, lot_capacity, lat, lon, lot_description, valid_permits)
VALUES('1', 'staff', 80, 49.28350846808849, -123.11494653742396, 'downtown first floor', 'staff, student')

INSERT INTO customers (customer_id, customer_name, email, phone, valid_permits) VALUES
(7, 'Jordan Patel', 'jordan.patel@example.com', '6045550107', 'student'),
(8, 'Priya Nair', 'priya.nair@example.com', '6045550108', 'staff'),
(9, 'Liam Ortiz', 'liam.ortiz@example.com', '6045550109', 'student'),
(10, 'Grace Kim', 'grace.kim@example.com', '6045550110', 'staff');

INSERT INTO parking_stalls (
    stall_id, occupied, parking_type, lot_id
) VALUES
(7, TRUE, 'regular', 1),
(8, TRUE, 'electric', 1),
(9, FALSE, 'small', 1),
(10, TRUE, 'handicap', 1),
(11, FALSE, 'regular', 1),
(12, FALSE, 'electric', 1);

INSERT INTO reservations (
    reservation_id, license_plate, total_cost, stall_location, lot_id, stall_id, customer_id
) VALUES
(5, 'BC5J6K', 5.00, 'L1-07', 1, 7, 7),
(6, 'BC6L7M', 7.50, 'L1-08', 1, 8, 8),
(7, 'BC7N8P', 2.50, 'L1-10', 1, 10, 9);