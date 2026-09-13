-- rooms schema table 
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY, 
    room_no INT UNIQUE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

-- customers schema 
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL
);

-- booking schema 
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY, 
    customer_id INT references customers(id) ON DELETE CASCADE,
    room_id INT references rooms(id) ON DELETE CASCADE,
    booked_at TIMESTAMP DEFAULT NOW()
);