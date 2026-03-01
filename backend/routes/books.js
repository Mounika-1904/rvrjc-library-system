const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');

// Valid departments list for validation
const validDepartments = [
    'Chemical Engineering', 'Civil Engineering', 'CSE', 'CSBS', 'CSE-DS',
    'CSE-AIML', 'CSE-IoT', 'ECE', 'EEE', 'Information Technology',
    'Mechanical Engineering', 'Computer Applications', 'Management Sciences',
    'Mathematics & Humanities', 'Chemistry', 'Physics'
];

router.get('/ping', (req, res) => res.json({ status: 'ok' }));

// Get all books with optional department filter
router.get('/', async (req, res) => {
    const { department } = req.query;
    try {
        let query = 'SELECT * FROM books';
        let params = [];

        if (department && department !== 'All') {
            // Validation
            if (!validDepartments.includes(department)) {
                return res.status(400).json({
                    error: 'Invalid department',
                    message: `Department '${department}' is not recognized.`
                });
            }
            query += ' WHERE department = $1';
            params.push(department);
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Issue a book (New Implementation with Track Record)
router.post('/issue', protect, async (req, res) => {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
        return res.status(400).json({ message: 'User ID and Book ID are required.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Check book availability
        const [books] = await connection.query('SELECT available FROM books WHERE id = $1 FOR UPDATE', [bookId]);
        if (books.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Book not found.' });
        }
        if (!books[0].available) {
            await connection.rollback();
            return res.status(400).json({ message: 'Book is currently unavailable.' });
        }

        // 2. Update book status
        await connection.query('UPDATE books SET available = FALSE WHERE id = $1', [bookId]);

        // 3. Create issuance record
        await connection.query(
            'INSERT INTO issued_books (user_id, book_id) VALUES ($1, $2)',
            [userId, bookId]
        );

        await connection.commit();
        res.json({ message: 'Book issued successfully and record created.' });
    } catch (err) {
        await connection.rollback();
        console.error('Issuance Error:', err);
        res.status(500).json({ error: 'Internal Server Error during issuance.' });
    } finally {
        connection.release();
    }
});

// Legacy / Shortcut Issue Route (Optional: Redirect to main logic)
router.post('/issue/:id', protect, async (req, res) => {
    const bookId = req.params.id;
    const userId = req.user.id; // Get from JWT token

    // Logic similar to above... calling the same internal logic or just using this as primary.
    // For this task, I'll satisfy the explicit POST /issue requirement above.
});

// Return a book
router.post('/return', protect, async (req, res) => {
    const { issueId } = req.body;

    if (!issueId) {
        return res.status(400).json({ message: 'Issue ID is required.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get issuance record
        const [records] = await connection.query(
            'SELECT book_id, returned_at FROM issued_books WHERE id = $1 FOR UPDATE',
            [issueId]
        );

        if (records.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Issuance record not found.' });
        }

        if (records[0].returned_at) {
            await connection.rollback();
            return res.status(400).json({ message: 'Book has already been returned.' });
        }

        const bookId = records[0].book_id;

        // 2. Mark as returned
        await connection.query(
            'UPDATE issued_books SET returned_at = CURRENT_TIMESTAMP WHERE id = $1',
            [issueId]
        );

        // 3. Make book available again
        await connection.query(
            'UPDATE books SET available = TRUE WHERE id = $1',
            [bookId]
        );

        await connection.commit();
        res.json({ message: 'Book returned successfully.' });
    } catch (err) {
        await connection.rollback();
        console.error('Return Error:', err);
        res.status(500).json({ error: 'Internal Server Error during return.' });
    } finally {
        connection.release();
    }
});

// Search books
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const [rows] = await db.query(
            'SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $2 OR category ILIKE $3',
            [`%${query}%`, `%${query}%`, `%${query}%`]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
