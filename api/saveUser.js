import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, password } = req.body;

        try {
            const query = "INSERT INTO users (email, password) VALUES ($1, $2)";
            await pool.query(query, [email, password]);

            console.log("Data saved:", email, password); // Debugging
            res.status(200).json({ message: "User saved!" });
        } catch (error) {
            console.error("Database error:", error);
            res.status(500).json({ message: "Failed to save user." });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}