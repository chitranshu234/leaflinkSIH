// 0. Load environment variables from .env file
require('dotenv').config();

// 1. Import Packages
const express = require('express');
const mongoose = require('mongoose');
const Herb = require('./models/Herb'); // <-- IMPORT OUR HERB MODEL

// 2. Initialize the Express app
const app = express();

// --- MIDDLEWARE ---
app.use(express.json()); // <-- ENABLE SERVER TO READ JSON
app.use(express.static('public'));

// --- DATABASE CONNECTION ---
const mongoURI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();
// --- END OF DATABASE CONNECTION ---

// --- API ROUTES ---

// @route   GET /
// @desc    Test route
app.get('/', (req, res) => {
  res.send('Welcome to the LeafLink API!');
});

// @route   POST /api/herbs
// @desc    Create a new herb entry
app.post('/api/herbs', async (req, res) => {
  try {
    // 1. Get the data from the request body
    const {
      herbName,
      botanicalName,
      collectorName,
      gpsCoordinates,
      batchPhotoURL,
      qualityNotes,
    } = req.body;

    // 2. Create a new document using our Herb model
    const newHerb = new Herb({
      herbName,
      botanicalName,
      collectorName,
      gpsCoordinates,
      batchPhotoURL,
      qualityNotes,
    });

    // 3. Save the new document to the database
    const savedHerb = await newHerb.save();

    // 4. Send a success response back with the saved data
    res.status(201).json(savedHerb);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/herbs
// @desc    Get all herb entries
app.get('/api/herbs', async (req, res) => {
  try {
    const herbs = await Herb.find();
    res.json(herbs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/herbs/:id
// @desc    Get a single herb by its ID
app.get('/api/herbs/:id', async (req, res) => {
  try {
    // 1. Find the herb in the database using the ID from the URL
    const herb = await Herb.findById(req.params.id);

    // 2. If no herb is found with that ID, send a 404 error
    if (!herb) {
      return res.status(404).json({ msg: 'Herb not found' });
    }

    // 3. If found, send the herb data back
    res.json(herb);
  } catch (err) {
    console.error(err.message);
    // This can also happen if the provided ID is not a valid format
    res.status(500).send('Server Error');
  }
});

// --- END OF API ROUTES ---

// 3. Define the port number
const PORT = 3000;

// 4. Start the server
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});