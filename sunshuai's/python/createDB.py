##
# Execute this script once to create the database & tables
# as well as populating it with initial data
#

import sqlite3
db = sqlite3.connect('bp4u.sqlite')

db.execute('DROP TABLE IF EXISTS member')
db.execute('''CREATE TABLE IF NOT EXISTS member(
    member_id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_username TEXT NOT NULL,
    member_first_name TEXT NOT NULL,
    member_last_name TEXT NOT NULL,
    member_password TEXT NOT NULL,
    member_email TEXT NOT NULL,
    member_phone TEXT NOT NULL,
    member_address TEXT NOT NULL,
    member_reg_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
)''')

db.execute('DROP TABLE IF EXISTS product')
db.execute('''CREATE TABLE IF NOT EXISTS product(
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_name TEXT NOT NULL,
    product_price REAL NOT NULL,
    product_weight REAL NOT NULL,
    product_stock INTEGER NOT NULL,
    product_discount_percent REAL NOT NULL DEFAULT 0,
    product_photo TEXT NOT NULL,
    product_desc TEXT NOT NULL,
    product_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    product_category TEXT CHECK( product_category IN ('N/A','ALBUM','MAGAZINE','FASHION') ) NOT NULL DEFAULT 'N/A'
)''')

db.execute('DROP TABLE IF EXISTS order_details')
db.execute('''CREATE TABLE IF NOT EXISTS order_details(
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_member_id INTEGER NOT NULL,
    order_shipping_address TEXT NOT NULL,
    order_courier TEXT NOT NULL,
    order_shipping_fee REAL NOT NULL,
    order_total REAL NOT NULL,
    order_status TEXT CHECK( order_status IN ('TO PAY','PAID','SHIPPED OUT','DELIVERED') ) NOT NULL DEFAULT 'TO PAY',
    order_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(order_member_id) REFERENCES member(member_id)
)''')

db.execute('DROP TABLE IF EXISTS order_item')
db.execute('''CREATE TABLE IF NOT EXISTS order_item(
    oi_id INTEGER PRIMARY KEY AUTOINCREMENT,
    oi_order_id INTEGER,
    oi_product_id INTEGER,
    oi_quantity INTEGER NOT NULL,
    UNIQUE(oi_id, oi_order_id, oi_product_id),
    FOREIGN KEY(oi_order_id) REFERENCES order_details(order_id),
    FOREIGN KEY(oi_product_id) REFERENCES product(product_id)
)''')

db.execute('DROP TABLE IF EXISTS payment')
db.execute('''CREATE TABLE IF NOT EXISTS payment(
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_order_id INTEGER NOT NULL DEFAULT 0,
    payment_amount REAL NOT NULL,
    payment_provider TEXT NOT NULL,
    payment_status TEXT CHECK( payment_status IN ('ACCEPTED','DECLINED') ) NOT NULL DEFAULT 'PENDING',
    payment_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(payment_order_id) REFERENCES order_details(order_id)
)''')

db.execute('DROP TABLE IF EXISTS cart')
db.execute('''CREATE TABLE IF NOT EXISTS cart(
    cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_member_id INTEGER NOT NULL,
    cart_total REAL NOT NULL,
    cart_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY(cart_member_id) REFERENCES member(member_id)
)''')

db.execute('DROP TABLE IF EXISTS cart_item')
db.execute('''CREATE TABLE IF NOT EXISTS cart_item(
    ci_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ci_cart_id INTEGER,
    ci_product_id INTEGER,
    ci_quantity INTEGER NOT NULL,
    UNIQUE (ci_id, ci_cart_id, ci_product_id),
    FOREIGN KEY(ci_cart_id) REFERENCES cart(cart_id),
    FOREIGN KEY(ci_product_id) REFERENCES product(product_id)
)''')


# test data
cursor = db.cursor()


# MEMBER TABLE (TOTAL 10 RECORDS)
cursor.execute('''
    INSERT INTO member(member_id,member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES(10001, 'kim001', 'Kimberly', 'Ling', 'kimberly1', 'kimberly@gmail.com', '010-3456789','11 Jalan Kimchi', '2022-01-21')
''')
cursor.execute('''
    INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES('olivia002', 'Olivia', 'Ong', 'olivia2', 'olivia@gmail.com', '011-4567890','22 Jalan Olive', '2022-02-22')
''')
cursor.execute('''
    INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES('jiawen003', 'Jiawen', 'Wee', 'jiawen3', 'jiawen@gmail.com', '012-5678901','33 Jalan Joker', '2022-03-23')
''')
cursor.execute('''
    INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES('junhong004', 'Junhong', 'Liew', 'junhong4', 'junhong@gmail.com', '013-6789012','44 Jalan Jerry', '2022-04-24')
''')
cursor.execute('''
    INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES('minghui005', 'Minghui', 'Bong', 'minghui5', 'minghui@gmail.com', '014-7890123','55 Jalan Monday', '2022-05-25')
''')
cursor.execute('''
    INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES('yenlung006', 'Yenlung', 'Lai', 'yenlung6', 'yenlung@gmail.com', '015-8901234','66 Jalan Yakult', '2021-06-26')
''')
cursor.execute('''
    INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES('lisa007', 'Lalisa', 'Monobal', 'lalisa7', 'lalisa@gmail.com', '016-9012345','77 Jalan Lili', '2021-07-27')
''')
cursor.execute('''
    INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES('rose008', 'Roseanne', 'Park', 'roseanne8', 'roseanne@gmail.com', '017-0123456','88 Jalan Rosie', '2021-08-28')
''')
cursor.execute('''
    INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES('jennie009', 'Jennie', 'Kim', 'jennie9', 'jennie@gmail.com', '018-1234567','99 Jalan Nini', '2021-09-29')
''')
cursor.execute('''
    INSERT INTO member(member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES('jisoo010', 'Jisoo', 'Kim', 'jisoo10', 'jisoo@gmail.com', '019-2345678','10 Jalan Jichu', '2021-10-30')
''')


# PRODUCT TABLE (TOTAL 15 RECORDS)
cursor.execute('''
    INSERT INTO product(product_id,product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES(20001, 'BORN PINK EXCLUSIVE BOX SET - BLACK VERSION', 149.99, 0.5, 10000, 0, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/2.0BLACKBOX.png?v=1660168680', 'BLACKPINK 2nd Full Album','2022-08-19', 'ALBUM')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('BORN PINK EXCLUSIVE BOX SET – PINK VERSION', 149.99, 0.5, 10000, 0, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/2.0PINKBOX.png?v=1660168633', 'BLACKPINK 2nd Full Album','2022-08-19', 'ALBUM')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('THE ALBUM – VERSION 1', 150.99, 1.0, 20000, 0.25, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BP_Box_V1_90fc247f-9726-4ee6-a117-7823ed2373b6.png?v=1602082456', 'BLACKPINK 1st Full Album','2020-11-20', 'ALBUM')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('THE ALBUM – VERSION 2', 150.99, 1.0, 20000, 0.25, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BP_Box_V2_ef110fa6-bcc9-4665-90c2-9b5be31fd58f.png?v=1602082483', 'BLACKPINK 1st Full Album','2020-11-20', 'ALBUM')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('THE ALBUM – VERSION 3', 150.99, 1.0, 20000, 0.25, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BP_Box_V3_7bf94f26-dc6f-48f1-9e7c-009795f08f6f.png?v=1599188148', 'BLACKPINK 1st Full Album','2020-11-20', 'ALBUM')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('THE ALBUM – VERSION 4', 150.99, 1.0, 20000, 0.25, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BP_Box_V4_82ba5e5f-94b1-47f4-aa4f-83b34c64d997.png?v=1599188148', 'BLACKPINK 1st Full Album','2020-11-20', 'ALBUM')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('STANDARD LP', 39.98, 0.5, 20000, 0.30, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BPLP.png?v=1595876400', 'BLACKPINK 1st Full Album Standard LP','2020-11-20', 'ALBUM')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('R CD DIGIPAK', 60.00, 1.5, 5000, 0.25, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/ROSE_digipak.png?v=1616703308', 'BLACKPINK ROSE Solo CD','2021-03-30', 'ALBUM')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('STANDARD CD – VERSION 1', 89.45, 0.5, 10000, 0, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BPCD_9789b3e2-55c6-44a9-8cc1-6110baddcdd0.png?v=1595876458', 'BLACKPINK 1st Full Album Standard CD','2020-11-20', 'ALBUM')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('STANDARD CD – VERSION 2', 89.45, 0.5, 10000, 0, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BPCD_9789b3e2-55c6-44a9-8cc1-6110baddcdd0.png?v=1595876458', 'BLACKPINK 1st Full Album Standard CD','2020-11-20', 'ALBUM')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('JISOO x MARIE CLAIRE KOREA', 89.99, 2.5, 10000, 0.10, 'https://blackpinkupdate.com/wp-content/uploads/2022/08/3-BLACKPINK-Jisoo-Dior-Beauty-Marie-Claire-Korea-Magazine-1581x2048.jpeg', 'JISOO collaboration with Dior Beauty','2022-07-15', 'MAGAZINE')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('JENNIE x HIGHCUT', 79.99, 2.0, 10000, 0.15, 'https://i0.wp.com/blackpinkupdate.com/wp-content/uploads/2020/03/6-BLACKPINK-Jennie-Calvin-Klein-Jeans-Highcut-Star-Magazine-Korea.jpg?fit=696%2C1024&ssl=1', 'HIGHCUT MAGAZINE','2018-11-15', 'MAGAZINE')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('JISOO ROSE x VOGUE KOREA', 99.99, 2.5, 10000, 0, 'https://blackpinkupdate.com/wp-content/uploads/2018/10/1-HQ-BLACKPINK-Jisoo-Rose-Vogue-Korea-Magazine-November-2018-Issue.jpg', 'JISOO and ROSE featured in Vogue Korea','2018-11-19', 'MAGAZINE')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('LISA PHOTOBOOK LIMITED EDITION', 149.99, 2.5, 500, 0, 'https://blackpinkupdate.com/wp-content/uploads/2020/03/3-BLACKPINK-Official-Merch-Lisa-Photobook-Limited-Edition-2020.jpg', 'PHOTOBOOK BY LISA','2020-03-27', 'MAGAZINE')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('BLACKPINK HOW YOU LIKE THAT PHOTOBOOK', 149.99, 2.5, 800, 0, 'https://blackpinkupdate.com/wp-content/uploads/2020/07/4-Official-Merch-BLACKPINK-How-You-Like-That-Special-Edition.jpg', 'SPECIAL EDITION PHOTOBOOK','2020-07-27', 'MAGAZINE')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('THE ALBUM NECKLACE', 125.00, 0.5, 2000, 0.30, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BP_album_necklace.png?v=1601238171', 'BLACKPINK THE ALBUM Crown Necklace','2021-01-10', 'FASHION')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('ICE CREAM SUNGLASSES', 200.00, 0.3, 1500, 0.30, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BPSG_Glasses.png?v=1598580813', 'Pink Tinted Ice Cream Sunglasses','2021-01-20', 'FASHION')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('ICE CREAM SOCKS', 150.00, 0.1, 5000, 0.10, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BPSG_Socks.png?v=1598580755', 'White Socks','2021-01-20', 'FASHION')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('LOVESICK GIRLS HOODIE I', 325.00, 2.0, 3000, 0, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/WHT-HOODIE_FRNT.png?v=1601589541', 'White Unisex Hoodie','2021-01-30', 'FASHION')
''')
cursor.execute('''
    INSERT INTO product(product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES('LOVESICK GIRLS HOODIE II', 325.00, 2.0, 3000, 0, 'https://cdn.shopify.com/s/files/1/0022/5011/3123/products/BLK-HOODIE_FRNT.png?v=1601589549', 'Black Unisex Hoodie','2021-01-30', 'FASHION')
''')


# ORDER_DETAILS TABLE (TOTAL 5 RECORDS)
cursor.execute('''
    INSERT INTO order_details(order_id,order_member_id,order_shipping_address,order_courier,order_shipping_fee,order_total,order_status,order_creation_date)
    VALUES(30001, 10001, '11 Jalan Kimchi', 'GDEX', 30, 563.21, 'DELIVERED','2022-01-22')
''')
cursor.execute('''
    INSERT INTO order_details(order_member_id,order_shipping_address,order_courier,order_shipping_fee,order_total,order_status,order_creation_date)
    VALUES(10002, '22 Jalan Olive', 'GDEX', 5, 87.50, 'DELIVERED','2022-02-23')
''')
cursor.execute('''
    INSERT INTO order_details(order_member_id,order_shipping_address,order_courier,order_shipping_fee,order_total,order_status,order_creation_date)
    VALUES(10003, '33 Jalan Joker', 'GDEX', 30, 480.96, 'SHIPPED OUT','2022-03-24')
''')
cursor.execute('''
    INSERT INTO order_details(order_member_id,order_shipping_address,order_courier,order_shipping_fee,order_total,order_status,order_creation_date)
    VALUES(10004, '44 Jalan Jerry', 'GDEX', 10, 465.00, 'PAID','2022-04-25')
''')
cursor.execute('''
    INSERT INTO order_details(order_member_id,order_shipping_address,order_courier,order_shipping_fee,order_total,order_status,order_creation_date)
    VALUES(10005, '55 Jalan Monday', 'GDEX', 10, 325.00, 'TO PAY','2022-05-26')
''')


# ORDER_ITEM TABLE (TOTAL 10 RECORDS)
cursor.execute('''
    INSERT INTO order_item(oi_id,oi_order_id,oi_product_id,oi_quantity)
    VALUES(40001, 30001, 20001, 1)
''')
cursor.execute('''
    INSERT INTO order_item(oi_order_id,oi_product_id,oi_quantity)
    VALUES(30001, 20003, 1)
''')
cursor.execute('''
    INSERT INTO order_item(oi_order_id,oi_product_id,oi_quantity)
    VALUES(30001, 20009, 2)
''')
cursor.execute('''
    INSERT INTO order_item(oi_order_id,oi_product_id,oi_quantity)
    VALUES(30002, 20011, 1)
''')
cursor.execute('''
    INSERT INTO order_item(oi_order_id,oi_product_id,oi_quantity)
    VALUES(30003, 20006, 1)
''')
cursor.execute('''
    INSERT INTO order_item(oi_order_id,oi_product_id,oi_quantity)
    VALUES(30003, 20008, 1)
''')
cursor.execute('''
    INSERT INTO order_item(oi_order_id,oi_product_id,oi_quantity)
    VALUES(30003, 20010, 2)
''')
cursor.execute('''
    INSERT INTO order_item(oi_order_id,oi_product_id,oi_quantity)
    VALUES(30004, 20012, 1)
''')
cursor.execute('''
    INSERT INTO order_item(oi_order_id,oi_product_id,oi_quantity)
    VALUES(30004, 20014, 1)
''')
cursor.execute('''
    INSERT INTO order_item(oi_order_id,oi_product_id,oi_quantity)
    VALUES(30005, 20015, 1)
''')


# PAYMENT TABLE (TOTAL 4 RECORDS)
cursor.execute('''
    INSERT INTO payment(payment_id,payment_order_id,payment_amount,payment_provider,payment_status)
    VALUES(50001, 30001, 593.21, 'TNG', 'ACCEPTED')
''')
cursor.execute('''
    INSERT INTO payment(payment_order_id,payment_amount,payment_provider,payment_status)
    VALUES(30002, 92.50, 'TNG', 'ACCEPTED')
''')
cursor.execute('''
    INSERT INTO payment(payment_order_id,payment_amount,payment_provider,payment_status)
    VALUES(30003, 510.96, 'VISA', 'ACCEPTED')
''')
cursor.execute('''
    INSERT INTO payment(payment_order_id,payment_amount,payment_provider,payment_status)
    VALUES(30004, 475.00, 'VISA', 'ACCEPTED')
''')


# CART TABLE (TOTAL 5 RECORDS)
cursor.execute('''
    INSERT INTO cart(cart_id,cart_member_id,cart_total,cart_creation_date)
    VALUES(60001, 10001, 474.99, '2022-03-01')
''')
cursor.execute('''
    INSERT INTO cart(cart_member_id,cart_total,cart_creation_date)
    VALUES(10002, 325.00, '2022-04-02')
''')
cursor.execute('''
    INSERT INTO cart(cart_member_id,cart_total,cart_creation_date)
    VALUES(10003, 149.99, '2022-05-03')
''')
cursor.execute('''
    INSERT INTO cart(cart_member_id,cart_total,cart_creation_date)
    VALUES(10004, 181.23, '2022-06-04')
''')
cursor.execute('''
    INSERT INTO cart(cart_member_id,cart_total,cart_creation_date)
    VALUES(10005, 605.00, '2022-07-05')
''')


# CART_ITEM TABLE (TOTAL 8 RECORDS)
cursor.execute('''
    INSERT INTO cart_item(ci_id,ci_cart_id,ci_product_id,ci_quantity)
    VALUES(70001, 60001, 20010, 1)
''')
cursor.execute('''
    INSERT INTO cart_item(ci_cart_id,ci_product_id,ci_quantity)
    VALUES(60001, 20015, 1)
''')
cursor.execute('''
    INSERT INTO cart_item(ci_cart_id,ci_product_id,ci_quantity)
    VALUES(60002, 20014, 1)
''')
cursor.execute('''
    INSERT INTO cart_item(ci_cart_id,ci_product_id,ci_quantity)
    VALUES(60003, 20001, 1)
''')
cursor.execute('''
    INSERT INTO cart_item(ci_cart_id,ci_product_id,ci_quantity)
    VALUES(60004, 20005, 1)
''')
cursor.execute('''
    INSERT INTO cart_item(ci_cart_id,ci_product_id,ci_quantity)
    VALUES(60004, 20007, 1)
''')
cursor.execute('''
    INSERT INTO cart_item(ci_cart_id,ci_product_id,ci_quantity)
    VALUES(60005, 20012, 2)
''')
cursor.execute('''
    INSERT INTO cart_item(ci_cart_id,ci_product_id,ci_quantity)
    VALUES(60005, 20014, 1)
''')


db.commit()
db.close()
