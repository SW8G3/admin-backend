const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

//const nodeRouter = require('./router/node');
//const edgeRouter = require('./router/edge');
const graphRouter = require('./router/graph');
const loginRouter = require('./router/login');


app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//app.use('/node', nodeRouter);
//app.use('/edge', edgeRouter);
app.use('/graph', graphRouter);
app.use('/login', loginRouter);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});