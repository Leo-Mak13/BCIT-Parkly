USE `bcit_parkly`;

-- set delimiter to '//' (needed for triggers with multiple/if statements)
-- prevents inserting reservation for occupied parking stalls
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
CREATE TRIGGER `occupy_stall_on_reservation`
AFTER INSERT ON reservations
FOR EACH ROW
BEGIN
    UPDATE parking_stalls
    SET occupied = TRUE
    WHERE stall_id = NEW.stall_id;
END;

-- sets stall to unoccupied when reservation is deleted
CREATE TRIGGER `unoccupy_stall_on_reservation_delete`
AFTER DELETE ON reservations
FOR EACH ROW
BEGIN
    UPDATE parking_stalls
    SET occupied = FALSE
    WHERE stall_id = OLD.stall_id;
END;

-- make sure parking stall being reserved belongs to specified lot
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
DELIMITER //
CREATE TRIGGER `validate_customer_permit`
BEFORE INSERT ON reservations
FOR EACH ROW
BEGIN
    IF (SELECT permit_type FROM customers WHERE customer_id = NEW.customer_id) NOT IN 
        (SELECT permit_type FROM parking_lots WHERE lot_id = NEW.lot_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Customer does not have valid permit for lot.';
    END IF;
END //

