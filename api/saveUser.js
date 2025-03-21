import { Pool } from 'pg';

// PostgreSQL connection setup using Neon connection URL
const pool = new Pool({
    connectionString: process.env.NEON_DB_URL, // Store in Vercel environment variables
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            await pool.query(
                'INSERT INTO users (email, password) VALUES ($1, $2)',
                [email, password]
            );
            res.status(200).json({ message: 'User saved successfully!' });
        } catch (error) {
            console.error('Error saving user:', error);
            res.status(500).json({ message: 'Error saving user.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}