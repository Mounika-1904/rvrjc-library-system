const db = require('./backend/db');
setTimeout(async () => {
    try {
        console.log("querying...");
        const [rows] = await db.query('SELECT * FROM books', []);
        console.log("done querying, rows:", rows.length);
    } catch (e) {
        console.error(e);
    }
    process.exit();
}, 2000);
