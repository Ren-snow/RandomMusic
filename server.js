import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Spotify credentials are not set");
}

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/token", async (req, res, next) => {
    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(
                        process.env.SPOTIFY_CLIENT_ID +
                            ":" +
                            process.env.SPOTIFY_CLIENT_SECRET
                    ).toString("base64"),
            },
            body: "grant_type=client_credentials",
        });
        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json({
              error: data.error || "Failed to fetch token from Spotify"
            })
        }
        res.json(data);
    } catch (error) {
        next(error);
    }
});

app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(500).json({ error: "Error in server" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});