const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

// Menggunakan ejs
app.set('view engine', 'ejs');

// Menggunakan ejs-layouts (Third party Middleware)
app.use(expressLayouts);

// Built in middleware
app.use(express.static('public'))

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

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main',
        title: 'Halaman About'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        layout: 'layouts/main',
        title: 'Halaman Contact'
    });
});

app.use((req, res) => {

    res.status(404);
    res.send('<h1>404 Not Found</h1>');
})

app.listen(port, () => {
    console.log(`Contoh Aplikasi yang mendengarkan http:://localhost:${port}`);
});
