const express = require('express');
const expressLayouts = require('express-ejs-layouts');

require('./utils/db')

// Contact (Model)
const Contact = require('./model/Contact')

const app = express();
const port = 3000;

// Setup ejs
app.set('view engine', 'ejs');

// Menggunakan ejs-layouts (Third party Middleware)
app.use(expressLayouts);

// Built in middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // For Parsing (Enable extended for avoiding problem)

// For Flash message
const session = require('express-session');
const flash = require('connect-flash');

// For Cookie
const cookieParser = require('cookie-parser');

// Konfigurasi Flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    })
);
app.use(flash());

// Halaman Home
app.get('/', (req, res) => {

    // Array of Object
    const mahasiswa = [
        {
            nama: 'Tono',
            email: 'tono@gmail.com'
        },
        {
            nama: 'Toni',
            email: 'toni@gmail.com'
        },
        {
            nama: 'Tona',
            email: 'tona@gmail.com'
        }
    ];

    // Sending Data
    res.render('index', {
        layout: 'layouts/main',
        name: 'Budi', 
        title: 'Halaman Home',
        mahasiswa,
    });

});

// Halaman About
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main',
        title: 'Halaman About'
    });
});

// Halaman Kontak
app.get('/contact', async (req, res) => {
    // Load contacts
    const contacts = await Contact.find();

    res.render('contact', {
        layout: 'layouts/main',
        title: 'Halaman Contact',
        contacts,
        msg: req.flash('msg')
    });
});

// Detail Contact Page
app.get('/contact/:nama', async (req, res) => {

    // Load contacts
    // const contact = findContact(req.params.nama);
    const contact = await Contact.findOne({ nama: req.params.nama });

    res.render('detailContact', {
        layout: 'layouts/main',
        title: 'Halaman Detail Contact',
        contact
    });
});

app.listen(port, () => {
    console.log(`Jalan di http://localhost:${port}`);
});