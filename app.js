
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const { studentSchema,links } = require('./models/student')
const cryptoRandomString = require('crypto-random-string')
const port = process.env.PORT || 3000;

const app = express()

app.use(express.json())
app.use(express.static('./public'))
app.use(express.static('./src'))
app.use(express.static('./attendance'))
app.use(express.static('./errors'))
app.use(express.urlencoded({extended:true}))


app.get('/create',(req,res)=>{
	res.sendFile(path.join(__dirname,'/public/create.html'))
})

app.post('/create',async(req,res)=>{
	const { name ,title } = req.body
	const url = 'mongodb+srv://<MongoDB atlas URL>'
	var conn = mongoose.createConnection(url,{
		useNewUrlParser:true,
		useUnifiedTopology: true,
		usecreateIndexes:true
	})
	const link = conn.model('links',links);
	
	const hashval = cryptoRandomString({length: 15,type:'alphanumeric'})
	var fullUrl = req.protocol + '://' + req.get('host') + '/attendance?db=' +  hashval;

	const newLink = link({
		name:name,
		title:title,
		hash:hashval
	})

	try
	{
		const result = await newLink.save()
		res.send(`<h1>Share this link for attendance</h1>
				<a href=${fullUrl}>${fullUrl}</a>`)
	}
	catch(e)
	{
		res.send(e)
	}
	
})



app.get('/attendance',async(req,res)=>{

	const{ db } = req.query
	if(!db)
	{
		return res.sendFile(path.join(__dirname,'errors/error.html'))
	}



	const url = `mongodb+srv://<MongoDB atlas URL>`

	
	var conn = mongoose.createConnection(url,{
		useNewUrlParser:true,
		useUnifiedTopology: true,
		usecreateIndexes:true
	})
	const link = conn.model('links',links);

	const result = await link.findOne({hash:db})
	if(!result)
	{
		return res.sendFile(path.join(__dirname,'errors/error.html'))
	}


	res.sendFile(path.join(__dirname,'/attendance/attendance.html'))

})

app.post('/attendance', async(req,res)=>{

	const{ db }= req.query
	if(!db)
	{
		return res.sendFile(path.join(__dirname,'errors/error.html'))
	}
	const date = new Date().toISOString().split('T')[0];

	
	const { name,prn } = req.body
	const url = `mongodb+srv://<MongoDB atlas URL>/${db}`
	var conn = mongoose.createConnection(url,{
		useNewUrlParser:true,
		useUnifiedTopology: true,
		usecreateIndexes:true
	})
	const student = conn.model(date,studentSchema)
	const newStudent = new student(req.body)
	try{
		const result = await newStudent.save()
		
		res.send('<script>alert("Recorded"); window.location.assign(window.location.href)</script>')
	}catch(e)
	{
		res.send('<script>alert(`ERROR!!\nSeems like attendennce is already recorded or you entered invalid information.\nPlease Try Again!!` ); window.location.assign(window.location.href)</script>')

	}

})

app.get('/get/:db',async(req,res)=>{
	const { db } = req.params
	if(!db)
	{
		return res.sendFile(path.join(__dirname,'errors/error.html'))
	}

	const url = `mongodb+srv://<MongoDB atlas URL>`

	var conn = mongoose.createConnection(url,{
		useNewUrlParser:true,
		useUnifiedTopology: true,
		usecreateIndexes:true
	})
	const date = new Date().toISOString().split('T')[0];

	const student = conn.model(date,studentSchema)

	const result = await student.find({},{prn:1,_id:0}).sort({prn:1})
	res.send(result)
})

app.get('/getlist',(req,res)=>{
	res.sendFile(path.join(__dirname,'/attendance/responselist.html'))
})

app.get('/getinfo/:db',async(req,res)=>{

	const { db } = req.params
	
	const url = `mongodb+srv://<MongoDB atlas URL>`

	
	var conn = mongoose.createConnection(url,{
		useNewUrlParser:true,
		useUnifiedTopology: true,
		usecreateIndexes:true
	})
	const link = conn.model('links',links);

	const result = await link.find({hash:db})
	res.send(result)
	
})




app.listen(port,()=>{
	console.log(`Connected at port ${port}`)
})