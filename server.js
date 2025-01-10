require('dotenv').config();



const http = require('http');
const app = require('./src/app');



const port = process.env.PORT;
const url = process.env.URL;
const server = http.createServer(app);



server.listen(port, () => {
   console.log(`App iniciado em ${url}:${port}`);
 });



 