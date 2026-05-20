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
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(10),
    valid_permits VARCHAR(20) NOT NULL
);

CREATE TABLE `parking_lots` (
    lot_id INT PRIMARY KEY AUTO_INCREMENT,
    lot_floor VARCHAR(10) NOT NULL UNIQUE,
    lot_capacity INT NOT NULL,
    lat DECIMAL(30, 20),
    lon DECIMAL(30, 20),
    lot_description TEXT,
    lot_name VARCHAR(50) NOT NULL
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
    daytimePrice DECIMAL(10, 2),
    daytimeRate DECIMAL(10, 2),
    daytime_start_time TIME,
    daytime_end_time TIME,
    daytimeMaxPrice DECIMAL(10, 2),
    eveningPrice DECIMAL(10, 2),
    eveningRate DECIMAL(10, 2),
    evening_start_time TIME,
    evening_end_time TIME,
    eveningMaxPrice DECIMAL(10, 2),
    weekendPrice DECIMAL(10, 2),
    weekendRate DECIMAL(10, 2),
    weekend_start_time TIME,
    weekend_end_time TIME,
    weekendMaxPrice DECIMAL(10, 2),
    rate_unit VARCHAR(20) NOT NULL CHECK (rate_unit IN ('30 min', 'hr')),
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
    lot_id INT,
    FOREIGN KEY (lot_id) REFERENCES parking_lots (lot_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `reservations` (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    license_plate VARCHAR(10) NOT NULL UNIQUE,
    total_cost DECIMAL(10, 2) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
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

ALTER TABLE customers AUTO_INCREMENT=1;