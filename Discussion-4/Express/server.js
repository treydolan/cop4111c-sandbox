const express = require("express");
const fs      = require("fs");
const path    = require("path");
const crypto  = require("crypto");

const app      = express();
const PORT     = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

// Middleware — parse incoming JSON bodies and serve static files
app.use(express.json());
app.use(express.static(__dirname));

// Helpers
function readNotes() {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeNotes(notes) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

// READ — get all notes
app.get("/notes", (req, res) => {
    res.json(readNotes());
});

// CREATE — add a new note
app.post("/notes", (req, res) => {
    const { title, body } = req.body;
    const notes = readNotes();
    const note  = { id: crypto.randomUUID(), title, body };
    notes.push(note);
    writeNotes(notes);
    res.status(201).json(note);
});

// UPDATE — edit a note by id
app.put("/notes/:id", (req, res) => {
    const notes = readNotes();
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    notes[index] = { ...notes[index], ...req.body };
    writeNotes(notes);
    res.json(notes[index]);
});

// DELETE — remove a note by id
app.delete("/notes/:id", (req, res) => {
    let notes = readNotes();
    notes = notes.filter(n => n.id !== req.params.id);
    writeNotes(notes);
    res.json({ message: "Deleted" });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));