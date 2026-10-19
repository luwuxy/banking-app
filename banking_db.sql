-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2026 at 01:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `banking_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_deposit` (IN `p_account_number` VARCHAR(20), IN `p_amount` DECIMAL(12,2), IN `p_description` VARCHAR(255))   BEGIN
    DECLARE v_account_id INT;

    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Deposit amount must be greater than zero';
    END IF;

    SELECT account_id
    INTO v_account_id
    FROM accounts
    WHERE account_number = p_account_number
        AND status = 'Active';

    IF v_account_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Account not found or inactive';
    ELSE
        UPDATE accounts
        SET balance = balance + p_amount
        WHERE account_id = v_account_id;

        INSERT INTO transactions (
            account_id, transaction_type, amount, description
        )
        VALUES (
            v_account_id, 'Deposit', p_amount, p_description
        );
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_withdraw` (IN `p_account_number` VARCHAR(20), IN `p_amount` DECIMAL(12,2), IN `p_description` VARCHAR(255))   BEGIN
    DECLARE v_account_id INT;
    DECLARE v_balance DECIMAL(12,2);

    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Withdrawal amount must be greater than zero';
    END IF;

    SELECT account_id, balance
    INTO v_account_id, v_balance
    FROM accounts
    WHERE account_number = p_account_number
      AND status = 'Active';

    IF v_account_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Account not found or inactive';
    ELSEIF v_balance < p_amount THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficent balance';
    ELSE
        UPDATE accounts
        SET balance = balance - p_amount
        WHERE account_id = v_account_id;

        INSERT INTO transactions (
            account_id, transaction_type, amount, description )
        VALUES (
            v_account_id, 'Withdrawal', p_amount, p_description
        );
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `account_number` varchar(20) NOT NULL,
  `account_type` enum('Savings','Checking') DEFAULT 'Savings',
  `balance` decimal(12,2) DEFAULT 0.00,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `customer_id`, `account_number`, `account_type`, `balance`, `status`, `created_at`) VALUES
(1, 1, '100000001', 'Savings', 0.00, 'Active', '2026-10-14 11:16:02'),
(2, 1, '100000002', 'Checking', 0.00, 'Active', '2026-10-14 11:16:02'),
(3, 2, '100000003', 'Savings', 0.00, 'Active', '2026-10-14 11:16:02'),
(4, 3, '100000004', 'Savings', 0.00, 'Active', '2026-10-14 11:16:02'),
(5, 4, '100000005', 'Checking', 0.00, 'Active', '2026-10-14 11:16:02'),
(6, 5, '100000006', 'Savings', 0.00, 'Active', '2026-10-14 11:16:02');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`customer_id`, `user_id`, `first_name`, `last_name`, `email`, `phone`, `address`, `created_at`) VALUES
(1, 2, 'Juan', 'Dela Cruz', 'juan@gmail.com', '09171234567', 'Makati City', '2026-10-14 11:11:04'),
(2, 3, 'Maria', 'Santos', 'maria@gmail.com', '09181234567', 'Quezon City', '2026-10-14 11:11:04'),
(3, 4, 'Pedro', 'Reyes', 'pedro@gmail.com', '09191234567', 'Pasig City', '2026-10-14 11:11:04'),
(4, 5, 'Ana', 'Garcia', 'ana@gmail.com', '09201234567', 'Manila City', '2026-10-14 11:11:04'),
(5, 6, 'Carlos', 'Mendoza', 'carlos@gmail.com', '09211234567', 'Taguig City', '2026-10-14 11:11:04');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `transaction_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `transaction_type` enum('Deposit','Withdrawal') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', 'admin123', 'admin', '2026-10-14 11:09:20'),
(2, 'juan', 'juan123', 'customer', '2026-10-14 11:09:38'),
(3, 'maria', 'maria123', 'customer', '2026-10-14 11:09:38'),
(4, 'pedro', 'pedro123', 'customer', '2026-10-14 11:09:38'),
(5, 'ana', 'ana123', 'customer', '2026-10-14 11:09:38'),
(6, 'carlos', 'carlos123', 'customer', '2026-10-14 11:09:38');

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_customer_accounts`
-- (See below for the actual view)
--
CREATE TABLE `vw_customer_accounts` (
`user_id` int(11)
,`username` varchar(50)
,`customer_id` int(11)
,`first_name` varchar(50)
,`last_name` varchar(50)
,`email` varchar(100)
,`phone` varchar(20)
,`address` varchar(255)
,`account_id` int(11)
,`account_number` varchar(20)
,`account_type` enum('Savings','Checking')
,`balance` decimal(12,2)
,`status` enum('Active','Inactive')
,`account_created` timestamp
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `vw_transaction_history`
-- (See below for the actual view)
--
CREATE TABLE `vw_transaction_history` (
`transaction_id` int(11)
,`account_number` varchar(20)
,`customer_id` int(11)
,`first_name` varchar(50)
,`last_name` varchar(50)
,`transaction_type` enum('Deposit','Withdrawal')
,`amount` decimal(12,2)
,`description` varchar(255)
,`transaction_date` timestamp
);

-- --------------------------------------------------------

--
-- Structure for view `vw_customer_accounts`
--
DROP TABLE IF EXISTS `vw_customer_accounts`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_customer_accounts`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`username` AS `username`, `c`.`customer_id` AS `customer_id`, `c`.`first_name` AS `first_name`, `c`.`last_name` AS `last_name`, `c`.`email` AS `email`, `c`.`phone` AS `phone`, `c`.`address` AS `address`, `a`.`account_id` AS `account_id`, `a`.`account_number` AS `account_number`, `a`.`account_type` AS `account_type`, `a`.`balance` AS `balance`, `a`.`status` AS `status`, `a`.`created_at` AS `account_created` FROM ((`users` `u` join `customers` `c` on(`u`.`user_id` = `c`.`user_id`)) join `accounts` `a` on(`c`.`customer_id` = `a`.`customer_id`)) ;

-- --------------------------------------------------------

--
-- Structure for view `vw_transaction_history`
--
DROP TABLE IF EXISTS `vw_transaction_history`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_transaction_history`  AS SELECT `t`.`transaction_id` AS `transaction_id`, `a`.`account_number` AS `account_number`, `c`.`customer_id` AS `customer_id`, `c`.`first_name` AS `first_name`, `c`.`last_name` AS `last_name`, `t`.`transaction_type` AS `transaction_type`, `t`.`amount` AS `amount`, `t`.`description` AS `description`, `t`.`transaction_date` AS `transaction_date` FROM ((`transactions` `t` join `accounts` `a` on(`t`.`account_id` = `a`.`account_id`)) join `customers` `c` on(`a`.`customer_id` = `c`.`customer_id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `account_number` (`account_number`),
  ADD KEY `fk_account_customer` (`customer_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`),
  ADD KEY `fk_customer_user` (`user_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`transaction_id`),
  ADD KEY `fk_transaction_account` (`account_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `transaction_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `fk_account_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `fk_customer_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `fk_transaction_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;