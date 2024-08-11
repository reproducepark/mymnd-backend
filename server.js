// server.js
const express = require('express');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const { sequelize, AuthCode } = require('./database');
const { initializeDatabase } = require('./initDatabase');

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "yourjwtsecret";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT options.
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        if (jwt_payload) {
            return done(null, jwt_payload);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

app.use(passport.initialize());

// login authentication api
app.post('/api/authenticate', async (req, res) => {
    const { code } = req.body;

    try {
        // One code can be used multiple times.
        const authCode = await AuthCode.findOne({ where: { code } });

        // const authCode = await AuthCode.findOne({ where: { code, used: false } });
        console.log(authCode)

        if (authCode) {
            // JWT 생성
            // Token does not expire
            const token = jwt.sign({ code: authCode.code }, JWT_SECRET, {});

            authCode.used = true;
            authCode.used_date = new Date();
            await authCode.save();

            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ message: 'Invalid or already used code' });
        }
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// check authentication api
app.get('/api/check-auth', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.status(200).json({ isAuthenticated: true });
});

// serve frontend
app.use(express.static(path.join(__dirname, '../mymnd/build/')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../mymnd/build/index.html'));
});

// start server on port 3000
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await initializeDatabase();
        await sequelize.sync().then(() => {
            console.log('Database synchronized');
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error during startup:', error);
    }
}

startServer();
