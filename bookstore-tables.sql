CREATE TABLE `person` (
    `id` int NOT NULL AUTO_INCREMENT,
    `loginid` varchar(10) NOT NULL,
    `password` varchar(20) NOT NULL, 
    `name` varchar(20) NOT NULL,
    `address` varchar(50),
    `tel` varchar(13),
    `birth` varchar(8) NOT NULL,
    `cls` varchar(2) NOT NULL,
    `grade` varchar(2) NOT NULL,
    PRIMARY KEY (`loginid`)
);


CREATE TABLE `book` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL, 
    `publisher` varchar(100) NOT NULL,
    `author` varchar(100) NOT NULL,
    `stock` int NOT NULL,
    `pubdate` varchar(8) NOT NULL,
    `pagenum` int ,
    `ISBN` varchar(30) NOT NULL,
    `ebook` varchar(1) NOT NULL,
    `kdc` varchar(20),
    `img` varchar(30),
    `price` int,
    `nation` varchar(50) NOT NULL,
    `description` varchar(200),
    PRIMARY KEY (`id`)
);

CREATE TABLE `cart` (
    `cartid` int NOT NULL AUTO_INCREMENT,
    `custid` varchar(10) NOT NULL, 
    `bookid` int NOT NULL,
    `cartdate` varchar(8) NOT NULL,
    `qty` int, 
    PRIMARY KEY (`cartid`)
);

CREATE TABLE `purchase` (
    `purchaseid` int NOT NULL AUTO_INCREMENT,
    `custid` varchar(10) NOT NULL, 
    `bookid` int NOT NULL,
    `purchasedate` varchar(8) NOT NULL,
    `price` int,
    `point` int,
    `qty` int,
    `cancel` varchar(1) NOT NULL DEFAULT 'N',
    `refund` varchar(1) NOT NULL DEFAULT 'N',
    PRIMARY KEY (`purchaseid`)
);


CREATE TABLE `namecard`(
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(20) NOT NULL, 
    `tel` varchar(20),
    `address` varchar(50),
    `com` varchar(20),
    PRIMARY KEY (`id`)
);

CREATE TABLE `author` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(20) NOT NULL,
    `profile` varchar(200) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `calendar` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(30) NOT NULL,
    `description` text,
    `created` datetime NOT NULL,
    `author_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE `board` (
    `id` int NOT NULL AUTO_INCREMENT,
    `loginid` varchar(10) NOT NULL, 
    `password` varchar(20) NOT NULL,
    `name` varchar(20) NOT NULL,
    `date` varchar(8), 
    `content` text, 
    `title` varchar(200) NOT NULL, 
    PRIMARY KEY (`id`)
);



