import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

export default function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "POST") {
        const { email, password } = req.body;
        // Save data to your database here
        res.status(200).json({ message: "Data saved successfully!" });
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}