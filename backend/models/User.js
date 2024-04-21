const mongoose=require('mongoose')

const travelUserSchema = new mongoose.Schema({
    username: {type:String, unique:true},
    password: {type:String},
  }, {timestamps: true});
  
module.exports = mongoose.model('travelUser', travelUserSchema);