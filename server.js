const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve frontend files

// GET all items (with optional search & sorting)
app.get("/api/items", async (req, res) => {
  try {
    const { search, sort } = req.query;
    let url = `${SUPABASE_URL}/functions/v1/shopping`;

    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    });

    if (!response.ok) throw new Error(`Supabase Error: ${response.statusText}`);

    let data = await response.json();

    if (search) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "place") {
      data.sort((a, b) => a.place.localeCompare(b.place));
    }

    res.json(data);
  } catch (error) {
    console.error("GET request error:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST new item
app.post("/api/items", async (req, res) => {
  try {
    const { name, quantity, place } = req.body;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/shopping`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, quantity, place }),
    });

    if (!response.ok) throw new Error(`Supabase Error: ${response.statusText}`);

    res.json({ success: true, message: "Item added!" });
  } catch (error) {
    console.error("POST request error:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update item
app.put("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, place } = req.body;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/shopping`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, quantity, place }),
    });

    if (!response.ok) throw new Error(`Supabase Error: ${response.statusText}`);

    res.json({ success: true, message: "Item updated!" });
  } catch (error) {
    console.error("PUT request error:", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE item
app.delete("/api/items/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/shopping`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) throw new Error(`Supabase Error: ${response.statusText}`);

    res.json({ success: true, message: "Item deleted!" });
  } catch (error) {
    console.error("DELETE request error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
