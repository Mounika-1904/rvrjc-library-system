const express = require('express');
const router = express.Router();
const db = require('../db');
const { protect } = require('../middleware/authMiddleware');

// GET /api/cart - Fetch cart items for the user
router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const query = `
            SELECT c.id as cart_id, b.* 
            FROM cart c 
            JOIN books b ON c.book_id = b.id 
            WHERE c.user_id = $1
            ORDER BY c.added_at DESC
        `;
        const [rows] = await db.query(query, [userId]);
        res.json(rows);
    } catch (err) {
        console.error('Cart GET exact error:', err);
        res.status(500).json({ message: 'Error fetching cart items' });
    }
});

// POST /api/cart - Add a book to cart
router.post('/', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.body;

        if (!bookId) {
            return res.status(400).json({ message: 'Book ID is required' });
        }

        // Check stock
        const bookQuery = 'SELECT stock_count, available FROM books WHERE id = $1';
        const [books] = await db.query(bookQuery, [bookId]);

        if (books.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (books[0].stock_count <= 0 && !books[0].available) {
            return res.status(400).json({ message: 'Book is out of stock' });
        }

        const insertQuery = 'INSERT INTO cart (user_id, book_id) VALUES ($1, $2) RETURNING id';
        const [rows] = await db.query(insertQuery, [userId, bookId]);

        res.status(201).json({ message: 'Book added to cart', cartId: rows[0].id });
    } catch (err) {
        console.error('Cart POST exact error:', err);
        res.status(500).json({ message: 'Error adding to cart' });
    }
});

// DELETE /api/cart/:id - Remove item from cart
router.delete('/:id', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const cartId = req.params.id;

        const deleteQuery = 'DELETE FROM cart WHERE id = $1 AND user_id = $2';
        const [rows, fields, result] = await db.query(deleteQuery, [cartId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cart item not found or unauthorized' });
        }

        res.json({ message: 'Item removed from cart from database' });
    } catch (err) {
        console.error('Cart DELETE exact error:', err);
        res.status(500).json({ message: 'Error removing from cart' });
    }
});

module.exports = router;
