const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
let noteDatabase = require('./db/db.json');
const PORT = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(noteDatabase);
})

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };
    const response = {
      status: 'success',
      body: newNote,
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        noteDatabase = JSON.parse(data);
        noteDatabase.push(newNote);
        fs.writeFile(
          './db/db.json',
          JSON.stringify(noteDatabase, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Note added.')
        );
      }
    });

    res.status(201).json(response);
  } else {
    res.status(500).json('Failed to post note.');
  }
});

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
