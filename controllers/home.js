const { request } = require("express")
const axios = require('axios')

module.exports = {
    getIndex: async (req, res)=>{
        let quote = await axios.get('https://inspiration.goprogram.ai/')
        quote = quote.data
        console.log(quote)
        res.render('index.ejs', {quote} )
    }
}