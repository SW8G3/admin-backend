require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const PgSession = require('connect-pg-simple')(session);

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

const nodeRouter = require('./router/node');
const edgeRouter = require('./router/edge');
const loginRouter = require('./router/login');

// Middleware
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Session configuration
app.use(
    session({
        store: new PgSession({
            conString: process.env.DATABASE_URL,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // in production, cookies are sent over HTTPS
            maxAge: 1000 * 60 * 60 * 24, // expires in 1 day
        },
    })
);

// Initialise Passport for authentication
app.use(passport.initialize());
app.use(passport.session());

// Passport local strategy
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return done (null, false, { message: 'User not found' });

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) return done(null, false, { message: 'Incorrect password' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// app.use(express.static(__dirname));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.use('/node', nodeRouter);
app.use('/edge', edgeRouter);
app.use('/', loginRouter);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});