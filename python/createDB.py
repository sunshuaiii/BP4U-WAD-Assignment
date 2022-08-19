##
# Execute this script once to create the database & table
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
    product_photo BLOB NOT NULL,
    product_desc TEXT NOT NULL,
    product_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    product_category TEXT CHECK( product_category IN ('N/A','Album','Magazine','Fashion') ) NOT NULL DEFAULT 'N/A'
)''')   

db.execute('DROP TABLE IF EXISTS order_details')
db.execute('''CREATE TABLE IF NOT EXISTS order_details(
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_member_id INTEGER NOT NULL,
    order_shipping_address TEXT NOT NULL,
    order_courier TEXT NOT NULL,
    order_shipping_fee REAL NOT NULL,
    order_total REAL NOT NULL,
    order_status TEXT CHECK( order_status IN ('To Pay','Paid','Shipped Out','Delivered') ) NOT NULL DEFAULT 'To Pay',
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
    payment_status TEXT CHECK( payment_status IN ('Pending', 'Accepted','Declined') ) NOT NULL DEFAULT 'Pending',
    payment_creation_date DATETIME,
    FOREIGN KEY(payment_order_id) REFERENCES order_details(order_id)
)''')   

db.execute('ALTER TABLE order_details ADD COLUMN order_payment_id INTEGER REFERENCES payment(payment_id)')

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

cursor.execute('''
    INSERT INTO member(member_id,member_username,member_first_name,member_last_name,member_password,member_email,member_phone,member_address,member_reg_date)
    VALUES(10001, 'john123', 'John', 'Smith', 'john123', 'john@gmail.com', '012-9345412','84 Jalan Hang Jebat', '2022-03-01')
''')

cursor.execute('''
    INSERT INTO product(product_id,product_name,product_price,product_weight,product_stock,product_discount_percent,product_photo,product_desc,product_creation_date,product_category)
    VALUES(20001, 'BORN PINK EXCLUSIVE BOX SET - BLACK VERSION', 149.99, 0.5, 10000, 0, 'D:\Downloads\bornpink.png', 'BLACKPINK 2nd Full Album','2022-08-19', 'Album')
''')

cursor.execute('''
    INSERT INTO order_details(order_id,order_member_id,order_shipping_address,order_courier,order_shipping_fee,order_total,order_status,order_creation_date,order_payment_id)
    VALUES(30001, 10001, '84 Jalan Hang Jebat', 'PostLaju', 10, 149.99, 'To Pay','2022-08-19', 50001)
''')

cursor.execute('''
    INSERT INTO order_item(oi_id,oi_order_id,oi_product_id,oi_quantity)
    VALUES(40001, 30001, 20001, 1)
''')

cursor.execute('''
    INSERT INTO payment(payment_id,payment_order_id,payment_amount,payment_provider,payment_status)
    VALUES(50001, 30001, 149.99, 'TNG', 'Pending')
''')

cursor.execute('''
    INSERT INTO cart(cart_id,cart_member_id,cart_total,cart_creation_date)
    VALUES(60001, 10001, 299.98, '2022-08-19')
''')

cursor.execute('''
    INSERT INTO cart_item(ci_id,ci_cart_id,ci_product_id,ci_quantity)
    VALUES(70001, 60001, 20001, 2)
''')

db.commit()
db.close()