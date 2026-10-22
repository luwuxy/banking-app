DELIMITER $$
CREATE PROCEDURE sp_createaccount(
  IN p_first_name VARCHAR(50),
  IN p_last_name VARCHAR(50),
  IN p_email VARCHAR(100),
  IN p_phone VARCHAR(20),
  IN p_address VARCHAR(255),
  IN p_username VARCHAR(50),
  IN p_password VARCHAR(255)
)
BEGIN
  DECLARE v_savings_number BIGINT;
  DECLARE v_checking_number BIGINT;
  DECLARE v_customer_id INT;

  INSERT INTO users (username, password, role)
  VALUES (p_username, p_password, 'customer');

  INSERT INTO customers (
    user_id,
    first_name,
    last_name,
    email,
    phone,
    address
  ) VALUES (
    LAST_INSERT_ID(),
    p_first_name,
    p_last_name,
    p_email,
    p_phone,
    p_address
  );

  SELECT COALESCE(MAX(account_number), 100000000) + 1
  INTO v_savings_number
  FROM accounts;

  SET v_checking_number = v_savings_number + 1;

  SET v_customer_id = LAST_INSERT_ID();

  INSERT INTO accounts (
    customer_id,
    account_number,
    account_type,
    balance,
    status
  )
  VALUES
  (v_customer_id, v_savings_number, 'Savings', 0.00, 'Active'),
  (v_customer_id, v_checking_number, 'Checking', 0.00, 'Active');
END $$

DELIMITER ;