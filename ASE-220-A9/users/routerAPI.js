const express = require('express');
const router = express.Router();
const fs = require('fs');

const {MongoClient} = require('mongodb');
var ObjectId = require('mongodb').ObjectId; 
const port = process.env.PORT || 8080;

/* Connect to MongoDB */
const uri = "mongodb+srv://Hunter:<password>@nku.zhise.mongodb.net/db?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const DB = client.db('db');

/* API routes */
router.get('/',(req, res)=>
{
	client.connect(function(err, data)
	{
		if(err) 
			return console.log(err);
		
		DB.collection('users').find({}).toArray(function(err, ress)
		{
			if(err) 
				return console.log(err);
			
			res.status(200).json(ress);
			data.close();
		});
	});	
});

router.post('/',(req, res)=>
{
	client.connect(function(err, data)
	{
		if(err) 
			return console.log(err);
	
		DB.collection('users').insertOne((req.body),function(err, result)
		{		
			if(err) 
				return console.log(err);
			
		})
		DB.collection('users').find({}).toArray(function(err, result)
		{
			if(err) 
				return console.log(err);
			
			data.close();
		})
	})
	res.status(200).json(req.body);
})

router.get('/:id', (req, res) => 
{
	var id = req.params.id;
	var count = 0;
	client.connect(function(err, data)
	{
		DB.collection('users').find({}).toArray(function(err, arr)
		{
			res.status(200).json(arr[id]);
		});
	});
	
})		

router.patch('/:id',(req, res)=>
{
	client.connect(function(err, data)
	{
		if (err)
			return console.log(err);
		
		var id = req.params.id;
		const email = req.body.email;
		const password = req.body.password;
		
		var newid;
		DB.collection('users').find({}).toArray(function(err, arr)
		{
			let n = JSON.stringify(arr[id]);
			newid = arr[id]["_id"].toString();
			
			DB.collection('users').updateOne({_id: new ObjectId(newid)},{$set:{"email":`${email}`,"password": `${password}`}},function(err, result)
			{		
				if (err)
					return console.log(err);
				res.status(200).json({"Message" : "Patched"});
			})
			
		})
	})
})

router.delete('/:id',(req, res)=>
{
	client.connect(function(err, data)
	{
		if (err)
			return console.log(err);
			
		var id = req.params.id;
		var newid;
		DB.collection('users').find({}).toArray(function(err, arr)
		{
			let n = JSON.stringify(arr[id]);
			newid = arr[id]["_id"].toString();
			
			DB.collection('users').deleteOne({_id: new ObjectId(newid)},function(err, result)
			{		
				if (err)
					return console.log(err);
				
				res.status(200).json({"Message" : "Deleted"});
			})
			
		})
	})
})

module.exports = router;