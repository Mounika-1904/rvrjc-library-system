const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Registration
router.post('/register', async (req, res) => {
    const { uniqueId, name, email, password, role, department } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [rows] = await db.query(
            'INSERT INTO users (unique_id, name, email, password, role, department, is_approved) VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING id',
            [uniqueId, name, email, hashedPassword, role || 'student', department]
        );
        const insertId = rows[0].id;

        res.status(201).json({
            message: 'Registration successful. Account pending admin approval.',
            user: { id: insertId, name, role: role || 'student', is_approved: false }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { uniqueId, password, role } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE LOWER(unique_id) = LOWER($1) AND role = $2', [uniqueId, role]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found or role mismatch' });

        const user = rows[0];

        if (!user.is_approved && user.role !== 'admin') {
            return res.status(403).json({ message: 'Account pending admin approval.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'rvrjc_library_secret_key',
            { expiresIn: '1h' }
        );
        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    const { uniqueId, email, newPassword } = req.body;

    if (!uniqueId || !email || !newPassword) {
        return res.status(400).json({ message: 'Unique ID, Email, and New Password are required.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE LOWER(unique_id) = LOWER($1) AND LOWER(email) = LOWER($2)', [uniqueId, email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found or email mismatch.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, rows[0].id]);

        res.json({ message: 'Password updated successfully. You can now log in.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
