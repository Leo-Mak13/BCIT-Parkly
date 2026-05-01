CREATE DATABASE IF NOT EXISTS `bcit_parkly`;
USE `bcit_parkly`;

DROP TABLE IF EXISTS `reservations`;
DROP TABLE IF EXISTS `parking_stall`;
DROP TABLE IF EXISTS `parking_lot`;
DROP TABLE IF EXISTS `customers`;

-- CREATE TABLE
--     parking_lots (
--         lot_id VARCHAR(20) PRIMARY KEY,
--         floor_zone VARCHAR(10) NOT NULL,
--         level VARCHAR(5) NOT NULL,
--         zone VARCHAR(5),
--         parking_type VARCHAR(50),
--         status VARCHAR(20) DEFAULT 'available',
--         centroid_lat DECIMAL(10, 7),
--         centroid_lng DECIMAL(10, 7),
--         polygon_wkt TEXT,
--         coordinates_json JSON,
--         polygon GEOMETRY SRID 4326 NULL
--     );
CREATE TABLE `customers` (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone VARCHAR(10),
    customer_type VARCHAR(20) NOT NULL CHECK (
        customer_type IN ('staff', 'student', 'public')
    )
);

CREATE TABLE `parking_lot` (
    lot_id INT PRIMARY KEY AUTO_INCREMENT,
    lot_floor VARCHAR(10) NOT NULL UNIQUE,
    lot_type TEXT NOT NULL CHECK (
        lot_type IN ('staff', 'student', 'public')
    ),
    lot_capacity INT NOT NULL,
    student_rate DECIMAL NOT NULL,
    public_rate DECIMAL NOT NULL
);

CREATE TABLE `parking_stall` (
    stall_id INT PRIMARY KEY AUTO_INCREMENT,
    occupied BOOLEAN DEFAULT FALSE,
    parking_type TEXT NOT NULL CHECK (
        parking_type IN (
            'regular',
            'electric',
            'small',
            'handicap'
        )
    ),
    lot_id INT,
    FOREIGN KEY (lot_id) REFERENCES parking_lot (lot_id) ON DELETE CASCADE ON UPDATE CASCADE
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
    FOREIGN KEY (lot_id) REFERENCES parking_lot (lot_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (stall_id) REFERENCES parking_stall (stall_id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO
    customers (
        customer_name,
        email,
        phone,
        customer_type
    )
VALUES (
        'leo',
        'lmak@dsdf',
        '123',
        'student'
    );

INSERT INTO
    customers (
        customer_name,
        email,
        phone,
        customer_type
    )
VALUES (
        'chris',
        'cgoat@dsdf',
        '6767',
        'staff'
    );