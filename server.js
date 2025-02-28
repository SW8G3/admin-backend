const express = require('express');
const app = express();
const port = 3001;

const nodeRouter = require('./router/node');
const edgeRouter = require('./router/edge');
const loginRouter = require('./router/login');

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/node', nodeRouter);
app.use('/edge', edgeRouter);
app.use('/login', loginRouter);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});