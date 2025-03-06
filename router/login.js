const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email }});
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                isAdmin: true,
            },
        });

        res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            res.json({ message: 'Login successful', user: { id: user.id, email: user.email }});
        });
    })(req, res, next);
});

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: 'Logged out successfully' });
    });
  });

router.get('/me', ensureAuthenticated, (req, res) => {
    res.json({ user: req.user });
});

// const login = require('../controller/login');

// router.get('/token', login.getToken);

module.exports = router;