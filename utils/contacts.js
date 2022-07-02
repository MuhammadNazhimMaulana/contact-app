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

// Export
module.exports = {
    loadContact,
    findContact
};