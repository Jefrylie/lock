-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 12, 2024 at 04:58 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `facelock`
--

-- --------------------------------------------------------

--
-- Table structure for table `connected_locks`
--

CREATE TABLE `connected_locks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lockId` bigint(20) UNSIGNED DEFAULT NULL,
  `userId` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `connected_locks`
--

INSERT INTO `connected_locks` (`id`, `lockId`, `userId`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `datasets`
--

CREATE TABLE `datasets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lockId` bigint(20) UNSIGNED DEFAULT NULL,
  `userId` bigint(20) UNSIGNED DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `locks`
--

CREATE TABLE `locks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` enum('uninitialized','operational') DEFAULT NULL,
  `dataset_pending` bigint(20) UNSIGNED DEFAULT NULL,
  `serial_no` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locks`
--

INSERT INTO `locks` (`id`, `name`, `status`, `dataset_pending`, `serial_no`, `model`, `username`, `password`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Lock 1', 'operational', NULL, 'FL1500001', 'FaseLock', 'admin', 'admin', '2024-12-12 02:27:46', '2024-12-12 05:56:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(2, '2024_11_11_070845_users', 1),
(3, '2024_11_11_071037_tokens', 1),
(4, '2024_11_11_071222_locks', 1),
(5, '2024_11_11_071343_token_session', 1),
(6, '2024_11_11_075418_connected_locks', 1),
(7, '2024_11_11_080501_unlock_history', 1),
(8, '2024_11_11_080953_dataset', 1);

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiry` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `purpose` varchar(255) NOT NULL,
  `userId` bigint(20) UNSIGNED DEFAULT NULL,
  `valid` tinyint(1) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `token_sessions`
--

CREATE TABLE `token_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `token` varchar(255) NOT NULL,
  `expiry` timestamp NULL DEFAULT current_timestamp(),
  `purpose` varchar(255) NOT NULL,
  `lockId` bigint(20) UNSIGNED DEFAULT NULL,
  `userId` bigint(20) UNSIGNED DEFAULT NULL,
  `valid` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `token_sessions`
--

INSERT INTO `token_sessions` (`id`, `token`, `expiry`, `purpose`, `lockId`, `userId`, `valid`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'pNtRz6tSo7Bp0GLQPpnIopNJM6LfXD2F', '2024-12-15 02:56:19', 'Login', NULL, 1, 1, '2024-12-11 22:56:43', '2024-12-12 02:56:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `unlock_histories`
--

CREATE TABLE `unlock_histories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `lockId` bigint(20) UNSIGNED DEFAULT NULL,
  `userId` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('pass','fail') DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `unlock_histories`
--

INSERT INTO `unlock_histories` (`id`, `lockId`, `userId`, `status`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'pass', '/lock/testing.jpg', '2024-12-12 06:03:59', '2024-12-12 06:03:59');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `image_profile_url` text DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `image_profile_url`, `email`, `password`, `phone`, `address`, `created_at`, `updated_at`) VALUES
(1, 'Testing', '01', NULL, 'Testing01@gmail.com', '$2y$12$VA67O.zMlKj1ATnDtHI6UeMKQpjkWrbEyd4jiB/gKkU105BjIeL/O', '081234567890', NULL, '2024-12-11 22:56:29', '2024-12-11 22:56:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `connected_locks`
--
ALTER TABLE `connected_locks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `connected_locks_lockid_foreign` (`lockId`),
  ADD KEY `connected_locks_userid_foreign` (`userId`);

--
-- Indexes for table `datasets`
--
ALTER TABLE `datasets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `datasets_lockid_foreign` (`lockId`),
  ADD KEY `datasets_userid_foreign` (`userId`);

--
-- Indexes for table `locks`
--
ALTER TABLE `locks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `locks_dataset_pending_foreign` (`dataset_pending`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tokens_userid_foreign` (`userId`);

--
-- Indexes for table `token_sessions`
--
ALTER TABLE `token_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `token_sessions_lockid_foreign` (`lockId`),
  ADD KEY `token_sessions_userid_foreign` (`userId`);

--
-- Indexes for table `unlock_histories`
--
ALTER TABLE `unlock_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `unlock_histories_lockid_foreign` (`lockId`),
  ADD KEY `unlock_histories_userid_foreign` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `connected_locks`
--
ALTER TABLE `connected_locks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `datasets`
--
ALTER TABLE `datasets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `locks`
--
ALTER TABLE `locks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `token_sessions`
--
ALTER TABLE `token_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `unlock_histories`
--
ALTER TABLE `unlock_histories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `connected_locks`
--
ALTER TABLE `connected_locks`
  ADD CONSTRAINT `connected_locks_lockid_foreign` FOREIGN KEY (`lockId`) REFERENCES `locks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `connected_locks_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `datasets`
--
ALTER TABLE `datasets`
  ADD CONSTRAINT `datasets_lockid_foreign` FOREIGN KEY (`lockId`) REFERENCES `locks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `datasets_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `locks`
--
ALTER TABLE `locks`
  ADD CONSTRAINT `locks_dataset_pending_foreign` FOREIGN KEY (`dataset_pending`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `token_sessions`
--
ALTER TABLE `token_sessions`
  ADD CONSTRAINT `token_sessions_lockid_foreign` FOREIGN KEY (`lockId`) REFERENCES `locks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `token_sessions_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `unlock_histories`
--
ALTER TABLE `unlock_histories`
  ADD CONSTRAINT `unlock_histories_lockid_foreign` FOREIGN KEY (`lockId`) REFERENCES `locks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `unlock_histories_userid_foreign` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
