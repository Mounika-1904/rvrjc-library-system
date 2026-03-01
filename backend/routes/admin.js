const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect, adminOnly } = require('../middleware/authMiddleware');

/**
 * GET /api/admin/stats
 * Aggregates site-wide statistics
 */
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const [books] = await db.query('SELECT COUNT(*) as total FROM books');
        const [users] = await db.query("SELECT COUNT(*) as total FROM users WHERE role != 'admin'");
        const [issued] = await db.query('SELECT COUNT(*) as total FROM issued_books WHERE returned_at IS NULL');

        res.json({
            totalBooks: books[0].total,
            totalMembers: users[0].total,
            activeIssuances: issued[0].total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/admin/activity
 * Comprehensive activity log
 */
router.get('/activity', protect, adminOnly, async (req, res) => {
    try {
        const query = `
            SELECT i.id, u.name as userName, u.unique_id as rollNo, i.branch, i.due_date, b.title as bookTitle, i.issued_at, i.returned_at
            FROM issued_books i
            JOIN users u ON i.user_id = u.id
            JOIN books b ON i.book_id = b.id
            ORDER BY i.issued_at DESC
            LIMIT 10
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /api/admin/books
 * Professional book addition endpoint
 */
router.post('/books', protect, adminOnly, async (req, res) => {
    const { title, author, category, department, isbn, imageUrl } = req.body;

    if (!title || !author || !isbn) {
        return res.status(400).json({ message: 'Title, Author, and ISBN are required.' });
    }

    try {
        await db.query(
            'INSERT INTO books (title, author, category, department, isbn, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
            [title, author, category, department, isbn, imageUrl]
        );
        res.status(201).json({ message: 'Book added to catalog successfully.' });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ message: 'A book with this ISBN already exists.' });
        }
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/admin/users/pending
 * Retrieve users pending approval
 */
router.get('/users/pending', protect, adminOnly, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, unique_id, name, email, department, role, created_at FROM users WHERE is_approved = FALSE'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /api/admin/users/approve/:id
 * Approve a user by their ID
 */
router.post('/users/approve/:id', protect, adminOnly, async (req, res) => {
    const userId = req.params.id;
    try {
        const [result] = await db.query('UPDATE users SET is_approved = TRUE WHERE id = $1 RETURNING id', [userId]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({ message: 'User approved successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
