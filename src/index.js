import express from "express";
import bcrypt from "bcrypt";
import { pool } from "./db.js";

const app = express();
const PORT = 3000;
app.use(express.json());

app.get('/', async function (req, res) {
    try {
        const result = await pool.query('SELECT NOW()');
        if (result) { res.status(200).json({ time: result.rows[0] }) }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

// rooms routes 
app.post('/rooms', async (req, res) => {
    try {
        const { room_no } = req.body; // room_no should be sent by user, I am not seeding the Database 

        const query = pool.query(
            'INSERT INTO rooms (room_no) VALUES ($1) RETURNING *',
            [room_no]
        );

        res.status(200).json({ message: `Room ${room_no} created successfully`, result: (await query).rows[0] })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

app.get('/rooms', async (req, res) => {
    try {
        const query = await pool.query('SELECT * FROM rooms');
        res.status(200).json({ result: query.rows });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

app.get('/rooms/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const room_id = parseInt(id);

        const query = await pool.query(
            'SELECT * FROM rooms WHERE room_no = $1',
            [room_id]
        )

        res.status(200).json({ result: query.rows[0] })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    };
})

// customer routes 
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(401).json({ error: 'Incomplete Payload' });
        };

        // hash the password 
        const hashedPassword = await bcrypt.hash(password, 10);
        // ☝️ this password will go into Database

        const query = await pool.query(
            'INSERT INTO customers (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, hashedPassword]
        );

        const { password: _, ...userWithoutPassword } = query.rows[0];
        res.status(200).json({ message: `User ${name} registered`, result: userWithoutPassword })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    };
});

app.get('/customers', async (req, res) => {
    try {
        const query = await pool.query('SELECT * FROM customers');
        const customers = query.rows.map(({ password: _, ...rest }) => rest)
        res.status(200).json({ result: customers });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// booking route
app.post('/booking', async (req, res) => {
    try {
        const { customer_id, room_no } = req.body;
        if (!customer_id || !room_no) {
            return res.status(401).json({ error: 'Customer ID & Room Number both are required!' })
        };

        // fetch the room with provided room_no 
        const room_query = await pool.query(
            'SELECT * FROM rooms WHERE room_no = $1',
            [room_no]
        );

        // check if room exists or not 
        if (room_query.rows.length === 0) {
            return res.status(400).json({ error: 'Room not found!' })
        };

        const room = room_query.rows[0];

        if (room.is_available === false) {
            return res.status(400).json({ error: `Room ${room_no} is already booked!` })
        };

        // if room is available, create a booking 
        const booking = await pool.query(
            'INSERT INTO bookings (customer_id, room_id) VALUES ($1, $2) RETURNING *',
            [customer_id, room.id]
        );

        // make the room unavailable 
        await pool.query(
            'UPDATE rooms SET is_available = false WHERE id = $1',
            [room.id]
        );

        res.status(200).json({ message: `Room ${room_no} booked successfully!`, result: booking.rows[0] })


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
})

app.listen(PORT, function () {
    console.log(`Express is running on PORT ${PORT}`)
})  