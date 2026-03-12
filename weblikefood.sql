-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th3 11, 2026 lúc 10:03 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `weblikefood`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `activesession`
--

CREATE TABLE `activesession` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `sessionToken` varchar(512) NOT NULL,
  `ipAddress` varchar(64) DEFAULT NULL,
  `deviceInfo` varchar(256) DEFAULT NULL,
  `browserName` varchar(64) DEFAULT NULL,
  `lastSeen` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `address`
--

CREATE TABLE `address` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `address` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `state` varchar(191) DEFAULT NULL,
  `zipCode` varchar(191) NOT NULL,
  `country` varchar(191) NOT NULL DEFAULT 'USA',
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `address`
--

INSERT INTO `address` (`id`, `userId`, `fullName`, `phone`, `address`, `city`, `state`, `zipCode`, `country`, `isDefault`, `createdAt`, `updatedAt`) VALUES
('cmml2v6i0000jq7ywtfbnpwew', '1', 'Trần Quốc Vũ', '0869226687', '76 Đường 494 ', 'Hồ Chí Minh', 'Thủ Đức', '23456', 'USA', 1, '2026-03-10 20:43:45.192', '2026-03-10 20:43:45.192');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `aiknowledge`
--

CREATE TABLE `aiknowledge` (
  `id` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `question` text DEFAULT NULL,
  `answer` longtext NOT NULL,
  `keywords` varchar(191) DEFAULT NULL,
  `language` varchar(191) NOT NULL DEFAULT 'vi',
  `priority` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `banner`
--

CREATE TABLE `banner` (
  `id` varchar(191) NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `subtitle` varchar(191) DEFAULT NULL,
  `ctaText` varchar(191) DEFAULT NULL,
  `ctaLink` varchar(191) DEFAULT NULL,
  `startAt` datetime(3) DEFAULT NULL,
  `endAt` datetime(3) DEFAULT NULL,
  `priority` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `placement` varchar(191) NOT NULL DEFAULT 'home',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `behaviorevent`
--

CREATE TABLE `behaviorevent` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `sessionId` varchar(191) NOT NULL,
  `eventType` varchar(191) NOT NULL,
  `eventData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`eventData`)),
  `url` varchar(500) DEFAULT NULL,
  `referrer` varchar(500) DEFAULT NULL,
  `deviceType` varchar(191) NOT NULL DEFAULT 'desktop',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `behaviorevent`
--

INSERT INTO `behaviorevent` (`id`, `userId`, `sessionId`, `eventType`, `eventData`, `url`, `referrer`, `deviceType`, `createdAt`) VALUES
('cmml2js4m0000q7yweywqsjnn', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 20:34:53.350'),
('cmml2jupe0001q7ywhje99qkj', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 20:34:56.690'),
('cmml2rn1r0006q7ywo4iz84f7', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 20:41:00.015'),
('cmml2rn6b0007q7ywejaxg254', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 20:41:00.179'),
('cmml2sbm40008q7ywrdlxnr2n', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 20:41:31.853'),
('cmml2sc3h0009q7ywsn617m0q', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 20:41:32.478'),
('cmml2stp7000dq7ywazpug3ne', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 20:41:55.291'),
('cmml2su82000eq7ywrwrptg3s', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 20:41:55.970'),
('cmml2sul1000fq7ywlhy2q7o1', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-10 20:41:56.437'),
('cmml2suxy000gq7ywd4037vl1', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-10 20:41:56.903'),
('cmml2t21f000hq7ywha91jpjo', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/profile', '', 'desktop', '2026-03-10 20:42:06.099'),
('cmml2ve5j000kq7ywcf81qt12', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/profile/orders', '', 'desktop', '2026-03-10 20:43:55.111'),
('cmml2vhk2000lq7yw3y3ip9nd', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/profile', '', 'desktop', '2026-03-10 20:43:59.522'),
('cmml2vm8p000mq7yw6k6gfsrv', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/profile/wishlist', '', 'desktop', '2026-03-10 20:44:05.594'),
('cmml2vo72000nq7yw4e8nq9ou', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/profile', '', 'desktop', '2026-03-10 20:44:08.127'),
('cmml2vsxq000oq7yw11ef0rc9', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/notifications', '', 'desktop', '2026-03-10 20:44:14.267'),
('cmml2vxr9000pq7ywogkcucf4', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/profile', '', 'desktop', '2026-03-10 20:44:20.517'),
('cmml2wam6000qq7ywrg90oymh', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/about', '', 'desktop', '2026-03-10 20:44:37.181'),
('cmml2wmxu000rq7ywtrgujvg3', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/contact', '', 'desktop', '2026-03-10 20:44:53.150'),
('cmml2xwd1000sq7yw7xtvx0ym', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/about', '', 'desktop', '2026-03-10 20:45:52.021'),
('cmml30q70000tq7ywgajrrbzk', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/posts', '', 'desktop', '2026-03-10 20:48:03.992'),
('cmml30xzb000uq7yw5u3sufi1', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/contact', '', 'desktop', '2026-03-10 20:48:14.087'),
('cmml311uk000vq7ywne5fow5t', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/profile', '', 'desktop', '2026-03-10 20:48:19.100'),
('cmml31gdz000wq7yw5nj5kai3', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-10 20:48:37.943'),
('cmml35teb000xq7ywe7lkwqiu', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/flash-sale', '', 'desktop', '2026-03-10 20:52:01.426'),
('cmml361p7000yq7ywpneagdfb', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/vouchers', '', 'desktop', '2026-03-10 20:52:12.187'),
('cmml365hf000zq7ywiv5s9ouf', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/profile/vouchers', '', 'desktop', '2026-03-10 20:52:17.091'),
('cmml36cmi0010q7ywhpck55jl', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/compare', '', 'desktop', '2026-03-10 20:52:26.346'),
('cmml38qde0011q7ywpfcrzrdo', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/faq', '', 'desktop', '2026-03-10 20:54:17.475'),
('cmml3bgu20012q7ywqvzs0gt2', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-10 20:56:25.083'),
('cmml3bw4w0013q7ywjqcc1fde', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/products?category=C%C3%A1%20kh%C3%B4', '', 'desktop', '2026-03-10 20:56:44.912'),
('cmml3i62r0014q7yw2w5nrrye', NULL, 'session_1773174802236_dk0hfkgks', 'chatbot_message', '{\"message\":\"tôi muốn tìm hiểu về trà ổi hồng\",\"intent\":\"PRODUCT_SEARCH\",\"response\":\"Bạn vừa tìm \\\"tôi muốn tìm hiểu về trà ổi hồng\\\". Hiện mình chưa có sản phẩm khớp đúng; bạn thử xem các nhóm như Cá khô, Gia vị Việt, Khác, Tôm & Mực khô, Trà & Bánh mứt, Trái cây sấy hoặc gõ tên món cụ thể (ví dụ: trà sen, cá khô, nước mắm).\"}', NULL, NULL, 'desktop', '2026-03-10 21:01:37.731'),
('cmml3jr9q0015q7ywn5aqt1sh', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/products?category=Gia+v%E1%BB%8B+Vi%E1%BB%87t', '', 'desktop', '2026-03-10 21:02:51.854'),
('cmml3jrey0016q7ywjfk1aa3y', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/products?category=Gia+v%E1%BB%8B+Vi%E1%BB%87t', '', 'desktop', '2026-03-10 21:02:52.043'),
('cmml3jt6f0017q7ywh0hr0r5j', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-10 21:02:54.328'),
('cmml3jv2d0018q7ywhxsqc3cu', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/products', '', 'desktop', '2026-03-10 21:02:56.773'),
('cmml3jxsk0019q7ywvjjfjckq', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/about', '', 'desktop', '2026-03-10 21:03:00.309'),
('cmml3jzpd001aq7yw1luil33x', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-10 21:03:02.786'),
('cmml3k1f6001bq7ywz9n0c7b9', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/vouchers', '', 'desktop', '2026-03-10 21:03:05.011'),
('cmml3k1ma001cq7ywozy7vuw9', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/profile/vouchers', '', 'desktop', '2026-03-10 21:03:05.266'),
('cmml3k2m5001dq7ywy3144ykf', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/compare', '', 'desktop', '2026-03-10 21:03:06.557'),
('cmml3k4eq001eq7ywrllyd40o', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-10 21:03:08.882'),
('cmml3r5hn001fq7ywgekdpc35', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:08:36.875'),
('cmml3r6c9001gq7ywm902tgyo', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:08:37.978'),
('cmml3r7ex001hq7ywpk4lzejo', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:08:39.369'),
('cmml3r7mo001iq7ywm29oaoqc', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:08:39.649'),
('cmml3sphg001jq7ywcfmau4lr', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:09:49.445'),
('cmml3spnr001kq7ywe4ew89eg', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:09:49.671'),
('cmml3sr90001lq7ywktzvd6e7', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:09:51.732'),
('cmml3srmd001mq7ywklvxkepy', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:09:52.213'),
('cmml3w3le001nq7ywaqtcm1rt', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:12:27.698'),
('cmml3w3mb001oq7ywpadkyvuy', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:12:27.732'),
('cmml3w426001pq7yw09mfbaq1', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:12:28.302'),
('cmml3w4cy001qq7ywnyty4f05', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:12:28.691'),
('cmml3wckm001rq7ywelrgmhdm', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:12:39.334'),
('cmml3wcl4001sq7ywb7zwwmy0', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:12:39.353'),
('cmml3wd0s001tq7yw459ek3x2', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:12:39.916'),
('cmml3we47001uq7ywtxrdadn8', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:12:41.335'),
('cmml3y3a0001vq7ywif5ovruu', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/flash-sale', 'http://localhost:3000/', 'desktop', '2026-03-10 21:14:00.601'),
('cmml3ybpa001wq7yw5rch4oje', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:14:11.518'),
('cmml3z5ek001xq7ywxv8fgkfk', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:14:50.012'),
('cmml3z6da001yq7yw1kx4vp7x', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:14:51.263'),
('cmml4izaa001zq7ywzz09rmdo', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:30:15.202'),
('cmml4izb80020q7ywba1uz3bu', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:30:15.236'),
('cmml4izgh0021q7ywr52m86v2', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:30:15.425'),
('cmml4izgu0022q7ywz1v4bz3o', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:30:15.438'),
('cmml4j8mg0023q7ywkooa4234', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:30:27.304'),
('cmml4j8q80024q7ywrxh1qweo', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:30:27.441'),
('cmml4j8qs0025q7ywocd83ul7', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:30:27.461'),
('cmml4j8vq0026q7yw9nk7wofs', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:30:27.638'),
('cmml4jupw0027q7ywy4rm3qyo', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:30:55.941'),
('cmml4jus50028q7yw8la6o6f2', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-10 21:30:56.021'),
('cmmlhgtln0029q7ywnrxoqxeu', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:32:29.531'),
('cmmlhgu6m002aq7yw0j7zff58', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:32:30.287'),
('cmmlhitxd002bq7ywpb759pu0', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:34:03.265'),
('cmmlhiux1002cq7ywxtvfdojr', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:34:04.549'),
('cmmlhladh002dq7ywnnleacxn', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:35:57.893'),
('cmmlhlahe002eq7yw681elqup', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:35:58.035'),
('cmmlhlapx002fq7ywn5udksil', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:35:58.341'),
('cmmlhlaut002gq7ywsvl4y9no', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:35:58.517'),
('cmmlhm64e002hq7ywx25tcaze', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:36:39.038'),
('cmmlhm6py002iq7yw3lrdnf5i', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:36:39.814'),
('cmmlhp45c002jq7ywu15904eg', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:38:56.448'),
('cmmlhp4q7002kq7yw63wmb9qj', NULL, 'session_1773174802236_dk0hfkgks', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:38:57.199'),
('cmmlhx0m50000q7mwfryecjad', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', '', 'desktop', '2026-03-11 03:45:05.117'),
('cmmlhx4ox0001q7mw7xlns7ao', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/', '', 'desktop', '2026-03-11 03:45:10.401'),
('cmmlhx4yi0002q7mwyquefn68', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', '', 'desktop', '2026-03-11 03:45:10.746'),
('cmmlhx5kj002lq7yw1w47q4vh', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:45:11.540'),
('cmmlhxhiy002mq7yw01s3ht8f', NULL, 'session_1773175314504_w9sx2zl9o', 'page_view', '{}', 'http://localhost:3000/', 'http://localhost:3000/', 'desktop', '2026-03-11 03:45:26.989'),
('cmmlhxp780003q7mws9artyic', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/', '', 'desktop', '2026-03-11 03:45:36.925'),
('cmmli06gc0004q7mwwbqhoby0', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 03:47:32.652'),
('cmmli07160005q7mwz0m4q4d1', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 03:47:33.402'),
('cmmli08z70006q7mwl7lcizqk', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 03:47:35.924'),
('cmmli09ft0007q7mw85u1yh81', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 03:47:36.521'),
('cmmli2dm80008q7mwxdm55ndb', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 03:49:15.249'),
('cmmli2dtk0009q7mw6xoannrh', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 03:49:15.512'),
('cmmli2fds000aq7mwr0qk5uzz', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 03:49:17.536'),
('cmmli2fzo000bq7mwhfsdau8m', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 03:49:18.325'),
('cmmli69pf000cq7mwmhgk1r8h', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/checkout', 'http://localhost:3001/', 'desktop', '2026-03-11 03:52:16.803'),
('cmmlina5d000dq7mwwqsalnkv', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:05:30.529'),
('cmmlinaq1000eq7mwkifmtmma', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:05:31.273'),
('cmmlincwq000fq7mwindsvebr', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/checkout', 'http://localhost:3001/checkout', 'desktop', '2026-03-11 04:05:34.106'),
('cmmlind4j000gq7mwsal1sa0j', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/checkout', 'http://localhost:3001/checkout', 'desktop', '2026-03-11 04:05:34.388'),
('cmmlinwje000hq7mwqv2wtvh1', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:05:59.546'),
('cmmlinwoy000iq7mwwz13hd0l', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:05:59.746'),
('cmmliny40000jq7mw496cbe1t', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/checkout', 'http://localhost:3001/checkout', 'desktop', '2026-03-11 04:06:01.584'),
('cmmliny6a000kq7mw6nfo6zty', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/checkout', 'http://localhost:3001/checkout', 'desktop', '2026-03-11 04:06:01.667'),
('cmmliryjj000lq7mw1jybbj35', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:09:08.761'),
('cmmlis0x8000mq7mw8div2nnf', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:09:11.852'),
('cmmlis89a000nq7mwtoybg8ly', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/checkout', 'http://localhost:3001/checkout', 'desktop', '2026-03-11 04:09:21.357'),
('cmmlis8ia000oq7mwjv0sj3oo', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/checkout', 'http://localhost:3001/checkout', 'desktop', '2026-03-11 04:09:21.682'),
('cmmliu7v1000pq7mwuxkj5w4j', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/checkout', 'http://localhost:3001/checkout', 'desktop', '2026-03-11 04:10:54.158'),
('cmmliu7zi000qq7mwhj329jc6', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/checkout', 'http://localhost:3001/checkout', 'desktop', '2026-03-11 04:10:54.318'),
('cmmljdtkb000tq7mwcu6es8le', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:26:08.748'),
('cmmljdtoh000uq7mwtkvv0vus', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:26:08.897'),
('cmmljw3gu0012q7mw9k21wqzt', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:40:21.390'),
('cmmljw3z50013q7mwiadzo0p4', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:40:22.050'),
('cmmlk9w6c0014q7mwltvidsum', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:51:05.124'),
('cmmlk9xq90015q7mwagbm492d', NULL, 'session_1773200687588_fo3hoqm8e', 'page_view', '{}', 'http://localhost:3001/', 'http://localhost:3001/', 'desktop', '2026-03-11 04:51:07.137'),
('cmmll1b140016q7mwbvc2e73j', NULL, 'test123', 'chatbot_message', '{\"message\":\"Xin chào\",\"intent\":\"GREETING\",\"response\":\"Xin chào! Mình là trợ lý mua hàng của LIKEFOOD. Bạn đang tìm đặc sản Việt, quà biếu, hay cần tư vấn gì về sản phẩm nào đó?\"}', NULL, NULL, 'desktop', '2026-03-11 05:12:24.088'),
('cmmll3o800017q7mwtvix9coz', NULL, 'test-001', 'chatbot_message', '{\"message\":\"hello\",\"intent\":\"GREETING\",\"response\":\"Hello! I\'m LIKEFOOD\'s shopping assistant. Are you looking for Vietnamese specialties, gift ideas, or need advice on any products?\"}', NULL, NULL, 'desktop', '2026-03-11 05:14:14.497'),
('cmmll3yyk0018q7mwodxforqy', NULL, 'test-003', 'chatbot_message', '{\"message\":\"Toi muon tim san pham\",\"intent\":\"PRODUCT_SEARCH\",\"response\":\"Bạn tìm \\\"Toi muon\\\" nhưng mình chưa tìm thấy sản phẩm khớp chính xác. Bạn thử xem các nhóm: Cá khô, Gia vị Việt, Khác, Tôm & Mực khô, Trà & Bánh mứt, Trái cây sấy hoặc gõ tên món cụ thể hơn nhé!\"}', NULL, NULL, 'desktop', '2026-03-11 05:14:28.413'),
('cmmlm4dov0019q7mw9ldhlgsh', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/', '', 'desktop', '2026-03-11 05:42:47.119'),
('cmmlm4ehp001aq7mw7adskvkb', NULL, 'session_1773200696129_6cep79m4n', 'page_view', '{}', 'http://localhost:3001/', '', 'desktop', '2026-03-11 05:42:48.157'),
('cmmlrr1pf0000q7pgma81qvsk', NULL, 'session_1773217215128_9jytqco06', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-11 08:20:22.755'),
('cmmlrr1q90001q7pg11drol1b', NULL, 'session_1773217198908_1np5slbux', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-11 08:20:22.785'),
('cmmlrr2880002q7pgdrpl3zk4', NULL, 'session_1773217198908_1np5slbux', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-11 08:20:23.432'),
('cmmlrr2nf0003q7pgmgu2mgy6', NULL, 'session_1773217215128_9jytqco06', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-11 08:20:23.979'),
('cmmlsozov0006q7pgy4gervgs', NULL, 'session_1773217215128_9jytqco06', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-11 08:46:46.447'),
('cmmlsp4zu0007q7pg0ozsfp7t', NULL, 'session_1773217215128_9jytqco06', 'page_view', '{}', 'http://localhost:3000/', '', 'desktop', '2026-03-11 08:46:53.322');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brand`
--

CREATE TABLE `brand` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `guestToken` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cartitem`
--

CREATE TABLE `cartitem` (
  `id` varchar(191) NOT NULL,
  `cartId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `variantId` varchar(191) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contactmessage`
--

CREATE TABLE `contactmessage` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `subject` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversationhistory`
--

CREATE TABLE `conversationhistory` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `sessionId` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL,
  `message` longtext NOT NULL,
  `intent` varchar(191) DEFAULT NULL,
  `confidence` double DEFAULT NULL,
  `feedback` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `coupon`
--

CREATE TABLE `coupon` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `discountType` varchar(191) NOT NULL,
  `discountValue` double NOT NULL,
  `minOrderValue` double DEFAULT 0,
  `maxDiscount` double DEFAULT NULL,
  `startDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `endDate` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `usageLimit` int(11) DEFAULT NULL,
  `usedCount` int(11) NOT NULL DEFAULT 0,
  `category` varchar(191) NOT NULL DEFAULT 'all',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `emailcampaign`
--

CREATE TABLE `emailcampaign` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `triggerType` varchar(191) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `body` longtext NOT NULL,
  `language` varchar(191) NOT NULL DEFAULT 'vi',
  `segmentFilter` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`segmentFilter`)),
  `scheduledAt` datetime(3) DEFAULT NULL,
  `sentCount` int(11) NOT NULL DEFAULT 0,
  `openCount` int(11) NOT NULL DEFAULT 0,
  `clickCount` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `emailqueue`
--

CREATE TABLE `emailqueue` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `templateKey` varchar(191) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `priority` varchar(191) NOT NULL DEFAULT 'NORMAL',
  `scheduledAt` datetime(3) DEFAULT NULL,
  `sentAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flashsalecampaign`
--

CREATE TABLE `flashsalecampaign` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `startAt` datetime(3) NOT NULL,
  `endAt` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `flashsaleproduct`
--

CREATE TABLE `flashsaleproduct` (
  `id` varchar(191) NOT NULL,
  `campaignId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `flashSalePrice` double NOT NULL,
  `stockLimit` int(11) DEFAULT NULL,
  `soldCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loginhistory`
--

CREATE TABLE `loginhistory` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `ipAddress` varchar(64) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `country` varchar(64) DEFAULT NULL,
  `city` varchar(64) DEFAULT NULL,
  `isSuspicious` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `loginhistory`
--

INSERT INTO `loginhistory` (`id`, `userId`, `ipAddress`, `userAgent`, `country`, `city`, `isSuspicious`, `createdAt`) VALUES
('cmmgf61jf0003q7iwzrknulv7', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-07 14:29:16.490'),
('cmmgfgh990007q7iwt51t4tk9', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-07 14:37:23.422'),
('cmmgfnn8u000aq7iwlp60t7r8', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-07 14:42:57.775'),
('cmmgkebum0001q75oxdsz6x15', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-07 16:55:41.182'),
('cmmglo27a0003q75oucgzwtu8', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-07 17:31:14.855'),
('cmmgly5010005q75oiaik7qz3', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-07 17:39:05.041'),
('cmmhhe5sj0002q7xkrn3wdzdf', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-08 08:19:20.659'),
('cmmhhhhta0006q7xkrmwu50au', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-08 08:21:56.206'),
('cmmhhsa3a0008q7xkoeshr9ug', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-08 08:30:19.414'),
('cmmhi4g6m000bq7xkh34cpwng', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-08 08:39:47.182'),
('cmmhil9u3000eq7xk17jam8wn', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-08 08:52:52.107'),
('cmmhjhctm0008q7agqljzwo0l', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-08 09:17:48.970'),
('cmmhknscp0003q75o58ynhmym', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-08 09:50:48.649'),
('cmmhl1v1h0006q75okywyxihh', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-08 10:01:45.317'),
('cmmhxwlnb0003q7e4s8fbsme0', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-08 16:01:34.872'),
('cmmih6z1m0003q77kofsq6bj8', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-09 01:01:31.498'),
('cmmih6z1r0005q77kujcb0feo', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-09 01:01:31.503'),
('cmmiyh1bv0002q7rgvwmckjzf', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-09 09:05:14.491'),
('cmmj5b3oz0002q7i88wpdjse3', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-09 12:16:34.932'),
('cmmjbwfkm0003q7bw90ectd97', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-09 15:21:07.798'),
('cmml2rjx10005q7yw69y9t3ik', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-10 20:40:55.957'),
('cmml2ssmv000cq7ywje8ura5y', '1', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', NULL, NULL, 0, '2026-03-10 20:41:53.911');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `newslettersubscriber`
--

CREATE TABLE `newslettersubscriber` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `subscribedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notification`
--

CREATE TABLE `notification` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(191) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order`
--

CREATE TABLE `order` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `subtotal` double NOT NULL DEFAULT 0,
  `shippingFee` double NOT NULL DEFAULT 0,
  `discount` double NOT NULL DEFAULT 0,
  `total` double NOT NULL,
  `couponId` varchar(191) DEFAULT NULL,
  `couponCode` varchar(191) DEFAULT NULL,
  `shippingAddress` varchar(191) DEFAULT NULL,
  `shippingCity` varchar(191) DEFAULT NULL,
  `shippingZipCode` varchar(191) DEFAULT NULL,
  `shippingPhone` varchar(191) DEFAULT NULL,
  `shippingMethod` varchar(191) DEFAULT 'standard',
  `carrier` varchar(191) DEFAULT NULL,
  `trackingCode` varchar(191) DEFAULT NULL,
  `shippedAt` datetime(3) DEFAULT NULL,
  `deliveredAt` datetime(3) DEFAULT NULL,
  `paymentMethod` varchar(191) DEFAULT NULL,
  `paymentStatus` varchar(191) NOT NULL DEFAULT 'UNPAID',
  `paymentIntentId` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `pointsDiscount` double DEFAULT NULL,
  `pointsUsed` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderevent`
--

CREATE TABLE `orderevent` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `note` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderitem`
--

CREATE TABLE `orderitem` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `variantId` varchar(191) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` double NOT NULL,
  `nameSnapshot` varchar(191) DEFAULT NULL,
  `skuSnapshot` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `pointtransaction`
--

CREATE TABLE `pointtransaction` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `amount` int(11) NOT NULL,
  `type` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `orderId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `pointtransaction`
--

INSERT INTO `pointtransaction` (`id`, `userId`, `amount`, `type`, `description`, `orderId`, `createdAt`) VALUES
('cmmhyn6ey0005q7e4zhbh4r2t', '1', 10, 'EARN', 'Điểm danh hàng ngày', NULL, '2026-03-08 16:22:14.842'),
('cmmi09t920007q7e4bvesx99t', '1', 10, 'EARN', 'Điểm danh hàng ngày', NULL, '2026-03-08 17:07:50.486');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `post`
--

CREATE TABLE `post` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `summary` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `authorName` varchar(191) DEFAULT 'LIKEFOOD',
  `category` varchar(191) DEFAULT 'Tin tức',
  `isPublished` tinyint(1) NOT NULL DEFAULT 1,
  `publishedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `post`
--

INSERT INTO `post` (`id`, `title`, `slug`, `summary`, `content`, `image`, `authorName`, `category`, `isPublished`, `publishedAt`, `createdAt`, `updatedAt`) VALUES
('1', 'Cá Khô Tộ – Đặc Sản Miền Tây Chính Gốc Tại Nhà Bạn', 'ca-kho-to-dac-san-mien-tay-chinh-goc', 'Cá khô tộ là món ăn truyền thống đậm chất miền Tây Nam Bộ, được chế biến từ những con cá tươi ngon ướp gia vị và phơi nắng tự nhiên. Cùng khám phá bí quyết chọn và chế biến cá khô ngon đúng điệu.', '# Cá Khô Tộ – Đặc Sản Miền Tây Chính Gốc\n\nTrong ký ức của bao người Việt xa xứ, hình ảnh nồi cá khô tộ sôi sùng sục trên bếp lửa cùng mùi thơm lừng của nước mắm và tiêu đen là một phần không thể thiếu của tuổi thơ. Tại LIKEFOOD, chúng tôi mang đến cho bạn những mẻ cá khô chính gốc miền Tây, được chọn lựa kỹ càng từ các hộ ngư dân truyền thống.\n\n## Vì Sao Cá Khô LIKEFOOD Khác Biệt?\n\n- **100% tự nhiên**: Không chất bảo quản, không phẩm màu\n- **Phơi nắng tự nhiên**: Đúng quy trình truyền thống 2-3 ngày\n- **Đóng gói hút chân không**: Giữ hương vị tươi ngon đến 12 tháng\n- **Giao hàng toàn nước Mỹ**: Trong 2-3 ngày làm việc\n\n## Cách Kho Cá Ngon Đúng Điệu\n\n**Nguyên liệu:**\n- 300g cá khô (cá lóc, cá sặc rằn, hoặc cá tra)\n- 3 muỗng nước dừa tươi\n- Nước mắm ngon, đường, tiêu, ớt, hành tím\n\n**Thực hiện:**\n1. Cá khô ngâm nước ấm 15 phút cho mềm, để ráo\n2. Phi thơm hành tím với dầu ăn\n3. Cho cá vào kho cùng nước dừa, nước mắm và đường\n4. Để lửa nhỏ liu riu 30–40 phút cho cá thấm đều\n5. Thêm ớt và tiêu trước khi tắt bếp\n\nMón cá khô tộ dùng kèm cơm trắng nóng hổi, rau sống và canh chua là bữa cơm hoàn hảo mang hương vị quê nhà giữa lòng nước Mỹ.\n\n---\n\n*Đặt ngay tại LIKEFOOD để nhận cá khô chính gốc miền Tây, giao tận nhà trên toàn nước Mỹ!*', '/images/dacsan.png', 'LIKEFOOD', 'Ẩm thực', 1, '2026-03-01 08:00:00.000', '2026-03-08 16:11:05.040', '2026-03-09 08:06:43.619');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) DEFAULT NULL,
  `description` text NOT NULL,
  `price` double NOT NULL,
  `salePrice` double DEFAULT NULL,
  `saleStartAt` datetime(3) DEFAULT NULL,
  `saleEndAt` datetime(3) DEFAULT NULL,
  `isOnSale` tinyint(1) NOT NULL DEFAULT 0,
  `badgeText` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `category` varchar(191) NOT NULL,
  `inventory` int(11) NOT NULL DEFAULT 0,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `brandId` varchar(191) DEFAULT NULL,
  `originalPrice` double DEFAULT NULL,
  `tags` varchar(191) DEFAULT NULL,
  `ratingAvg` double NOT NULL DEFAULT 0,
  `ratingCount` int(11) NOT NULL DEFAULT 0,
  `soldCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `code` varchar(191) DEFAULT NULL,
  `weight` varchar(191) DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `name`, `slug`, `description`, `price`, `salePrice`, `saleStartAt`, `saleEndAt`, `isOnSale`, `badgeText`, `image`, `category`, `inventory`, `featured`, `brandId`, `originalPrice`, `tags`, `ratingAvg`, `ratingCount`, `soldCount`, `createdAt`, `updatedAt`, `code`, `weight`, `deletedAt`, `isDeleted`) VALUES
('1', 'BÁNH GỪNG TÁO ĐỎ DƯỠNG NHAN', 'banh-gung-tao-do-duong-nhan', '330g', 17, 14, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.811', '2026-03-09 18:03:36.559', NULL, '330g', NULL, 0),
('10', 'BỘT ĐẬU NÀNH', 'bot-dau-nanh', '500g', 22, 17, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.932', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('100', 'TÀU HỦ KI', 'tau-hu-ki', '500g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.319', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('101', 'TÉP KHÔ SẤY ĂN LIỀN', 'tep-kho-say-an-lien', '400g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Tôm & Mực khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.329', '2026-03-09 18:03:36.559', NULL, '400g', NULL, 0),
('102', 'TINH DẦU ĐR', 'tinh-dau-dr', '30g', 22, 17, NULL, NULL, 1, NULL, NULL, 'Gia vị Việt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.339', '2026-03-09 18:03:36.559', NULL, '30g', NULL, 0),
('103', 'TỎI ĐEN', 'toi-den', '120g', 16, 13, NULL, NULL, 1, NULL, NULL, 'Gia vị Việt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.353', '2026-03-09 18:03:36.559', NULL, '120g', NULL, 0),
('104', 'TÔM KHÔ', 'tom-kho', '500g', 54, 45, NULL, NULL, 1, NULL, NULL, 'Tôm & Mực khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.364', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('105', 'TRÀ ĐÔNG TRÙNG NGŨ VỊ', 'tra-dong-trung-ngu-vi', '20 gói', 20, 15, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.374', '2026-03-09 18:03:36.559', NULL, '20 gói', NULL, 0),
('106', 'TRÀ LIPTON CAM THẢO', 'tra-lipton-cam-thao', '470g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.387', '2026-03-09 18:03:36.559', NULL, '470g', NULL, 0),
('107', 'TRÀ NESTEA', 'tra-nestea', 'TRÀ NESTEA là một trong những đặc sản được khách hàng LIKEFOOD yêu thích, được tuyển chọn kỹ lưỡng từ những nhà cung cấp uy tín tại Việt Nam.\n\nSản phẩm thuộc nhóm \"Trà & Bánh mứt\", phù hợp để dùng trong bữa cơm gia đình hàng ngày, tiếp đãi bạn bè hoặc làm quà biếu tinh tế cho người thân nơi xa.\n\nTừng chi tiết từ hương vị, màu sắc đến cách đóng gói đều được chú trọng, giúp bạn yên tâm khi mang hương vị quê nhà đến bàn ăn tại Hoa Kỳ.', 13, 10, NULL, NULL, 1, NULL, '/uploads/339c2fc2-08cf-48af-9d16-45d2c128bf4a.png', 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.399', '2026-03-09 18:03:36.559', NULL, '200g', NULL, 0),
('108', 'TRÀ ỔI GIẢM CÂN', 'tra-oi-giam-can', 'TRÀ ỔI GIẢM CÂN là một trong những đặc sản được khách hàng LIKEFOOD yêu thích, được tuyển chọn kỹ lưỡng từ những nhà cung cấp uy tín tại Việt Nam.\n\nSản phẩm thuộc nhóm \"Trà & Bánh mứt\", phù hợp để dùng trong bữa cơm gia đình hàng ngày, tiếp đãi bạn bè hoặc làm quà biếu tinh tế cho người thân nơi xa.\n\nTừng chi tiết từ hương vị, màu sắc đến cách đóng gói đều được chú trọng, giúp bạn yên tâm khi mang hương vị quê nhà đến bàn ăn tại Hoa Kỳ.', 25, 21, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.412', '2026-03-09 18:03:36.559', NULL, 'Bịch', NULL, 0),
('109', 'TRÀ TÂM SEN', 'tra-tam-sen', '250g', 20, 17, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.422', '2026-03-09 18:03:36.559', NULL, '250g', NULL, 0),
('11', 'BỘT ĐẬU XANH HẠT SEN', 'bot-dau-xanh-hat-sen', '300g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.952', '2026-03-09 18:03:36.559', NULL, '300g', NULL, 0),
('110', 'TRÀ THẢO MỘC', 'tra-thao-moc', 'TRÀ THẢO MỘC là một trong những đặc sản được khách hàng LIKEFOOD yêu thích, được tuyển chọn kỹ lưỡng từ những nhà cung cấp uy tín tại Việt Nam.\n\nSản phẩm thuộc nhóm \"Chưa phân loại\", phù hợp để dùng trong bữa cơm gia đình hàng ngày, tiếp đãi bạn bè hoặc làm quà biếu tinh tế cho người thân nơi xa.\n\nTừng chi tiết từ hương vị, màu sắc đến cách đóng gói đều được chú trọng, giúp bạn yên tâm khi mang hương vị quê nhà đến bàn ăn tại Hoa Kỳ.', 20, 15, NULL, NULL, 1, NULL, '/uploads/c93ff88a-0417-416c-9a2b-b2081b9170d6.jpg', 'Trà & Bánh mứt', 1000, 1, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.435', '2026-03-09 18:03:36.559', NULL, '400g', NULL, 0),
('111', 'TRÀ VỊ ỔI HỒNG', 'tra-vi-oi-hong', 'TRÀ VỊ ỔI HỒNG là một trong những đặc sản được khách hàng LIKEFOOD yêu thích, được tuyển chọn kỹ lưỡng từ những nhà cung cấp uy tín tại Việt Nam.\n\nSản phẩm thuộc nhóm \"Chưa phân loại\", phù hợp để dùng trong bữa cơm gia đình hàng ngày, tiếp đãi bạn bè hoặc làm quà biếu tinh tế cho người thân nơi xa.\n\nTừng chi tiết từ hương vị, màu sắc đến cách đóng gói đều được chú trọng, giúp bạn yên tâm khi mang hương vị quê nhà đến bàn ăn tại Hoa Kỳ.', 14, 11, NULL, NULL, 1, NULL, '/uploads/3727f9b9-7a78-492e-b2cc-5f243a8d79d9.jpg', 'Trái cây sấy', 1000, 1, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.447', '2026-03-09 18:03:36.559', NULL, '240g', NULL, 0),
('12', 'BỘT RAU MÁ ĐẬU XANH', 'bot-rau-ma-dau-xanh', '500g', 22, 18, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.967', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('13', 'BỘT SỦI THANH NHIỆT DƯA GANG', 'bot-sui-thanh-nhiet-dua-gang', '100g', 14, 11, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.985', '2026-03-09 18:03:36.559', NULL, '100g', NULL, 0),
('14', 'CÁ CƠM CHIÊN MẮM', 'ca-com-chien-mam', '500g', 22, 18, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.999', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('15', 'CÁ ĐÙ 1 NẮNG', 'ca-du-1-nang', '500g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.014', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('16', 'CÁ ĐÙ CHÁY TỎI', 'ca-du-chay-toi', '200g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.025', '2026-03-09 18:03:36.559', NULL, '200g', NULL, 0),
('17', 'CÁ DỨA 1 NẮNG', 'ca-dua-1-nang', '1kg', 40, 32, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.036', '2026-03-09 18:03:36.559', NULL, '1kg', NULL, 0),
('18', 'CÁ ĐUỐI CHIÊN GIÒN SỐT BƠ TỎI', 'ca-duoi-chien-gion-sot-bo-toi', '300g', 18, 15, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.050', '2026-03-09 18:03:36.559', NULL, '300g', NULL, 0),
('19', 'CÁ ĐUỐI TẨM ĂN LIỀN', 'ca-duoi-tam-an-lien', '330g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.064', '2026-03-09 18:03:36.559', NULL, '330g', NULL, 0),
('2', 'BÁNH MOCHI', 'banh-mochi', '120g,8c', 10, 8, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.832', '2026-03-09 18:03:36.559', NULL, '120g,8c', NULL, 0),
('20', 'CÁ THIỀU NƯỚNG TẨM', 'ca-thieu-nuong-tam', '330g', 20, 17, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.080', '2026-03-09 18:03:36.559', NULL, '330g', NULL, 0),
('21', 'CAFE COLLAGEN', 'cafe-collagen', '250g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.098', '2026-03-09 18:03:36.559', NULL, '250g', NULL, 0),
('22', 'CAFE GIẢM CÂN', 'cafe-giam-can', '200g', 12, 9, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.115', '2026-03-09 18:03:36.559', NULL, '200g', NULL, 0),
('23', 'CAFE KHOAI MÔN', 'cafe-khoai-mon', '270g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.135', '2026-03-09 18:03:36.559', NULL, '270g', NULL, 0),
('24', 'CAFE MUỐI', 'cafe-muoi', '250g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.147', '2026-03-09 18:03:36.559', NULL, '250g', NULL, 0),
('25', 'CAFE SỮA DỪA ROCKCAFFE', 'cafe-sua-dua-rockcaffe', '220g', 10, 8, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.157', '2026-03-09 18:03:36.559', NULL, '220g', NULL, 0),
('26', 'CÂN ĐIỆN TỬ', 'can-dien-tu', '400g', 22, 18, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.174', '2026-03-09 18:03:36.559', NULL, '400g', NULL, 0),
('27', 'CANH CHUA ĂN LIỀN', 'canh-chua-an-lien', '100g', 14, 11, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.187', '2026-03-09 18:03:36.559', NULL, '100g', NULL, 0),
('28', 'CANH RIÊU TÔM ĂN LIỀN', 'canh-rieu-tom-an-lien', '70g', 14, 11, NULL, NULL, 1, NULL, NULL, 'Tôm & Mực khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.204', '2026-03-09 18:03:36.559', NULL, '70g', NULL, 0),
('29', 'CANH RONG BIỂN ĐẬU HŨ', 'canh-rong-bien-dau-hu', '83g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.221', '2026-03-09 18:03:36.559', NULL, '83g', NULL, 0),
('3', 'BÁNH PHỒNG TÔM', 'banh-phong-tom', '250g', 12, 9, NULL, NULL, 1, NULL, NULL, 'Tôm & Mực khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.849', '2026-03-09 18:03:36.559', NULL, '250g', NULL, 0),
('30', 'CANH RONG BIỂN TÔM', 'canh-rong-bien-tom', '83g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Tôm & Mực khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.236', '2026-03-09 18:03:36.559', NULL, '83g', NULL, 0),
('31', 'CHÀ BÔNG HEO', 'cha-bong-heo', '250g', 18, 15, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.253', '2026-03-09 18:03:36.559', NULL, '250g', NULL, 0),
('32', 'CHẢ CÁ CHIÊN', 'cha-ca-chien', '470g', 18, 15, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.267', '2026-03-09 18:03:36.559', NULL, '470g', NULL, 0),
('33', 'CÓC SẤY CHANH MUỐI', 'coc-say-chanh-muoi', '500g', 18, 15, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.283', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('34', 'ĐÁ ME HẠT DẺO', 'da-me-hat-deo', '1kg', 25, 20, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.295', '2026-03-09 18:03:36.559', NULL, '1kg', NULL, 0),
('35', 'ĐẬU PHỘNG SẤY TỎI ỚT', 'dau-phong-say-toi-ot', '400g', 16, 13, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.307', '2026-03-09 18:03:36.559', NULL, '400g', NULL, 0),
('36', 'ĐÔNG TRÙNG KHÔ', 'dong-trung-kho', '100g', 20, 14, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.320', '2026-03-09 18:03:36.559', NULL, '100g', NULL, 0),
('37', 'GỐI NẰM CAO SU NON', 'goi-nam-cao-su-non', 'Cái', 25, 21, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.333', '2026-03-09 18:03:36.559', NULL, 'Cái', NULL, 0),
('38', 'HÀNH PHI', 'hanh-phi', '330g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Gia vị Việt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.347', '2026-03-09 18:03:36.559', NULL, '330g', NULL, 0),
('39', 'HẠT BÍ', 'hat-bi', '350g', 13, 10, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.361', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('4', 'BÁNH RONG BIỂN KẸP HẠT', 'banh-rong-bien-kep-hat', '200g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.862', '2026-03-09 18:03:36.559', NULL, '200g', NULL, 0),
('40', 'HẠT ĐIỀU', 'hat-dieu', '350g', 22, 18, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.374', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('41', 'HẠT DƯA', 'hat-dua', '350g', 17, 14, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.386', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('42', 'HẠT HƯỚNG DƯƠNG', 'hat-huong-duong', '350g', 12, 10, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.399', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('43', 'HẠT HƯỚNG DƯƠNG TẨM VỊ MUỐI DỪA', 'hat-huong-duong-tam-vi-muoi-dua', '350g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.415', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('44', 'HẠT SEN KHÔ', 'hat-sen-kho', '330g', 18, 15, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.454', '2026-03-09 18:03:36.559', NULL, '330g', NULL, 0),
('45', 'KẸO DỪA SÁP CAFE MUỐI', 'keo-dua-sap-cafe-muoi', '500g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.472', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('46', 'KẸO DỪA SÁP MÈ ĐEN', 'keo-dua-sap-me-den', '500g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.488', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('47', 'KẸO MÈ ĐEN', 'keo-me-den', '500g', 18, 14, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.504', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('48', 'KẸO THẠCH', 'keo-thach', '500g', 16, 13, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.520', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('49', 'KHÔ CÁ BỐNG', 'kho-ca-bong', '500g', 22, 18, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.538', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('5', 'BÁNH TAI HEO SẤY MẮM ỚT', 'banh-tai-heo-say-mam-ot', '370g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.872', '2026-03-09 18:03:36.559', NULL, '370g', NULL, 0),
('50', 'KHÔ CÁ CHỈ VÀNG', 'kho-ca-chi-vang', '500g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.563', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('51', 'KHÔ CÁ CƠM', 'kho-ca-com', '500g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.579', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('52', 'KHÔ CÁ ĐÙ', 'kho-ca-du', '500g', 22, 18, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.596', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('53', 'KHÔ CÁ DỨA', 'kho-ca-dua', '1kg', 48, 40, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.615', '2026-03-09 18:03:36.559', NULL, '1kg', NULL, 0),
('54', 'KHÔ CÁ KÈO', 'kho-ca-keo', '500g', 27, 23, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.637', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('55', 'KHÔ CÁ KHOAI', 'kho-ca-khoai', '500g', 25, 21, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.650', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('56', 'KHÔ CÁ LÓC', 'kho-ca-loc', '1kg', 48, 40, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.664', '2026-03-09 18:03:36.559', NULL, '1kg', NULL, 0),
('57', 'KHÔ CÁ MỐI TẨM', 'kho-ca-moi-tam', '500g', 24, 19, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.677', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('58', 'KHÔ CÁ NGÁT', 'kho-ca-ngat', '500g', 22, 18, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.690', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('59', 'KHÔ CÁ SẶC', 'kho-ca-sac', '1kg', 46, 38, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.716', '2026-03-09 18:03:36.559', NULL, '1kg', NULL, 0),
('6', 'BÁNH THUYỀN', 'banh-thuyen', '500g', 22, 18, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.885', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('60', 'KHÔ CÁ SẶC BƯỚM', 'kho-ca-sac-buom', '330g', 18, 14, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.731', '2026-03-09 18:03:36.559', NULL, '330g', NULL, 0),
('61', 'KHÔ CÁ TRA PHỒNG', 'kho-ca-tra-phong', '1kg', 40, 32, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.745', '2026-03-09 18:03:36.559', NULL, '1kg', NULL, 0),
('62', 'KHÔ GÀ LÁ CHANH', 'kho-ga-la-chanh', '500g', 25, 21, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.767', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('63', 'KHOAI LANG SẤY DẺO', 'khoai-lang-say-deo', '350g', 13, 10, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.779', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('64', 'KHOAI MÔN SẤY MẮM HÀNH', 'khoai-mon-say-mam-hanh', '270g', 16, 13, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.793', '2026-03-09 18:03:36.559', NULL, '270g', NULL, 0),
('65', 'KIM QUẤT SẤY CAM THẢO', 'kim-quat-say-cam-thao', '250g', 12, 9, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.805', '2026-03-09 18:03:36.559', NULL, '250g', NULL, 0),
('66', 'MẮM CÁ LINH', 'mam-ca-linh', '500g', 17, 13, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.823', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('67', 'MẮM CÁ LÓC', 'mam-ca-loc', '500g', 18, 14, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.838', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('68', 'MẮM CÁ SẶC', 'mam-ca-sac', '500g', 17, 13, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.855', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('69', 'MẮM THÁI', 'mam-thai', '500g', 18, 15, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.886', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('7', 'BÁNH ƯỚT', 'banh-uot', '400g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.898', '2026-03-09 18:03:36.559', NULL, '400g', NULL, 0),
('70', 'MÃNG CẦU SẤY DẺO', 'mang-cau-say-deo', '200g', 12, 10, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.907', '2026-03-09 18:03:36.559', NULL, '200g', NULL, 0),
('71', 'MĂNG KHÔ', 'mang-kho', '500g', 16, 13, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.923', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('72', 'ME LÀO TƯƠI NGUYÊN TRÁI', 'me-lao-tuoi-nguyen-trai', '500g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.937', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('73', 'MƠ SẤY CHANH MUỐI ỚT', 'mo-say-chanh-muoi-ot', '450g', 17, 14, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:55.966', '2026-03-09 18:03:36.559', NULL, '450g', NULL, 0),
('74', 'MỰC CÁN TẨM', 'muc-can-tam', '330g', 25, 21, NULL, NULL, 1, NULL, NULL, 'Cá khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.004', '2026-03-09 18:03:36.559', NULL, '330g', NULL, 0),
('75', 'MỰC KHÔ', 'muc-kho', '500g', 45, 41, NULL, NULL, 1, NULL, NULL, 'Tôm & Mực khô', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.018', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('76', 'MUỐI TÂY NINH', 'muoi-tay-ninh', '400g', 14, 11, NULL, NULL, 1, NULL, NULL, 'Gia vị Việt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.029', '2026-03-09 18:03:36.559', NULL, '400g', NULL, 0),
('77', 'MỨT CAU', 'mut-cau', '500g', 19, 15, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.037', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('78', 'MỨT CHÀ LÀ', 'mut-cha-la', '350g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.047', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('79', 'MỨT CHÙM RUỘT', 'mut-chum-ruot', '500g', 17, 13, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.055', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('8', 'BÀO NGƯ', 'bao-ngu', '300g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.908', '2026-03-09 18:03:36.559', NULL, '300g', NULL, 0),
('80', 'MỨT CỦ NĂNG', 'mut-cu-nang', '350g', 13, 10, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.067', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('81', 'MỨT ĐU ĐỦ', 'mut-du-du', '250g', 12, 10, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.079', '2026-03-09 18:03:36.559', NULL, '250g', NULL, 0),
('82', 'MỨT GỪNG', 'mut-gung', '500g', 20, 16, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.088', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('83', 'MỨT HẠT SEN', 'mut-hat-sen', '350g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.100', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('84', 'MỨT THƠM', 'mut-thom', '250g', 12, 10, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.113', '2026-03-09 18:03:36.559', NULL, '250g', NULL, 0),
('85', 'MỨT XOÀI SẤY DẺO', 'mut-xoai-say-deo', '350g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.124', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('86', 'NẤM ĐÔNG CÔ', 'nam-dong-co', '330g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.136', '2026-03-09 18:03:36.559', NULL, '330g', NULL, 0),
('87', 'NẤM LỘC NHUNG KHÔ', 'nam-loc-nhung-kho', '100g', 15, 11, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.152', '2026-03-09 18:03:36.559', NULL, '100g', NULL, 0),
('88', 'NGŨ CỐC 5 THỨ ĐẬU', 'ngu-coc-5-thu-dau', '400g', 16, 13, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.165', '2026-03-09 18:03:36.559', NULL, '400g', NULL, 0),
('89', 'NGŨ CỐC GẠO LỨT HUYẾT RỒNG', 'ngu-coc-gao-lut-huyet-rong', '400g', 16, 13, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.179', '2026-03-09 18:03:36.559', NULL, '400g', NULL, 0),
('9', 'BẮP SẤY MẮM TỎI ỚT', 'bap-say-mam-toi-ot', '400g', 16, 13, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:54.919', '2026-03-09 18:03:36.559', NULL, '400g', NULL, 0),
('90', 'NƯỚC MÁT MÍA LAU', 'nuoc-mat-mia-lau', '100g', 14, 11, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.189', '2026-03-09 18:03:36.559', NULL, '100g', NULL, 0),
('91', 'Ô MAI BỊCH', 'o-mai-bich', '410g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.207', '2026-03-09 18:03:36.559', NULL, '410g', NULL, 0),
('92', 'ỔI SẤY MUỐI ỚT', 'oi-say-muoi-ot', '350g', 14, 11, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.223', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0),
('93', 'PHẤN HOA', 'phan-hoa', '330g', 20, 15, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.240', '2026-03-09 18:03:36.559', NULL, '330g', NULL, 0),
('94', 'RAU TIẾN VUA', 'rau-tien-vua', '330g', 15, 12, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.251', '2026-03-09 18:03:36.559', NULL, '330g', NULL, 0),
('95', 'RONG BIỂN GIA VỊ ĂN LIỀN', 'rong-bien-gia-vi-an-lien', '50g', 13, 10, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.262', '2026-03-09 18:03:36.559', NULL, '50g', NULL, 0),
('96', 'RONG SỤN KHÔ', 'rong-sun-kho', '300g', 16, 13, NULL, NULL, 1, NULL, NULL, 'Khác', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.272', '2026-03-09 18:03:36.559', NULL, '300g', NULL, 0),
('97', 'SAFFRON', 'saffron', '50g', 20, 14, NULL, NULL, 1, NULL, NULL, 'Trà & Bánh mứt', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.284', '2026-03-09 18:03:36.559', NULL, '50g', NULL, 0),
('98', 'TÁO ĐỎ', 'tao-do', '500g', 16, 13, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.296', '2026-03-09 18:03:36.559', NULL, '500g', NULL, 0),
('99', 'TÁO ĐỎ KẸO SỮA HẠT ĐIỀU', 'tao-do-keo-sua-hat-dieu', '350g', 13, 10, NULL, NULL, 1, NULL, NULL, 'Trái cây sấy', 1000, 0, NULL, NULL, NULL, 0, 0, 0, '2026-03-09 08:48:56.307', '2026-03-09 18:03:36.559', NULL, '350g', NULL, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productimage`
--

CREATE TABLE `productimage` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `altText` varchar(191) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `isPrimary` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productmedia`
--

CREATE TABLE `productmedia` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `isCover` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productqa`
--

CREATE TABLE `productqa` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `question` text NOT NULL,
  `answer` text DEFAULT NULL,
  `isPublic` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productshipping`
--

CREATE TABLE `productshipping` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `weight` double DEFAULT NULL,
  `length` double DEFAULT NULL,
  `width` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `freeShipMin` double DEFAULT NULL,
  `shippingFee` double DEFAULT NULL,
  `estimatedDays` int(11) NOT NULL DEFAULT 3,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productspecification`
--

CREATE TABLE `productspecification` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` text NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productvariant`
--

CREATE TABLE `productvariant` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `weight` varchar(191) DEFAULT NULL,
  `flavor` varchar(191) DEFAULT NULL,
  `priceAdjustment` double NOT NULL DEFAULT 0,
  `stock` int(11) NOT NULL DEFAULT 0,
  `sku` varchar(191) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `productvariant`
--

INSERT INTO `productvariant` (`id`, `productId`, `weight`, `flavor`, `priceAdjustment`, `stock`, `sku`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cmmixw1ek0000q7fom8oj5wu2', '1', '330g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.811', '2026-03-09 08:48:54.811'),
('cmmixw1f40001q7fokv2u5ckl', '2', '120g,8c', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.832', '2026-03-09 08:48:54.832'),
('cmmixw1fl0002q7fo281tdfbx', '3', '250g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.849', '2026-03-09 08:48:54.849'),
('cmmixw1fy0003q7fo0ucpcs0b', '4', '200g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.862', '2026-03-09 08:48:54.862'),
('cmmixw1g80004q7foi74ys5t5', '5', '370g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.872', '2026-03-09 08:48:54.872'),
('cmmixw1gl0005q7foobzhu9c7', '6', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.885', '2026-03-09 08:48:54.885'),
('cmmixw1gy0006q7fofmras1sz', '7', '400g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.898', '2026-03-09 08:48:54.898'),
('cmmixw1h80007q7fola9jzvbk', '8', '300g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.908', '2026-03-09 08:48:54.908'),
('cmmixw1hj0008q7foaehkmqth', '9', '400g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.919', '2026-03-09 08:48:54.919'),
('cmmixw1hw0009q7fo2yjsvzhn', '10', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.932', '2026-03-09 08:48:54.932'),
('cmmixw1ig000aq7fok2ngw545', '11', '300g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.952', '2026-03-09 08:48:54.952'),
('cmmixw1iv000bq7fo94vmmra7', '12', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.967', '2026-03-09 08:48:54.967'),
('cmmixw1jd000cq7fopaunxosy', '13', '100g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.985', '2026-03-09 08:48:54.985'),
('cmmixw1jr000dq7fozop4njj7', '14', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:54.999', '2026-03-09 08:48:54.999'),
('cmmixw1k6000eq7fo88hq2yiw', '15', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.014', '2026-03-09 08:48:55.014'),
('cmmixw1kh000fq7foqgcc4pca', '16', '200g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.025', '2026-03-09 08:48:55.025'),
('cmmixw1ks000gq7fo20hr50be', '17', '1kg', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.036', '2026-03-09 08:48:55.036'),
('cmmixw1l6000hq7fonyvo43c7', '18', '300g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.050', '2026-03-09 08:48:55.050'),
('cmmixw1lk000iq7fobupdshhb', '19', '330g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.064', '2026-03-09 08:48:55.064'),
('cmmixw1m0000jq7fo2qf3fw4a', '20', '330g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.080', '2026-03-09 08:48:55.080'),
('cmmixw1mi000kq7fo4ccmbaug', '21', '250g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.098', '2026-03-09 08:48:55.098'),
('cmmixw1mz000lq7fokj0b6su1', '22', '200g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.115', '2026-03-09 08:48:55.115'),
('cmmixw1nj000mq7fo5365uvzm', '23', '270g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.135', '2026-03-09 08:48:55.135'),
('cmmixw1nv000nq7fo5kqij5rw', '24', '250g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.147', '2026-03-09 08:48:55.147'),
('cmmixw1o5000oq7fo62q7c6lb', '25', '220g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.157', '2026-03-09 08:48:55.157'),
('cmmixw1om000pq7foo9tcpxdk', '26', '400g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.174', '2026-03-09 08:48:55.174'),
('cmmixw1oz000qq7fol4v79ild', '27', '100g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.187', '2026-03-09 08:48:55.187'),
('cmmixw1pg000rq7foi7vpov5d', '28', '70g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.204', '2026-03-09 08:48:55.204'),
('cmmixw1px000sq7foq1dchimt', '29', '83g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.221', '2026-03-09 08:48:55.221'),
('cmmixw1qc000tq7fo55aoc7iu', '30', '83g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.236', '2026-03-09 08:48:55.236'),
('cmmixw1qt000uq7fo8y4ldg49', '31', '250g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.253', '2026-03-09 08:48:55.253'),
('cmmixw1r7000vq7fo13iyu3t1', '32', '470g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.267', '2026-03-09 08:48:55.267'),
('cmmixw1rn000wq7foj3up5iyy', '33', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.283', '2026-03-09 08:48:55.283'),
('cmmixw1rz000xq7foksnn6orz', '34', '1kg', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.295', '2026-03-09 08:48:55.295'),
('cmmixw1sb000yq7fok497lgfg', '35', '400g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.307', '2026-03-09 08:48:55.307'),
('cmmixw1so000zq7fo64q32a50', '36', '100g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.320', '2026-03-09 08:48:55.320'),
('cmmixw1t10010q7fopmik8y6e', '37', 'Cái', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.333', '2026-03-09 08:48:55.333'),
('cmmixw1tf0011q7foitmucxan', '38', '330g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.347', '2026-03-09 08:48:55.347'),
('cmmixw1tt0012q7fo6ssmmvr9', '39', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.361', '2026-03-09 08:48:55.361'),
('cmmixw1u60013q7fogcr8e238', '40', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.374', '2026-03-09 08:48:55.374'),
('cmmixw1ui0014q7fo0gib4wz6', '41', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.386', '2026-03-09 08:48:55.386'),
('cmmixw1uv0015q7fo45hzc4f8', '42', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.399', '2026-03-09 08:48:55.399'),
('cmmixw1vb0016q7fo6jpevqm6', '43', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.415', '2026-03-09 08:48:55.415'),
('cmmixw1we0017q7fo2mi2arhb', '44', '330g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.454', '2026-03-09 08:48:55.454'),
('cmmixw1ww0018q7fotdrhyfq3', '45', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.472', '2026-03-09 08:48:55.472'),
('cmmixw1xc0019q7foaa8o0m7b', '46', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.488', '2026-03-09 08:48:55.488'),
('cmmixw1xs001aq7fo58y53cvc', '47', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.504', '2026-03-09 08:48:55.504'),
('cmmixw1y8001bq7fog7u4wtrx', '48', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.520', '2026-03-09 08:48:55.520'),
('cmmixw1yr001cq7fo4dttxymb', '49', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.538', '2026-03-09 08:48:55.538'),
('cmmixw1zf001dq7foh8p52p07', '50', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.563', '2026-03-09 08:48:55.563'),
('cmmixw1zv001eq7fo20vs4jlv', '51', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.579', '2026-03-09 08:48:55.579'),
('cmmixw20c001fq7fo055olwpo', '52', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.596', '2026-03-09 08:48:55.596'),
('cmmixw20v001gq7fobu39xdba', '53', '1kg', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.615', '2026-03-09 08:48:55.615'),
('cmmixw21g001hq7fowgc1zb14', '54', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.637', '2026-03-09 08:48:55.637'),
('cmmixw21t001iq7fob9sqvixd', '55', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.650', '2026-03-09 08:48:55.650'),
('cmmixw228001jq7fosfsd936y', '56', '1kg', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.664', '2026-03-09 08:48:55.664'),
('cmmixw22l001kq7fo50x6ur1j', '57', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.677', '2026-03-09 08:48:55.677'),
('cmmixw22y001lq7foejn0cgda', '58', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.690', '2026-03-09 08:48:55.690'),
('cmmixw23o001mq7foggfmvivi', '59', '1kg', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.716', '2026-03-09 08:48:55.716'),
('cmmixw243001nq7fowrunfks6', '60', '330g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.731', '2026-03-09 08:48:55.731'),
('cmmixw24h001oq7fo4egi7xtu', '61', '1kg', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.745', '2026-03-09 08:48:55.745'),
('cmmixw253001pq7fopwttrgv6', '62', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.767', '2026-03-09 08:48:55.767'),
('cmmixw25g001qq7fo8zn372yw', '63', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.779', '2026-03-09 08:48:55.779'),
('cmmixw25t001rq7fosd9z33mh', '64', '270g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.793', '2026-03-09 08:48:55.793'),
('cmmixw265001sq7forihvkypf', '65', '250g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.805', '2026-03-09 08:48:55.805'),
('cmmixw26n001tq7fo6wgk1tlx', '66', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.823', '2026-03-09 08:48:55.823'),
('cmmixw271001uq7fo0qz45o7z', '67', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.838', '2026-03-09 08:48:55.838'),
('cmmixw27j001vq7fo7iwkiye4', '68', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.855', '2026-03-09 08:48:55.855'),
('cmmixw28e001wq7foxc4qguea', '69', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.886', '2026-03-09 08:48:55.886'),
('cmmixw28z001xq7foszl7rm82', '70', '200g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.907', '2026-03-09 08:48:55.907'),
('cmmixw29f001yq7foom2pohj4', '71', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.923', '2026-03-09 08:48:55.923'),
('cmmixw29t001zq7fo96ljdw4h', '72', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.937', '2026-03-09 08:48:55.937'),
('cmmixw2am0020q7fozkhfgaka', '73', '450g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:55.966', '2026-03-09 08:48:55.966'),
('cmmixw2bo0021q7fo95es55wq', '74', '330g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.004', '2026-03-09 08:48:56.004'),
('cmmixw2c20022q7foord82ma5', '75', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.018', '2026-03-09 08:48:56.018'),
('cmmixw2cd0023q7fonua60kky', '76', '400g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.029', '2026-03-09 08:48:56.029'),
('cmmixw2cl0024q7fokv7j9djk', '77', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.037', '2026-03-09 08:48:56.037'),
('cmmixw2cv0025q7foq9thnw81', '78', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.047', '2026-03-09 08:48:56.047'),
('cmmixw2d40026q7fof3bsmdj9', '79', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.055', '2026-03-09 08:48:56.055'),
('cmmixw2df0027q7fo68ndedch', '80', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.067', '2026-03-09 08:48:56.067'),
('cmmixw2dr0028q7fojwvqiejx', '81', '250g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.079', '2026-03-09 08:48:56.079'),
('cmmixw2e00029q7fonc2mnu2a', '82', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.088', '2026-03-09 08:48:56.088'),
('cmmixw2eb002aq7fowiumkko9', '83', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.100', '2026-03-09 08:48:56.100'),
('cmmixw2ep002bq7fofedctwhs', '84', '250g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.113', '2026-03-09 08:48:56.113'),
('cmmixw2f1002cq7fomrxv9uwy', '85', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.124', '2026-03-09 08:48:56.124'),
('cmmixw2fc002dq7fookdqk8my', '86', '330g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.136', '2026-03-09 08:48:56.136'),
('cmmixw2fs002eq7foqk8kisas', '87', '100g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.152', '2026-03-09 08:48:56.152'),
('cmmixw2g5002fq7fo5x0phwcp', '88', '400g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.165', '2026-03-09 08:48:56.165'),
('cmmixw2gj002gq7fo595s184y', '89', '400g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.179', '2026-03-09 08:48:56.179'),
('cmmixw2gt002hq7fo6jy6darg', '90', '100g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.189', '2026-03-09 08:48:56.189'),
('cmmixw2hb002iq7fo40jv0ylh', '91', '410g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.207', '2026-03-09 08:48:56.207'),
('cmmixw2hs002jq7fo24i8rxrv', '92', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.223', '2026-03-09 08:48:56.223'),
('cmmixw2i8002kq7fojzpx757q', '93', '330g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.240', '2026-03-09 08:48:56.240'),
('cmmixw2ij002lq7fobo5xy2ro', '94', '330g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.251', '2026-03-09 08:48:56.251'),
('cmmixw2iu002mq7fopt0osyxs', '95', '50g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.262', '2026-03-09 08:48:56.262'),
('cmmixw2j4002nq7foyai0wqho', '96', '300g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.272', '2026-03-09 08:48:56.272'),
('cmmixw2jh002oq7fof1anfw4s', '97', '50g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.284', '2026-03-09 08:48:56.284'),
('cmmixw2js002pq7fomh1f5xne', '98', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.296', '2026-03-09 08:48:56.296'),
('cmmixw2k3002qq7fon1rl3dc9', '99', '350g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.307', '2026-03-09 08:48:56.307'),
('cmmixw2kf002rq7foje304po1', '100', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.319', '2026-03-09 08:48:56.319'),
('cmmixw2kp002sq7fousx5d8yy', '101', '400g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.329', '2026-03-09 08:48:56.329'),
('cmmixw2l0002tq7folqcuiwwu', '102', '30g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.339', '2026-03-09 08:48:56.339'),
('cmmixw2lc002uq7fo0drhkyks', '103', '120g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.353', '2026-03-09 08:48:56.353'),
('cmmixw2lo002vq7foxihigqgj', '104', '500g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.364', '2026-03-09 08:48:56.364'),
('cmmixw2lz002wq7fobo0nsw13', '105', '20 gói', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.374', '2026-03-09 08:48:56.374'),
('cmmixw2mb002xq7fo6aby045y', '106', '470g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.387', '2026-03-09 08:48:56.387'),
('cmmixw2mn002yq7fovj8ofx7g', '107', '200g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.399', '2026-03-09 08:48:56.399'),
('cmmixw2n0002zq7focmj7mx9j', '108', 'Bịch', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.412', '2026-03-09 08:48:56.412'),
('cmmixw2na0030q7fojnfy37ra', '109', '250g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.422', '2026-03-09 08:48:56.422'),
('cmmixw2nn0031q7fo30fezb0u', '110', '400g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.435', '2026-03-09 08:48:56.435'),
('cmmixw2nz0032q7foumn0g4z4', '111', '240g', NULL, 0, 1000, NULL, 1, '2026-03-09 08:48:56.447', '2026-03-09 08:48:56.447');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productview`
--

CREATE TABLE `productview` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `pushnotification`
--

CREATE TABLE `pushnotification` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `body` varchar(191) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `sentAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `readAt` datetime(3) DEFAULT NULL,
  `deliveredAt` datetime(3) DEFAULT NULL,
  `clickedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `refundrequest`
--

CREATE TABLE `refundrequest` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `orderItemId` varchar(191) DEFAULT NULL,
  `reason` text NOT NULL,
  `amount` double NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `adminNote` text DEFAULT NULL,
  `refundMethod` varchar(191) DEFAULT NULL,
  `bankAccount` varchar(191) DEFAULT NULL,
  `bankName` varchar(191) DEFAULT NULL,
  `processedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `review`
--

CREATE TABLE `review` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `orderItemId` varchar(191) DEFAULT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `adminReply` text DEFAULT NULL,
  `repliedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviewmedia`
--

CREATE TABLE `reviewmedia` (
  `id` varchar(191) NOT NULL,
  `reviewId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `systemsetting`
--

CREATE TABLE `systemsetting` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `systemsetting`
--

INSERT INTO `systemsetting` (`id`, `key`, `value`, `createdAt`, `updatedAt`) VALUES
('cmli09kwx0026q7s4iniaqcad', 'SITE_ADDRESS', '30 tân lập 1', '2026-02-11 12:27:57.345', '2026-02-11 12:27:57.345'),
('cmmljedaq000vq7mwe3j8ft2x', 'paypal_client_id', 'vudev05', '2026-03-11 04:26:34.322', '2026-03-11 04:27:34.573'),
('cmmljfnsb000wq7mwkm1onjf8', 'payment_bank_enabled', 'ON', '2026-03-11 04:27:34.571', '2026-03-11 04:27:34.571'),
('cmmljfnsc000xq7mw8b8ke3ht', 'payment_paypal_enabled', 'ON', '2026-03-11 04:27:34.572', '2026-03-11 04:27:34.572'),
('cmmljfnsc000yq7mw7sn7ah40', 'bank_name', 'MBBANK', '2026-03-11 04:27:34.572', '2026-03-11 04:27:34.572'),
('cmmljfnsc000zq7mwxdcjwpn9', 'bank_account_name', 'TRAN QUOC VU', '2026-03-11 04:27:34.572', '2026-03-11 04:27:34.572'),
('cmmljfnsd0010q7mwfzfvamdz', 'bank_account_number', '3011200588888', '2026-03-11 04:27:34.573', '2026-03-11 04:27:34.573');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `twofactortoken`
--

CREATE TABLE `twofactortoken` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `token` varchar(10) NOT NULL,
  `expires` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) DEFAULT NULL,
  `name` varchar(191) DEFAULT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'USER',
  `emailVerified` datetime(3) DEFAULT NULL,
  `image` longtext DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `avatarUrl` varchar(512) DEFAULT NULL,
  `lastCheckIn` datetime(3) DEFAULT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `twoFactorEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `notificationPreferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`notificationPreferences`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `role`, `emailVerified`, `image`, `phone`, `createdAt`, `updatedAt`, `avatarUrl`, `lastCheckIn`, `points`, `twoFactorEnabled`, `notificationPreferences`) VALUES
('1', 'tranquocvu3011@gmail.com', '$2b$12$aTFJsN4xbJuF.ZSPhsGSAuMLuY9S7ihidy4hjty.QYZH13OZE3vaG', 'Trần Quốc Vũ', 'ADMIN', '2026-02-11 04:12:24.603', '/uploads/avatars/1-5cb63754-aae5-4f34-9811-f9ca3481e23f.jpg', '+84869226687', '2026-02-11 04:11:39.900', '2026-03-10 20:48:31.491', '/uploads/avatars/1-5cb63754-aae5-4f34-9811-f9ca3481e23f.jpg', '2026-03-08 17:07:50.476', 20, 1, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `usersegment`
--

CREATE TABLE `usersegment` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `segment` varchar(191) NOT NULL,
  `score` double NOT NULL DEFAULT 1,
  `calculatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `expiresAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `uservoucher`
--

CREATE TABLE `uservoucher` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `couponId` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'CLAIMED',
  `claimedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `usedAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `verificationtoken`
--

CREATE TABLE `verificationtoken` (
  `id` varchar(191) NOT NULL,
  `identifier` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wishlist`
--

CREATE TABLE `wishlist` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('995140de-0207-4e4a-bd98-6500977469b0', 'c76de32ec05083e4ad5fb6b0d1df95f8c6f217846875ad5663793b87e8d30564', '2026-03-09 08:28:01.404', '20260206_create_banner', '', NULL, '2026-03-09 08:28:01.404', 0),
('d47952fc-1652-4ec0-9529-be8b2ffe7df2', '3b0f0b2054fc3d4e58c7c966efa42f3222ca345358308c607a9718c13f07afe6', '2026-03-09 08:28:06.806', '20260211_add_product_code', NULL, NULL, '2026-03-09 08:28:06.778', 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `activesession`
--
ALTER TABLE `activesession`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `activesession_sessionToken_key` (`sessionToken`),
  ADD KEY `activesession_userId_idx` (`userId`);

--
-- Chỉ mục cho bảng `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `address_userId_idx` (`userId`);

--
-- Chỉ mục cho bảng `aiknowledge`
--
ALTER TABLE `aiknowledge`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aiKnowledge_category_idx` (`category`),
  ADD KEY `aiKnowledge_language_idx` (`language`),
  ADD KEY `aiKnowledge_isActive_idx` (`isActive`);

--
-- Chỉ mục cho bảng `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`),
  ADD KEY `banner_placement_isActive_priority_idx` (`placement`,`isActive`,`priority`);

--
-- Chỉ mục cho bảng `behaviorevent`
--
ALTER TABLE `behaviorevent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `behaviorEvent_userId_idx` (`userId`),
  ADD KEY `behaviorEvent_sessionId_idx` (`sessionId`),
  ADD KEY `behaviorEvent_eventType_idx` (`eventType`),
  ADD KEY `behaviorEvent_createdAt_idx` (`createdAt`);

--
-- Chỉ mục cho bảng `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `brand_slug_key` (`slug`);

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cart_userId_key` (`userId`),
  ADD UNIQUE KEY `cart_guestToken_key` (`guestToken`);

--
-- Chỉ mục cho bảng `cartitem`
--
ALTER TABLE `cartitem`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cartitem_cartId_productId_variantId_key` (`cartId`,`productId`,`variantId`),
  ADD KEY `cartitem_cartId_idx` (`cartId`),
  ADD KEY `cartitem_productId_idx` (`productId`),
  ADD KEY `cartitem_variantId_fkey` (`variantId`);

--
-- Chỉ mục cho bảng `contactmessage`
--
ALTER TABLE `contactmessage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contactmessage_email_idx` (`email`),
  ADD KEY `contactmessage_status_idx` (`status`),
  ADD KEY `contactmessage_createdAt_idx` (`createdAt`);

--
-- Chỉ mục cho bảng `conversationhistory`
--
ALTER TABLE `conversationhistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversationHistory_userId_idx` (`userId`),
  ADD KEY `conversationHistory_sessionId_idx` (`sessionId`),
  ADD KEY `conversationHistory_createdAt_idx` (`createdAt`);

--
-- Chỉ mục cho bảng `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `coupon_code_key` (`code`);

--
-- Chỉ mục cho bảng `emailcampaign`
--
ALTER TABLE `emailcampaign`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emailCampaign_triggerType_idx` (`triggerType`),
  ADD KEY `emailCampaign_isActive_idx` (`isActive`);

--
-- Chỉ mục cho bảng `emailqueue`
--
ALTER TABLE `emailqueue`
  ADD PRIMARY KEY (`id`),
  ADD KEY `emailqueue_userId_idx` (`userId`),
  ADD KEY `emailqueue_status_idx` (`status`),
  ADD KEY `emailqueue_scheduledAt_idx` (`scheduledAt`);

--
-- Chỉ mục cho bảng `flashsalecampaign`
--
ALTER TABLE `flashsalecampaign`
  ADD PRIMARY KEY (`id`),
  ADD KEY `flashsalecampaign_startAt_endAt_idx` (`startAt`,`endAt`),
  ADD KEY `flashsalecampaign_isActive_idx` (`isActive`);

--
-- Chỉ mục cho bảng `flashsaleproduct`
--
ALTER TABLE `flashsaleproduct`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `flashsaleproduct_campaignId_productId_key` (`campaignId`,`productId`),
  ADD KEY `flashsaleproduct_campaignId_idx` (`campaignId`),
  ADD KEY `flashsaleproduct_productId_idx` (`productId`);

--
-- Chỉ mục cho bảng `loginhistory`
--
ALTER TABLE `loginhistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loginhistory_userId_idx` (`userId`),
  ADD KEY `loginhistory_createdAt_idx` (`createdAt`);

--
-- Chỉ mục cho bảng `newslettersubscriber`
--
ALTER TABLE `newslettersubscriber`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `newslettersubscriber_email_key` (`email`),
  ADD KEY `newslettersubscriber_subscribedAt_idx` (`subscribedAt`);

--
-- Chỉ mục cho bảng `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_userId_isRead_idx` (`userId`,`isRead`),
  ADD KEY `notification_createdAt_idx` (`createdAt`);

--
-- Chỉ mục cho bảng `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_userId_idx` (`userId`),
  ADD KEY `order_status_idx` (`status`),
  ADD KEY `order_createdAt_idx` (`createdAt`);

--
-- Chỉ mục cho bảng `orderevent`
--
ALTER TABLE `orderevent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderevent_orderId_createdAt_idx` (`orderId`,`createdAt`);

--
-- Chỉ mục cho bảng `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderitem_orderId_idx` (`orderId`),
  ADD KEY `orderitem_productId_idx` (`productId`),
  ADD KEY `orderitem_variantId_idx` (`variantId`),
  ADD KEY `orderitem_createdAt_idx` (`createdAt`);

--
-- Chỉ mục cho bảng `pointtransaction`
--
ALTER TABLE `pointtransaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pointtransaction_userId_idx` (`userId`),
  ADD KEY `pointtransaction_createdAt_idx` (`createdAt`);

--
-- Chỉ mục cho bảng `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_slug_key` (`slug`),
  ADD KEY `post_isPublished_idx` (`isPublished`),
  ADD KEY `post_publishedAt_idx` (`publishedAt`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_slug_key` (`slug`),
  ADD UNIQUE KEY `product_code_key` (`code`),
  ADD KEY `product_brandId_idx` (`brandId`),
  ADD KEY `product_category_idx` (`category`),
  ADD KEY `product_isOnSale_idx` (`isOnSale`),
  ADD KEY `product_featured_idx` (`featured`),
  ADD KEY `product_soldCount_idx` (`soldCount`),
  ADD KEY `product_ratingAvg_idx` (`ratingAvg`);
ALTER TABLE `product` ADD FULLTEXT KEY `product_name_description_idx` (`name`,`description`);

--
-- Chỉ mục cho bảng `productimage`
--
ALTER TABLE `productimage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productimage_productId_idx` (`productId`),
  ADD KEY `productimage_isPrimary_idx` (`isPrimary`);

--
-- Chỉ mục cho bảng `productmedia`
--
ALTER TABLE `productmedia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productmedia_productId_idx` (`productId`),
  ADD KEY `productmedia_type_idx` (`type`);

--
-- Chỉ mục cho bảng `productqa`
--
ALTER TABLE `productqa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productqa_productId_idx` (`productId`),
  ADD KEY `productqa_userId_idx` (`userId`),
  ADD KEY `productqa_createdAt_idx` (`createdAt`);

--
-- Chỉ mục cho bảng `productshipping`
--
ALTER TABLE `productshipping`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `productshipping_productId_key` (`productId`);

--
-- Chỉ mục cho bảng `productspecification`
--
ALTER TABLE `productspecification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productspecification_productId_idx` (`productId`),
  ADD KEY `productspecification_order_idx` (`order`);

--
-- Chỉ mục cho bảng `productvariant`
--
ALTER TABLE `productvariant`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `productvariant_sku_key` (`sku`),
  ADD KEY `productvariant_productId_idx` (`productId`),
  ADD KEY `productvariant_isActive_idx` (`isActive`);

--
-- Chỉ mục cho bảng `productview`
--
ALTER TABLE `productview`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productview_productId_idx` (`productId`),
  ADD KEY `productview_userId_idx` (`userId`),
  ADD KEY `productview_createdAt_idx` (`createdAt`);

--
-- Chỉ mục cho bảng `pushnotification`
--
ALTER TABLE `pushnotification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pushNotification_userId_idx` (`userId`),
  ADD KEY `pushNotification_type_idx` (`type`),
  ADD KEY `pushNotification_sentAt_idx` (`sentAt`);

--
-- Chỉ mục cho bảng `refundrequest`
--
ALTER TABLE `refundrequest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `refundrequest_orderId_idx` (`orderId`),
  ADD KEY `refundrequest_userId_idx` (`userId`),
  ADD KEY `refundrequest_status_idx` (`status`);

--
-- Chỉ mục cho bảng `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `review_orderItemId_key` (`orderItemId`),
  ADD KEY `review_productId_idx` (`productId`),
  ADD KEY `review_userId_idx` (`userId`),
  ADD KEY `review_status_rating_idx` (`status`,`rating`),
  ADD KEY `review_productId_status_idx` (`productId`,`status`);

--
-- Chỉ mục cho bảng `reviewmedia`
--
ALTER TABLE `reviewmedia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviewmedia_reviewId_idx` (`reviewId`);

--
-- Chỉ mục cho bảng `systemsetting`
--
ALTER TABLE `systemsetting`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `systemsetting_key_key` (`key`),
  ADD KEY `systemsetting_key_idx` (`key`);

--
-- Chỉ mục cho bảng `twofactortoken`
--
ALTER TABLE `twofactortoken`
  ADD PRIMARY KEY (`id`),
  ADD KEY `twofactortoken_userId_idx` (`userId`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_email_key` (`email`);

--
-- Chỉ mục cho bảng `usersegment`
--
ALTER TABLE `usersegment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userSegment_userId_segment_key` (`userId`,`segment`),
  ADD KEY `userSegment_segment_idx` (`segment`);

--
-- Chỉ mục cho bảng `uservoucher`
--
ALTER TABLE `uservoucher`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uservoucher_userId_couponId_key` (`userId`,`couponId`),
  ADD KEY `uservoucher_userId_idx` (`userId`),
  ADD KEY `uservoucher_couponId_idx` (`couponId`);

--
-- Chỉ mục cho bảng `verificationtoken`
--
ALTER TABLE `verificationtoken`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `verificationtoken_token_key` (`token`),
  ADD UNIQUE KEY `verificationtoken_identifier_token_key` (`identifier`,`token`);

--
-- Chỉ mục cho bảng `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wishlist_userId_productId_key` (`userId`,`productId`),
  ADD KEY `wishlist_userId_idx` (`userId`),
  ADD KEY `wishlist_productId_idx` (`productId`);

--
-- Chỉ mục cho bảng `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `activesession`
--
ALTER TABLE `activesession`
  ADD CONSTRAINT `activesession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `cartitem`
--
ALTER TABLE `cartitem`
  ADD CONSTRAINT `cartitem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cartitem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cartitem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `flashsaleproduct`
--
ALTER TABLE `flashsaleproduct`
  ADD CONSTRAINT `flashsaleproduct_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `flashsalecampaign` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flashsaleproduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `loginhistory`
--
ALTER TABLE `loginhistory`
  ADD CONSTRAINT `loginhistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `orderevent`
--
ALTER TABLE `orderevent`
  ADD CONSTRAINT `orderevent_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `orderitem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orderitem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `pointtransaction`
--
ALTER TABLE `pointtransaction`
  ADD CONSTRAINT `pointtransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `productimage`
--
ALTER TABLE `productimage`
  ADD CONSTRAINT `productimage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `productmedia`
--
ALTER TABLE `productmedia`
  ADD CONSTRAINT `productmedia_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `productqa`
--
ALTER TABLE `productqa`
  ADD CONSTRAINT `productqa_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productqa_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `productshipping`
--
ALTER TABLE `productshipping`
  ADD CONSTRAINT `productshipping_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `productspecification`
--
ALTER TABLE `productspecification`
  ADD CONSTRAINT `productspecification_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `productvariant`
--
ALTER TABLE `productvariant`
  ADD CONSTRAINT `productvariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `productview`
--
ALTER TABLE `productview`
  ADD CONSTRAINT `productview_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `refundrequest`
--
ALTER TABLE `refundrequest`
  ADD CONSTRAINT `refundrequest_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `refundrequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `orderitem` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `reviewmedia`
--
ALTER TABLE `reviewmedia`
  ADD CONSTRAINT `reviewmedia_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `twofactortoken`
--
ALTER TABLE `twofactortoken`
  ADD CONSTRAINT `twofactortoken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `uservoucher`
--
ALTER TABLE `uservoucher`
  ADD CONSTRAINT `uservoucher_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `uservoucher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
