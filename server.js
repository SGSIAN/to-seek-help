const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure the uploads directory exists at startup
const uploadPath = path.join(__dirname, 'uploads/');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// Setup Multer for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware to parse incoming JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for images and other assets)
app.use('/uploads', express.static(uploadPath));
app.use(express.static(path.join(__dirname, 'public')));

// Routes to serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Update with your actual main page
});

app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'gallery.html'));
});

// API route to fetch gallery data
app.get('/api/gallery', (req, res) => {
    const uploadsFilePath = path.join(__dirname, 'uploads.json'); // Full path to JSON file
    if (!fs.existsSync(uploadsFilePath)) {
        console.error('uploads.json file not found');
        return res.status(404).json({ success: false, message: 'Gallery data not found' });
    }

    try {
        const data = fs.readFileSync(uploadsFilePath, 'utf8');
        const uploadsData = JSON.parse(data);
        res.status(200).json(uploadsData);
    } catch (error) {
        console.error('Error reading or parsing uploads.json:', error);
        res.status(500).json({ success: false, message: 'Error reading gallery data' });
    }
});

// API route to handle image uploads
app.post('/upload-artwork', upload.single('image'), (req, res) => {
    const { title, description, artistName, contactId } = req.body;

    if (!title || !description || !artistName || !contactId || !req.file) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newArtwork = {
        imagePath: `/uploads/${req.file.filename}`,
        title,
        description,
        artistName,
        contactId,
    };

    const uploadsFilePath = path.join(__dirname, 'uploads.json');
    let uploadsData = [];
    if (fs.existsSync(uploadsFilePath)) {
        try {
            const data = fs.readFileSync(uploadsFilePath, 'utf8');
            uploadsData = JSON.parse(data);
        } catch (error) {
            console.error('Error reading uploads.json:', error);
            return res.status(500).json({ success: false, message: 'Error saving artwork' });
        }
    }

    uploadsData.push(newArtwork);

    try {
        fs.writeFileSync(uploadsFilePath, JSON.stringify(uploadsData, null, 2));
        res.status(201).json({ success: true, message: 'Artwork uploaded successfully', newArtwork });
    } catch (error) {
        console.error('Error writing to uploads.json:', error);
        res.status(500).json({ success: false, message: 'Error saving artwork' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
