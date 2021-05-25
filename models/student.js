const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		minlength:5,
		unique:true
		
	},
	prn:{
		type:String,
		required:true,
		minlength:10,
		unique:true
		
	}
})


const links = new mongoose.Schema({
	name:{
		type:String,
		required:true,
	},
	title:{
		type:String,
		required:true
	},
	hash:{
		type:String,
		required:true
	}
	
})


module.exports = { studentSchema,links }


