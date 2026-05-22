USE `bcit_parkly`;

-- automatically free stalls once their reservation end_time has passed
    -- runs every minute and unoccupies stalls whose reservation has expired
DELIMITER //
CREATE EVENT `free_stalls_on_reservation_expiry`
ON SCHEDULE EVERY 10 SECOND
DO
BEGIN
    UPDATE parking_stalls
    SET occupied = FALSE
    WHERE stall_id IN (
        SELECT stall_id FROM reservations WHERE end_time < NOW()
    )
    AND stall_id NOT IN (
        SELECT stall_id FROM reservations WHERE start_time <= NOW() AND end_time > NOW()
    );
END //
DELIMITER ;