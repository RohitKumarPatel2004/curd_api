const express=require('express')
const mysql=require('mysql')
const cors = require("cors");

const app=express()
app.use(cors());

app.use(express.json())

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Rohit@2004",
    database:"signup"
})

db.connect((err)=>{
    if(err){
        console.error("error in connecting database ", err)
    }
    console.log("Database Connected")
})


app.get('/users',(req,res)=>{
    const sql="SELECT name,email FROM login ";
    db.query(sql,(err,result)=>{
        if(err){
            res.status(500)
        }
        res.send(result);
    })
})

app.post('/users/data',(req,res)=>{
    const sql="INSERT INTO login (name,email,password,cpassword) VALUES (?,?,?,?)";
    const value=[
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.cpassword
    ]

    db.query(sql,value,(err,result)=>{
        if(err){
            res.status(500).send("error in server");
        }
        res.json(value)
    })
})


app.put("/users/:id",(req,res)=>{
    const sql="UPDATE login SET name=? ,email=? where name=?"
    const Uid=req.params.id;
    const {name,email}=req.body;
    const value=[name,email,Uid]
   db.query(sql,value,((err,results)=>{
        if(err){
            res.status(500).send("server error");
        }
        res.json(results)
    }))
})

app.delete("/users/:id",(req,res)=>{
    const sql="DELETE FROM login WHERE name=?";
    const Uid=req.params.id;

    db.query(sql,Uid ,(err,result)=>{
        if(err){
            res.status(500).send("server error")
        }
        res.json("successfully delete ")
    })
})


const port=process.env.PORT||3000
app.listen(port,(()=>console.log(`your are running on ${port}`)))