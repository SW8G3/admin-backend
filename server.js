const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

const graphRouter = require('./router/graph');
const loginRouter = require('./router/login');
const qrRouter = require('./router/qr');

const corsOptions = {
    origin: 'http://10.92.0.113:3000',  // Replace with the public IP of your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  };
  


app.use(cors(corsOptions));
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/graph', graphRouter);
app.use('/login', loginRouter);
app.use('/qr', qrRouter);


app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://10.92.0.113:${port}`);
  });