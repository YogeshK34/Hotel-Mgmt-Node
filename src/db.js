import { Pool } from 'pg'

export const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '123456',
    database: 'hoteldb'
});