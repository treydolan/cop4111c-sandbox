from flask import Flask, request, jsonify, send_from_directory
import json, os, uuid

app = Flask(__name__)
DATA_FILE = "data.json"

# --- Helpers ---
def read_notes():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def write_notes(notes):
    with open(DATA_FILE, "w") as f:
        json.dump(notes, f, indent=2)

# --- Serve frontend ---
@app.route("/")
def index():
    return send_from_directory(".", "index.html")

# --- CRUD Routes ---

# READ - get all notes
@app.route("/notes", methods=["GET"])
def get_notes():
    return jsonify(read_notes())

# CREATE - add a new note
@app.route("/notes", methods=["POST"])
def create_note():
    data = request.get_json()
    notes = read_notes()
    note = {"id": str(uuid.uuid4()), "title": data["title"], "body": data["body"]}
    notes.append(note)
    write_notes(notes)
    return jsonify(note), 201

# UPDATE - edit a note by id
@app.route("/notes/<id>", methods=["PUT"])
def update_note(id):
    data = request.get_json()
    notes = read_notes()
    for note in notes:
        if note["id"] == id:
            note["title"] = data.get("title", note["title"])
            note["body"] = data.get("body", note["body"])
            write_notes(notes)
            return jsonify(note)
    return jsonify({"error": "Not found"}), 404

# DELETE - remove a note by id
@app.route("/notes/<id>", methods=["DELETE"])
def delete_note(id):
    notes = read_notes()
    notes = [n for n in notes if n["id"] != id]
    write_notes(notes)
    return jsonify({"message": "Deleted"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)