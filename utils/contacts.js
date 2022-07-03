const fs = require('fs');

// Membuat Folder data (jika belum ada)
const dirPath = './data';
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
}

// Membuat file contact.json (jika belum ada)
const dataPath = './data/contact.json';
if(!fs.existsSync(dataPath)){
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

// Load Contact
const loadContact = () => {
    const fileBuffer = fs.readFileSync('data/contact.json', 'utf-8');
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}

// Find contact by name
const findContact = (nama) => {
    const contacts  = loadContact();
    const contact  = contacts.find(
        (contact) => contact.nama.toLowerCase() === nama.toLowerCase());
        return contact
}

// Menimpa File Contacts.json
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contact.json', JSON.stringify(contacts));
};

// Tambah Contact
const addContact = (contact) => {

    // Load Contacts
    const contacts = loadContact();

    // Adding New Contact
    contacts.push(contact);

    // Simpan perubahan
    saveContacts(contacts);
};

// Cek duplikat Contact
const checkDuplicate = (nama) => {

    // Load Contacts
    const contacts = loadContact();

    // Mencari Duplikat
    return contacts.find((contact) => contact.nama === nama);
};


// Delete Contact
const deleteContact = (nama) => {

    // Load Contacts
    const contacts = loadContact();

    // Filter untuk mencari sampai akhir
    const filteredContacts = contacts.filter((contact) => contact.nama !== nama);

    // Save the deleted one
    saveContacts(filteredContacts);

};

// Mengubah Contact
const updateContacts = (contactBaru) => {

    // Load Contacts
    const contacts = loadContact();

    // Filter untuk hilangkan kontak lama
    const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama);

    // Delete oldContact
    delete contactBaru.oldNama;

    // push the data
    filteredContacts.push(contactBaru);

    // Save the updated one
    saveContacts(filteredContacts);

}

// Export
module.exports = {
    loadContact,
    findContact,
    addContact,
    checkDuplicate,
    deleteContact,
    updateContacts
};