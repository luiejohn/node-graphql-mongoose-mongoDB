const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//allow cross-origin requests or this allows request from the client with different domain
app.use(cors());

// Databse connection to Mlabs
mongoose.connect('mongodb://Lu:test1234@ds161255.mlab.com:61255/gql-tutorial-lu');
mongoose.connection.once('open', ()=> {
    console.log('connected to database');
    app.listen(4000, () => {
        console.log('now listening for request on port 4000');
    });
});

app.use('/graphql', graphqlHTTP({
    //Graph Schema
    schema,
    graphiql: true
}));




