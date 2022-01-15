const mongoose = require('mongoose')
const connectToDB = async () =>{
    try {
    const connectionToDB = await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //   useFindAndModify: false,
    })
        console.log(`connected to: ${connectionToDB.connection.host}`)   
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectToDB  