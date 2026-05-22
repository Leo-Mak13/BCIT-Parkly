CREATE DATABASE  IF NOT EXISTS `bcit_parkly`;
USE `bcit_parkly`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `reservations`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `parking_stall_vertices`;
DROP TABLE IF EXISTS `parking_stalls`;
DROP TABLE IF EXISTS `parking_lot_valid_permits`;
DROP TABLE IF EXISTS `parking_lot_schedules`;
DROP TABLE IF EXISTS `parking_lot_address`;
DROP TABLE IF EXISTS `parking_lots`;
DROP TABLE IF EXISTS `customers`;

CREATE TABLE `customers` (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(10),
    valid_permits VARCHAR(20) NOT NULL
);

CREATE TABLE `users` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255),
    FOREIGN KEY (email) REFERENCES customers (email) ON DELETE CASCADE ON UPDATE CASCADE
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
    created_at DATETIME NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
ALTER TABLE customers AUTO_INCREMENT=1;

-- INSERTS
USE `bcit_parkly`;

INSERT INTO parking_lots(lot_floor, lot_capacity, lat, lon, lot_description, lot_name) VALUES
    ('1', 6, 49.28350846808849, -123.11494653742396, 'BCIT Downtown Campus Lot', 'BCIT Campus Parking'),
    ('2', 10, 49.282255197149816, -123.11535548504304, 'Lot 1037', '619 Richards Street Lot'),
    ('3', 67, 49.28541860364103, -123.11753337849295, 'Lot 4116', 'Diamond Parking'),
    ('B1', 74, 49.28525142611815, -123.11953798092193, 'Precise ParkLink', 'Park Place Parking'),
    ('B2', 30, 49.28131977717858, -123.11024460254156, 'EasyPark Lot 2', 'EasyPark Lot');

INSERT INTO customers (first_name, last_name, email, phone, valid_permits) VALUES
('Jordan', 'Patel', 'jordan.patel@example.com', '6045550107', 'student'),
('Priya', 'Nair', 'priya.nair@example.com', '6045550108', 'staff'),
('Liam', 'Ortiz', 'liam.ortiz@example.com', '6045550109', 'student'),
('Grace', 'Kim', 'grace.kim@example.com', '6045550110', 'staff'),
('Maria', 'Garcia', 'maria.garcia@example.com', '6045550111', 'student'),
('David', 'Chen', 'david.chen@example.com', '6045550112', 'staff'),
('Sarah', 'Johnson', 'sarah.johnson@example.com', '6045550113', 'student'),
('Michael', 'Thompson', 'michael.t@example.com', '6045550114', 'staff'),
('Emily', 'Rodriguez', 'emily.r@example.com', '6045550115', 'student'),
('James', 'Wilson', 'james.wilson@example.com', '6045550116', 'staff'),
('Lisa', 'Anderson', 'lisa.anderson@example.com', '6045550117', 'student'),
('Christopher', 'Lee', 'christopher.lee@example.com', '6045550118', 'staff');

INSERT INTO users (id, email, password_hash) VALUES
    (1, 'jordan.patel@example.com', '$2b$10$cnAHYKB7HXriB/lUB6/XZ.O6JUpbn4a/KtPtXk9h0UAd2mvlj5Jzi'),
    (2, 'priya.nair@example.com', '$2b$10$MgASenAIo81/xw4MHY6.cu6orxgrPyszMcuvGHF6P2fZUQOQjuMOO'),
    (3, 'liam.ortiz@example.com', '$2b$10$7ojwmyF76s9TnOjKX9dk1unpEZeh/pC/fbqZYB4UIK19o.o44in4q'),
    (4, 'grace.kim@example.com', '$2b$10$TrcpiqGVXz8c55C7McNPrebBY9I5.M1TcNrNJl7HveojSuzFpDWWO'),
    (5, 'maria.garcia@example.com', '$2b$10$yJBE64Ivn8ehov36kOW7uujTEWYJWGhuN5GgWNS6mayL3ey.f5Jiy'),
    (6, 'david.chen@example.com', '$2b$10$jASse6jZsLVXPy.Ndip47.5zoG2clEpQ0a9X.BoJZgTi3Y3iH20qu'),
    (7, 'sarah.johnson@example.com', '$2b$10$JMWNr5UnDHs0LjN.h6nzaepSMso2Ka7y0uveS.cAglI8gLcDG26Te'),
    (8, 'michael.t@example.com', '$2b$10$gsx4VTqzKWbjXEYT3APYDe121l5bxrrSprQxYjmuP36wvjCYAwHVa'),
    (9, 'emily.r@example.com', '$2b$10$H7ziEfxBtnaWQl2e75AJ9enoRp37slBOKI2DxIXN.t8mTWb.pnvs6'),
    (10, 'james.wilson@example.com', '$2b$10$0Ql.zMJbhKd3u2JuKOiS0OMJj5uvRsQUpN1V6I7xsVGiCY2/nkM0e'),
    (11, 'lisa.anderson@example.com', '$2b$10$NzCRVQoh.O8v0TD7g9PwRO/pgxBW6rkC4rviGwylWGlI0EQ75HMyG'),
    (12, 'christopher.lee@example.com', '$2b$10$D2ZOs45tIV34HXeyY2mAMu9vEdsIYxVZvIBirvTrfWgYTfR5LOz6O');

INSERT INTO parking_stalls (occupied, parking_type, lot_id) VALUES
    (TRUE, 'regular', 1),
    (TRUE, 'electric', 1),
    (TRUE, 'small', 1),
    (TRUE, 'handicap', 1),
    (TRUE, 'regular', 1),
    (TRUE, 'electric', 1),
    (TRUE, 'regular', 2),
    (TRUE, 'regular', 2),
    (TRUE, 'electric', 2),
    (TRUE, 'electric', 2),
    (TRUE, 'small', 2),
    (TRUE, 'small', 2),
    (TRUE, 'handicap', 2),
    (TRUE, 'handicap', 2),
    (TRUE, 'regular', 2),
    (FALSE, 'regular', 2),
    (FALSE, 'regular', 3),
    (TRUE, 'regular', 3),
    (FALSE, 'electric', 3),
    (TRUE, 'electric', 3),
    (FALSE, 'small', 3),
    (TRUE, 'small', 3),
    (TRUE, 'handicap', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'handicap', 3),
    (FALSE, 'handicap', 3),
    (FALSE, 'handicap', 3),
    (FALSE, 'handicap', 3),
    (FALSE, 'handicap', 3),
    (TRUE, 'regular', 3),
    (TRUE, 'regular', 3),
    (TRUE, 'regular', 3),
    (TRUE, 'regular', 3),
    (TRUE, 'electric', 3),
    (TRUE, 'electric', 3),
    (TRUE, 'electric', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'regular', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'electric', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'small', 3),
    (FALSE, 'handicap', 3),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'handicap', 4),
    (FALSE, 'handicap', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'small', 4),
    (TRUE, 'small', 4),
    (TRUE, 'small', 4),
    (TRUE, 'small', 4),
    (TRUE, 'small', 4),
    (TRUE, 'small', 4),
    (TRUE, 'small', 4),
    (TRUE, 'small', 4),
    (TRUE, 'small', 4),
    (TRUE, 'small', 4),
    (TRUE, 'handicap', 4),
    (TRUE, 'handicap', 4),
    (TRUE, 'handicap', 4),
    (TRUE, 'handicap', 4),
    (TRUE, 'handicap', 4),
    (TRUE, 'handicap', 4),
    (TRUE, 'handicap', 4),
    (TRUE, 'handicap', 4),
    (TRUE, 'handicap', 4),
    (TRUE, 'handicap', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'regular', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (TRUE, 'electric', 4),
    (FALSE, 'regular', 4),
    (FALSE, 'regular', 4),
    (FALSE, 'regular', 4),
    (FALSE, 'regular', 4),
    (FALSE, 'regular', 4),
    (FALSE, 'electric', 4),
    (FALSE, 'electric', 4),
    (FALSE, 'electric', 4),
    (FALSE, 'small', 4),
    (TRUE,  'regular',  5),
    (TRUE,  'regular',  5),
    (TRUE,  'regular',  5),
    (TRUE,  'regular',  5),
    (TRUE,  'regular',  5),
    (TRUE,  'regular',  5),
    (FALSE, 'regular',  5),
    (FALSE, 'regular',  5),
    (FALSE, 'regular',  5),
    (FALSE, 'regular',  5),
    (FALSE, 'regular',  5),
    (FALSE, 'regular',  5),
    (FALSE, 'regular',  5),
    (FALSE, 'regular',  5),
    (FALSE, 'regular',  5),
    (FALSE, 'regular',  5),
    (TRUE,  'electric', 5),
    (TRUE,  'electric', 5),
    (FALSE, 'electric', 5),
    (FALSE, 'electric', 5),
    (FALSE, 'electric', 5),
    (FALSE, 'electric', 5),
    (FALSE, 'electric', 5),
    (FALSE, 'electric', 5),
    (TRUE,  'small',    5),
    (FALSE, 'small',    5),
    (FALSE, 'small',    5),
    (FALSE, 'small',    5),
    (TRUE,  'handicap', 5),
    (FALSE, 'handicap', 5);

INSERT INTO reservations (license_plate, total_cost, start_time, end_time, lot_id, stall_id, customer_id) VALUES
    ('BC5J6K', 5.00, '2026-05-21 08:00:00', '2026-05-23 23:59:59', 1, 1, 1),
    ('BC6L7M', 7.50, '2026-05-21 09:00:00', '2026-05-23 23:59:59', 1, 2, 2),
    ('BC7N8P', 2.50, '2026-05-21 10:00:00', '2026-05-23 23:59:59', 1, 3, 3),
    ('BC5E6F', 5.25, '2026-05-21 10:30:00', '2026-05-23 23:59:59', 1, 4, 4),
    ('BC1H2J', 6.00, '2026-05-21 07:30:00', '2026-05-23 23:59:59', 1, 5, 5),
    ('BC3K4L', 4.50, '2026-05-21 11:00:00', '2026-05-23 23:59:59', 1, 6, 6),
    ('BC8Q9R', 6.50, '2026-05-21 07:30:00', '2026-05-23 23:59:59', 2, 7, 1),
    ('BC9S0T', 8.00, '2026-05-21 08:15:00', '2026-05-23 23:59:59', 2, 8, 2),
    ('BC0U1V', 4.00, '2026-05-21 11:00:00', '2026-05-23 23:59:59', 2, 9, 3),
    ('BC2M5N', 5.00, '2026-05-21 09:00:00', '2026-05-23 23:59:59', 2, 10, 4),
    ('BC4P7Q', 6.25, '2026-05-21 08:45:00', '2026-05-23 23:59:59', 2, 11, 5),
    ('BC6R8S', 3.75, '2026-05-21 10:00:00', '2026-05-23 23:59:59', 2, 12, 6),
    ('BC8T1U', 7.00, '2026-05-21 07:00:00', '2026-05-23 23:59:59', 2, 13, 7),
    ('BC0V3W', 4.50, '2026-05-21 12:00:00', '2026-05-23 23:59:59', 2, 14, 8),
    ('BC2X5Y', 5.50, '2026-05-21 09:30:00', '2026-05-23 23:59:59', 2, 15, 9),
    ('BC1W2X', 5.50, '2026-05-18 09:30:00', '2026-05-18 15:00:00', 3, 35, 8),
    ('BC2Y3Z', 7.00, '2026-05-18 08:00:00', '2026-05-18 15:00:00', 3, 36, 9),
    ('BC3A4B', 3.50, '2026-05-18 12:00:00', '2026-05-18 15:30:00', 4, 102, 10),
    ('BC4C5D', 6.00, '2026-05-18 08:45:00', '2026-05-18 14:45:00', 4, 103, 11),
    ('BC5F1G', 5.00, '2026-05-22 07:30:00', '2026-05-24 23:59:59', 5, 158, 1),
    ('BC6H2J', 6.50, '2026-05-22 08:00:00', '2026-05-24 23:59:59', 5, 159, 2),
    ('BC7K3L', 4.25, '2026-05-22 08:30:00', '2026-05-24 23:59:59', 5, 160, 3),
    ('BC8M4N', 7.00, '2026-05-22 09:00:00', '2026-05-24 23:59:59', 5, 161, 4),
    ('BC9P5Q', 5.75, '2026-05-22 09:30:00', '2026-05-24 23:59:59', 5, 162, 5),
    ('BC0R6S', 3.50, '2026-05-22 10:00:00', '2026-05-24 23:59:59', 5, 163, 6),
    ('BC1T7U', 8.00, '2026-05-22 07:00:00', '2026-05-24 23:59:59', 5, 174, 7),
    ('BC2V8W', 6.25, '2026-05-22 10:30:00', '2026-05-24 23:59:59', 5, 175, 8),
    ('BC3X9Y', 4.75, '2026-05-22 11:00:00', '2026-05-24 23:59:59', 5, 182, 9),
    ('BC4Z0A', 5.50, '2026-05-22 11:30:00', '2026-05-24 23:59:59', 5, 186, 10);


INSERT INTO `parking_lot_address` (street, city, province, postal_code, lot_id) VALUES
    ('555 Seymour St', 'Vancouver', 'BC', 'V6B 3H6', 1),
    ('619 Richards St', 'Vancouver', 'BC', 'V6B 5E3', 2),
    ('550 Hornby St 2E7', 'Vancouver', 'BC', 'V6C 2E7', 3),
    ('666 Burrard St', 'Vancouver', 'BC', 'V6C 3P6', 4),
    ('550 Hornby St #2E7', 'Vancouver', 'BC', 'V6C 2E7', 5);


INSERT INTO `parking_lot_schedules` (daytimePrice, daytimeRate, daytime_start_time, daytime_end_time, daytimeMaxPrice, eveningPrice, eveningRate, evening_start_time, evening_end_time, eveningMaxPrice, weekendPrice, weekendRate, weekend_start_time, weekend_end_time, weekendMaxPrice, rate_unit, lot_id) VALUES
    (5.00, 1.00, '08:00:00', '18:00:00', 25.00, 3.00, 1.00, '18:00:00', '00:00:00', 12.00, 2.50, 1.00, '06:00:00', '18:00:00', 10.00, 'hr', 1),
    (5.50, 1.00, '08:00:00', '18:00:00', 27.50, 3.25, 1.00, '18:00:00', '00:00:00', 13.00, 2.75, 1.00, '06:00:00', '18:00:00', 11.00, 'hr', 2),
    (4.75, 1.00, '07:00:00', '19:00:00', 24.00, 2.75, 1.00, '19:00:00', '07:00:00', 11.00, 2.25, 1.00, '06:00:00', '19:00:00', 9.00, 'hr', 3),
    (6.00, 1.00, '08:00:00', '20:00:00', 30.00, 3.50, 1.00, '20:00:00', '08:00:00', 14.00, 3.00, 1.00, '06:00:00', '20:00:00', 12.00, 'hr', 4),
    (5.25, 1.00, '08:00:00', '18:00:00', 26.00, 3.10, 1.00, '18:00:00', '00:00:00', 12.50, 2.60, 1.00, '06:00:00', '18:00:00', 10.50, 'hr', 5);

INSERT INTO `parking_lot_valid_permits` (lot_id, valid_permits) VALUES
    (1, 'staff'),
    (1, 'student'),
    (2, 'staff'),
    (2, 'student'),
    (3, 'staff'),
    (3, 'student'),
    (4, 'staff'),
    (4, 'student'),
    (5, 'staff'),
    (5, 'student');

-- TRIGGERS

DROP TRIGGER IF EXISTS `prevent_reserving_occupied`;
DROP TRIGGER IF EXISTS `occupy_stall_on_reservation`;
DROP TRIGGER IF EXISTS `unoccupy_stall_on_reservation_delete`;
DROP TRIGGER IF EXISTS `validate_stall_in_lot`;
DROP TRIGGER IF EXISTS `validate_customer_permit`;
DROP TRIGGER IF EXISTS `update_lot_capacity_on_stall_insert`;
DROP TRIGGER IF EXISTS `update_lot_capacity_on_stall_delete`;
DROP TRIGGER IF EXISTS `update_stall_occupancy_on_reservation_update`;

DELIMITER //
CREATE TRIGGER `prevent_reserving_occupied`
BEFORE INSERT ON reservations
FOR EACH ROW
BEGIN
    IF (SELECT occupied FROM parking_stalls WHERE stall_id = NEW.stall_id) = TRUE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This parking stall is already occupied.';
    END IF;
END //
DELIMITER ;

-- sets stall to occupied when reservation is made
    -- sets occupied stall to occupied when reservation is made

DELIMITER //
CREATE TRIGGER `occupy_stall_on_reservation`
AFTER INSERT ON reservations
FOR EACH ROW
BEGIN
    UPDATE parking_stalls
    SET occupied = TRUE
    WHERE stall_id = NEW.stall_id;
END//
DELIMITER ;

-- sets stall to unoccupied when reservation is deleted
    -- sets occpied stall to free when reservation is deleted

DELIMITER //
CREATE TRIGGER `unoccupy_stall_on_reservation_delete`
AFTER DELETE ON reservations
FOR EACH ROW
BEGIN
    UPDATE parking_stalls
    SET occupied = FALSE
    WHERE stall_id = OLD.stall_id;
END//
DELIMITER ;

-- make sure parking stall being reserved belongs to specified lot
    -- get lot_id from parking_stalls using stall_id and compare to lot_id in reservation for validation
DELIMITER //
CREATE TRIGGER `validate_stall_in_lot`
BEFORE INSERT ON reservations
FOR EACH ROW
BEGIN
    IF (SELECT lot_id FROM parking_stalls WHERE stall_id = NEW.stall_id) != NEW.lot_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This parking stall does not belong to the specified lot.';
    END IF;
END //
DELIMITER ;

-- make sure customer has valid permit for lot
    -- get permit from customer using customer_id and check if matches lot's permits
DELIMITER //
CREATE TRIGGER `validate_customer_permit`
BEFORE INSERT ON reservations
FOR EACH ROW
BEGIN
    IF (SELECT valid_permits FROM customers WHERE customer_id = NEW.customer_id) NOT IN 
        (SELECT valid_permits FROM parking_lot_valid_permits WHERE lot_id = NEW.lot_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer does not have valid permit for lot.';
    END IF;
END //
DELIMITER ;

-- update lot_capaccity when a new stall is inserted
    -- increments the lot_capacity on stall insertion
DELIMITER //
CREATE TRIGGER `update_lot_capacity_on_stall_insert`
AFTER INSERT ON parking_stalls
FOR EACH ROW
BEGIN
    UPDATE parking_lots
    SET lot_capacity = lot_capacity +1
    WHERE lot_id = NEW.lot_id;
END//
DELIMITER ;

-- update lot_capacity when a stall is deleted
    -- decrements the lot_capacity on stall deletion
DELIMITER //
CREATE TRIGGER `update_lot_capacity_on_stall_delete`
AFTER DELETE ON parking_stalls
FOR EACH ROW
BEGIN
    UPDATE parking_lots
    SET lot_capacity = lot_capacity -1
    WHERE lot_id = OLD.lot_id;
END//
DELIMITER ;

-- update stall occupancy when reservation updates
    -- check if new stall is occupied
        -- free old stall and occupy new stall
DELIMITER //
CREATE TRIGGER `update_stall_occupancy_on_reservation_update`
BEFORE UPDATE ON reservations
FOR EACH ROW
BEGIN
    IF OLD.stall_id != NEW.stall_id THEN
        IF (SELECT occupied FROM parking_stalls WHERE stall_id = NEW.stall_id) = TRUE THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This parking stall is already occupied.';
        END IF;

        UPDATE parking_stalls
        SET occupied = FALSE
        WHERE stall_id = OLD.stall_id;

        UPDATE parking_stalls
        SET occupied = TRUE
        WHERE stall_id = NEW.stall_id;
    END IF;
END //
DELIMITER ;

-- events

DROP EVENT IF EXISTS `free_stalls_on_reservation_expiry`;

DELIMITER //
CREATE EVENT `free_stalls_on_reservation_expiry`
ON SCHEDULE EVERY 10 SECOND
DO
BEGIN
    -- free stall with no active reservation
    UPDATE parking_stalls
    SET occupied = FALSE
    WHERE stall_id NOT IN (
        SELECT stall_id FROM reservations WHERE stall_id IS NOT NULL AND start_time <= NOW() AND end_time > NOW()
    );

    -- occupy stall with active reservation
    UPDATE parking_stalls
    SET occupied = TRUE
    WHERE stall_id IN (
        SELECT stall_id FROM reservations WHERE start_time <= NOW() AND end_time > NOW()
    );
END //

DELIMITER ;