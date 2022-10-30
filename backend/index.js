const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const pinRoute = require('./routes/pins')
const userRoute = require('./routes/users')

const app = express();
app.use(express.json());
dotenv.config();


// Route
app.use('/api/pins', pinRoute);
app.use('/api/users', userRoute);


const connect = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        throw error
    }
}
mongoose.connection.on('connected', () => {
    console.log("MongoDB connected");
});
mongoose.connection.on('disconnected', () => {
    console.log("MongoDB disconnected");
});

app.listen(5000, ()=>{
    connect();
    console.log('server is up and running')
})