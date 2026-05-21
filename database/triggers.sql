USE `bcit_parkly`;

-- set delimiter to '//' (needed for triggers with multiple/if statements)
-- prevents inserting reservation for occupied parking stalls
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
CREATE TRIGGER `occupy_stall_on_reservation`
AFTER INSERT ON reservations
FOR EACH ROW
BEGIN
    UPDATE parking_stalls
    SET occupied = TRUE
    WHERE stall_id = NEW.stall_id;
END;

-- sets stall to unoccupied when reservation is deleted
    -- sets occpied stall to free when reservation is deleted
CREATE TRIGGER `unoccupy_stall_on_reservation_delete`
AFTER DELETE ON reservations
FOR EACH ROW
BEGIN
    UPDATE parking_stalls
    SET occupied = FALSE
    WHERE stall_id = OLD.stall_id;
END;

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
CREATE TRIGGER `update_lot_capacity_on_stall_insert`
AFTER INSERT ON parking_stalls
FOR EACH ROW
BEGIN
    UPDATE parking_lots
    SET lot_capacity = lot_capacity +1
    WHERE lot_id = NEW.lot_id;
END;

-- update lot_capacity when a stall is deleted
    -- decrements the lot_capacity on stall deletion
CREATE TRIGGER `update_lot_capacity_on_stall_delete`
AFTER DELETE ON parking_stalls
FOR EACH ROW
BEGIN
    UPDATE parking_lots
    SET lot_capacity = lot_capacity -1
    WHERE lot_id = OLD.lot_id;
END;

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