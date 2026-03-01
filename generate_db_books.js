const fs = require('fs');
const path = require('path');

const depts = [
    'Chemical Engineering', 'Civil Engineering', 'CSE', 'CSBS', 'CSE-DS',
    'CSE-AIML', 'CSE-IoT', 'ECE', 'EEE', 'Information Technology',
    'Mechanical Engineering', 'Computer Applications', 'Management Sciences',
    'Mathematics & Humanities', 'Chemistry', 'Physics'
];

let books = [];
let id = 1;
depts.forEach(dept => {
    for (let i = 1; i <= 5; i++) {
        books.push({
            id: id++,
            title: `${dept} Resource Volume ${i}`,
            author: `Academic Author ${id}`,
            category: 'Academic',
            department: dept,
            isbn: `9781000${id.toString().padStart(5, '0')}X`,
            available: 1,
            stock_count: 5,
            rating: 4.5,
            image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600'
        });
    }
});

const targetFile = path.join(__dirname, 'backend', 'db.js');
let dbSrc = fs.readFileSync(targetFile, 'utf8');

// Replace DB_BOOKS array
const dbBooksRegex = /const DB_BOOKS = \[[\s\S]*?\];/;
dbSrc = dbSrc.replace(dbBooksRegex, `const DB_BOOKS = ${JSON.stringify(books, null, 4)};`);

// Add seeding logic if not present
if (!dbSrc.includes('SELECT COUNT(*) as count FROM books')) {
    dbSrc = dbSrc.replace(`console.log('Database tables verified/created successfully.');`, `
        const [bookCount] = await connection.query('SELECT COUNT(*) as count FROM books');
        if (bookCount[0].count === 0) {
            for (const book of DB_BOOKS) {
                await connection.query(
                    'INSERT IGNORE INTO books (id, title, author, category, department, isbn, available, stock_count, rating, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [book.id, book.title, book.author, book.category, book.department, book.isbn, book.available, book.stock_count, book.rating, book.image_url]
                );
            }
            console.log('Seeded books table with ' + DB_BOOKS.length + ' books.');
        }
        console.log('Database tables verified/created successfully.');
`);
}

// Fix mockQuery to support filtering by department
const mockBooksQueryRegex = /if \(sql.includes\('SELECT \\\* FROM books'\)\) \{\s*return \[DB_BOOKS\];\s*\}/;
dbSrc = dbSrc.replace(mockBooksQueryRegex, `
    if (sql.includes('SELECT * FROM books')) {
        if (sql.includes('WHERE department = ?')) {
            return [DB_BOOKS.filter(b => b.department === params[0])];
        }
        return [DB_BOOKS];
    }
`);

fs.writeFileSync(targetFile, dbSrc);
console.log("Updated db.js successfully.");
