const { useDatabase } = require("../tools/useDatabase");
const router = require("express").Router();

router.get("/get/:UserID", async (req, res) => {
  const { UserID } = req.params;

  try {
    const notes = await useDatabase(
      "SELECT * FROM note WHERE note.UserID = ?",
      [UserID]
    );

    res.send(notes);
  } catch (error) {
    res.status(500).json({ errorCode: "DATABASE_ERROR", message: error.code });
  }
});

router.put("/update/:NoteID", async (req, res) => {
  // {
  //   Title:      STRING
  //   Content:    STRING
  // }
  const { NoteID } = req.params;
  const { Title, Content } = req.body;

  if (!Title || !Content) {
    return res.status(400).json({
      errorCode: "MISSING_FIELDS",
      message: "Title and Content are required for the update.",
    });
  }

  try {
    await useDatabase(
      "UPDATE note SET Title = ?, Content = ?, LastModifiedDate = current_timestamp() WHERE NoteID = ?",
      [Title, Content, NoteID]
    );

    res.json({ message: "Note updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
});

router.post("/add", async (req, res) => {
  const { Title, Content, UserID } = req.body;

  if (!Title || !Content || !UserID) {
    return res.status(400).json({
      errorCode: "MISSING_FIELDS",
      message: "Title, Content, and UserID are required for adding a new note.",
    });
  }

  try {
    await useDatabase(
      "INSERT INTO note (Title, Content, UserID, LastModifiedDate) VALUES (?, ?, ?, current_timestamp())",
      [Title, Content, UserID]
    );

    res.json({ message: "Note added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
});

router.delete("/delete/:NoteID", async (req, res) => {
  const { NoteID } = req.params;

  try {
    // Check if the note with the given NoteID exists
    const existingNote = await useDatabase(
      "SELECT * FROM note WHERE NoteID = ?",
      [NoteID]
    );

    if (!existingNote || existingNote.length === 0) {
      return res.status(404).json({
        errorCode: "NOT_FOUND",
        message: "Note not found.",
      });
    }

    // Delete the note with the given NoteID
    await useDatabase("DELETE FROM note WHERE NoteID = ?", [NoteID]);

    res.json({ message: "Note deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errorCode: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    });
  }
});

router.post("/setfav", async (req, res) => {
  const { NoteID, FavState } = req.body;

  if (NoteID !== undefined && FavState !== undefined) {
    try {
      await useDatabase("UPDATE note SET IsFav = ? WHERE NoteID = ?", [
        FavState,
        NoteID,
      ]);
      res.status(200).send("Record updated successfully");
    } catch (error) {
      console.error("Error updating record:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(400).send("Missing parameters");
  }
});

module.exports = router;
