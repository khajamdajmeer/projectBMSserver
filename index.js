const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')
const port = 8080;
const router = express.Router();
const MongooseConnection = require('./ConnectToMongoose');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


//Basic api Process
app.use('/api',require('./API/LoginAPI'));

app.listen(port,(err)=>{
    if(err)console.log(err);
    console.log(`listening at port ${port}`)
});

MongooseConnection();