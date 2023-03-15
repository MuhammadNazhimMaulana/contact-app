const express = require('express');
const expressLayouts = require('express-ejs-layouts');

// Calling Validator
const { body, validationResult, check } = require('express-validator');

// Using exported modules
const { loadContact, findContact, addContact, checkDuplicate, deleteContact, updateContacts} = require('./utils/contacts');

// For Flash message
const session = require('express-session');
const flash = require('connect-flash');

// For Cookie
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Menggunakan ejs
app.set('view engine', 'ejs');

// Menggunakan ejs-layouts (Third party Middleware)
app.use(expressLayouts);

// Built in middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // For Parsing (Enable extended for avoiding problem)

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

// Contact Page
app.get('/contact', (req, res) => {

    // Load contacts
    const contacts = loadContact();

    res.render('contact', {
        layout: 'layouts/main',
        title: 'Halaman Contact',
        contacts,
        msg: req.flash('msg')
    });
});

// Tambah Data Contact
app.get('/contact/add', (req, res) => {

    res.render('addContact', {
        layout: 'layouts/main',
        title: 'Halaman Tambah Contact'
    });
});

// Proses Tambah Data
app.post('/contact', [

    // Validation
    check('email', 'Email Tidak Valid').isEmail(),
    check('nohp', 'No HP Tidak Valid').isMobilePhone('id-ID'),

    // Custom Validation
    body('nama').custom((value) => {

        // Cek Duplikatnya
        const duplicate = checkDuplicate(value);

        // Kalau Ada yang duplikat
        if(duplicate){
            throw new Error('Nama Kontak Sudah ada');
        }

        return true;
    })

], (req, res) => {

    // Konstanta errors
    const errors = validationResult(req);

    // Kalau error
    if(!errors.isEmpty())
    {
        // If Error
        // return res.status(400).json({ errors: errors.array() });

        res.render('addContact', {
            layout: 'layouts/main',
            title: 'Halaman Tambah Contact',
            errors: errors.array(),
        });

    }else{

        // New Function for adding contact
        addContact(req.body);
        
        // Sending flash Message
        req.flash('msg', 'Kontak Berhasil Ditambahkan');

        // Redirect 
        res.redirect('/contact');
    }

});

// Proses Delete
app.get('/contact/delete/:nama', (req, res) => {

    // Load contacts
    const contact = findContact(req.params.nama);

    // If the contact is not exist
    if( !contact )
    {
        res.status(404);
        res.send('<h1>Gagal</h1>');
        
    }else{
        // If exist delete
        deleteContact(req.params.nama);

        // Sending flash Message
        req.flash('msg', 'Kontak Berhasil Dihapus');

        // Redirect
        res.redirect('/contact');
    }
});

// Ubah data contact
app.get('/contact/edit/:nama', (req, res) => {

    // Getting contact
    const contact = findContact(req.params.nama);

    res.render('editContact', {
        layout: 'layouts/main',
        title: 'Halaman Edit Contact',
        contact
    });
});

// Proses Ubah data contact
app.post('/contact/update', [

    // Validation
    check('email', 'Email Tidak Valid').isEmail(),
    check('nohp', 'No HP Tidak Valid').isMobilePhone('id-ID'),

    // Custom Validation
    body('nama').custom((value, { req }) => {

        // Cek Duplikatnya
        const duplicate = checkDuplicate(value);

        // Kalau Ada yang duplikat dan namanya sama
        if( value!= req.body.oldNama && duplicate ){
            throw new Error('Nama Kontak Sudah ada');
        }

        return true;
    })

], (req, res) => {

    // Konstanta errors
    const errors = validationResult(req);

    // Kalau error
    if(!errors.isEmpty())
    {
        // If Error
        res.render('editContact', {
            layout: 'layouts/main',
            title: 'Halaman Ubah Contact',
            errors: errors.array(),
            contact: req.body
        });

    }else{

        // New Function for updating contact
        updateContacts(req.body);
        
        // Sending flash Message
        req.flash('msg', 'Kontak Berhasil Diubah');

        // Redirect 
        res.redirect('/contact');
    }

});


// Detail Contact Page
app.get('/contact/:nama', (req, res) => {

    // Load contacts
    const contact = findContact(req.params.nama);

    res.render('detailContact', {
        layout: 'layouts/main',
        title: 'Halaman Detail Contact',
        contact
    });
});

app.use((req, res) => {

    res.status(404);
    res.send('<h1>404 Not Found</h1>');
})

app.listen(port, () => {
    console.log(`Contoh Aplikasi yang mendengarkan http:://localhost:${port}`);
});
