const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override')

require('./utils/db')

// Contact (Model)
const Contact = require('./model/Contact')

const app = express();
const port = 3000;

// Set up method override
app.use(methodOverride('_method'));

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
    check('noHp', 'No HP Tidak Valid').isMobilePhone('id-ID'),

    // Custom Validation
    body('nama').custom(async (value) => {

        // Cek Duplikatnya
        const duplicate = await Contact.findOne({ nama: value });

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
        res.render('addContact', {
            layout: 'layouts/main',
            title: 'Halaman Tambah Contact',
            errors: errors.array(),
        });

    }else{

        // New Function for adding contact
        Contact.insertMany(req.body, (error, result) => {
            // Sending flash Message
            req.flash('msg', 'Kontak Berhasil Ditambahkan');
    
            // Redirect 
            res.redirect('/contact');
        });
    }
});

// Proses Delete
// app.get('/contact/delete/:nama', async (req, res) => {

//     // Load contacts
//     const contact = await Contact.findOne({ nama: req.params.nama});

//     // If the contact is not exist
//     if( !contact )
//     {
//         res.status(404);
//         res.send('<h1>Gagal</h1>');
        
//     }else{
//         // If exist delete
//         Contact.deleteOne({ _id: contact._id}).then((result) => {
//             // Sending flash Message
//             req.flash('msg', 'Kontak Berhasil Dihapus');
    
//             // Redirect
//             res.redirect('/contact');
//         });
//     }
// });

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama}).then((result) => {
        // Sending flash Message
        req.flash('msg', 'Kontak Berhasil Dihapus');

        // Redirect
        res.redirect('/contact');
    });    
});

// Ubah data contact
app.get('/contact/edit/:nama', async (req, res) => {

    // Getting contact
    const contact = await Contact.findOne({ nama: req.params.nama });

    res.render('editContact', {
        layout: 'layouts/main',
        title: 'Halaman Edit Contact',
        contact
    });
});

// Proses Ubah data contact
app.put('/contact', [

    // Validation
    check('email', 'Email Tidak Valid').isEmail(),
    check('noHp', 'No HP Tidak Valid').isMobilePhone('id-ID'),

    // Custom Validation
    body('nama').custom(async (value, { req }) => {

        // Cek Duplikatnya
        const duplicate = await Contact.findOne({ nama: value});

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
        Contact.updateOne(
            {
                _id: req.body._id
            },
            {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    noHp: req.body.noHp
                }
            }
        ).then((result) => {
            // Sending flash Message
            req.flash('msg', 'Kontak Berhasil Diubah');
    
            // Redirect 
            res.redirect('/contact');
        });
    }

});

// Detail Contact Page
app.get('/contact/:nama', async (req, res) => {

    // Load contacts
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