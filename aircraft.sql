-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 06, 2020 at 01:56 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aircraft`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id_admin` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id_admin`, `name`, `email`, `password`) VALUES
(1, 'Admin1', 'admin@admin.com', '12345');

-- --------------------------------------------------------

--
-- Table structure for table `aircraft`
--

CREATE TABLE `aircraft` (
  `id_aircraft` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `manufacturer` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `stock` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `aircraft`
--

INSERT INTO `aircraft` (`id_aircraft`, `name`, `manufacturer`, `type`, `price`, `stock`) VALUES
(1, 'Lockheed Martin F-22 Raptor', 'Lockheed Martin', 'Military', '$150 Millions', 99),
(2, 'Lockheed Martin F-35 Lightning II', 'Lockheed Martin', 'Military', '$122 Millions', 99),
(3, 'Fairchild Republic A-10 Thunderbolt II Warthog', 'Fairchild Republic', 'Military', '$11,8 Million', 100);

-- --------------------------------------------------------

--
-- Table structure for table `pay_method`
--

CREATE TABLE `pay_method` (
  `id_pm` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pay_method`
--

INSERT INTO `pay_method` (`id_pm`, `name`) VALUES
(1, 'Bank BNI'),
(2, 'Bank BCA');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id_ts` bigint(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_aircraft` bigint(20) NOT NULL,
  `id_user` bigint(20) NOT NULL,
  `id_pm` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `trsexp`
--

CREATE TABLE `trsexp` (
  `id_ts` bigint(20) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_aircraft` bigint(20) NOT NULL,
  `id_admin` bigint(20) NOT NULL,
  `id_pm` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `trsexp`
--

INSERT INTO `trsexp` (`id_ts`, `date`, `id_aircraft`, `id_admin`, `id_pm`) VALUES
(2, '2020-03-06 07:31:18', 3, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `name`, `email`, `password`) VALUES
(1, 'firman', 'firman@firman.com', '12345'),
(2, 'ferdi', 'ferdi@ferdi.com', '12345'),
(3, 'Akhtar', 'akhtar@akhtar.com', '12345');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indexes for table `aircraft`
--
ALTER TABLE `aircraft`
  ADD PRIMARY KEY (`id_aircraft`);

--
-- Indexes for table `pay_method`
--
ALTER TABLE `pay_method`
  ADD PRIMARY KEY (`id_pm`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id_ts`),
  ADD KEY `id_aircraft` (`id_aircraft`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_pm` (`id_pm`);

--
-- Indexes for table `trsexp`
--
ALTER TABLE `trsexp`
  ADD PRIMARY KEY (`id_ts`),
  ADD KEY `id_aircraft` (`id_aircraft`),
  ADD KEY `id_admin` (`id_admin`),
  ADD KEY `id_pm` (`id_pm`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `aircraft`
--
ALTER TABLE `aircraft`
  MODIFY `id_aircraft` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pay_method`
--
ALTER TABLE `pay_method`
  MODIFY `id_pm` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id_ts` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trsexp`
--
ALTER TABLE `trsexp`
  MODIFY `id_ts` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transaction`
--
ALTER TABLE `transaction`
  ADD CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`id_aircraft`) REFERENCES `aircraft` (`id_aircraft`),
  ADD CONSTRAINT `transaction_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `transaction_ibfk_3` FOREIGN KEY (`id_pm`) REFERENCES `pay_method` (`id_pm`);

--
-- Constraints for table `trsexp`
--
ALTER TABLE `trsexp`
  ADD CONSTRAINT `trsexp_ibfk_1` FOREIGN KEY (`id_aircraft`) REFERENCES `aircraft` (`id_aircraft`),
  ADD CONSTRAINT `trsexp_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admin` (`id_admin`),
  ADD CONSTRAINT `trsexp_ibfk_3` FOREIGN KEY (`id_pm`) REFERENCES `pay_method` (`id_pm`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
