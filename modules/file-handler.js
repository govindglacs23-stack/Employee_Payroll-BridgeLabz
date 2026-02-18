const fs = require('fs').promises;
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', 'employees.json');

async function readEmployees() {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Error reading employees:', err);
        throw err;
    }
}

async function writeEmployees(employees) {
    try {
        await fs.writeFile(FILE_PATH, JSON.stringify(employees, null, 2));
    } catch (err) {
        console.error('Error writing employees:', err);
        throw err;
    }
}

module.exports = { readEmployees, writeEmployees };
