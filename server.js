const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

const graphRouter = require('./router/graph');
const loginRouter = require('./router/login');
const qrRouter = require('./router/qr');

const corsOptions = {
  origin: ['http://10.92.0.113:3000', 'http://localhost:3000'],  // Allow requests from the frontend (which is running on this IP and port)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/graph', graphRouter);
app.use('/auth', loginRouter);
app.use('/qr', qrRouter);

// Global error handler
app.use((err, req, res) => {
  console.error(err.stack);

  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://10.92.0.113:${port}`);
});