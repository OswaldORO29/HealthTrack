const mongoose = require('mongoose'); //invoca

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Succesful connection to MongoDB 😎')
    } catch (error){
        console.error('🫸Error connection MongoDB: ', error.message);
        process.exit(1);    
    }
}

module.exports = connectDB;// se pone en expuesto en todo el aplicativo