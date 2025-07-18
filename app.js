const express = require('express')
const app = express()
const mysql = require('mysql2')

require('dotenv').config()

//port
const port = process.env.PORT || 3000

//mysql
const con = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME

})

//check connection
con.getConnection((error,connection) => {
    if(error) throw error
    console.log("Connection Success")
})

app.use(express.json())
app.use(express.static("public"))

//routes

//get method

app.get('/api/employee', (req,res) => {
    const query = "select * from employee"
    con.query(query, (err, result) => {
        if(err){
            console.log("Error while listing data "+err)
            res.status(500).send('Error fetching data')
            return;
        }
        res.json(result)
    })
})

//post method

app.post('/api/newEmployee',(req, res) => {
    const {id, name, salary, age} = req.body
    console.log(req.body)

    // if(!id || !name || !salary || !age){
    //     return res.status(400).json({message: "Enter all the required field."})
    // }
    const postQuery = "insert into employee (Id, Name, Salary, Age) values (?,?,?,?)"
    
    con.query(postQuery,[id, name, salary, age], (err, result) =>{
        if(err){
        return res.status(500).json({message: "Error while entering data into the database" +err})
    }
    res.status(201).json({message: "Employee added succesfully!"})
    })
    
})

//delete method

app.delete('/api/deleteEmployee/:id', (req,res) => {
    const id = req.params.id
    console.log(req.params.id)

    const deleteQuery = "delete from employee where Id = ?" ;
    con.query(deleteQuery, [id], (err, result) => {
        if(err){
            return res.status(500).json({ message: "Cannot delete employee :"+err})
        }
        if(result.affectedRows === 0){
            return res.status(404).json({ message: "Employee not found"})
        }
        res.status(200).json({ meassage: `Employee with id: ${id} deleted succesfully.`})
    })
})

//put method -update

app.put('/api/updateEmployee/:id', (req, res) => {
    const id = req.params.id
    const { name, salary, age} = req.body
    console.log(req.body)

    const updateQuery = "update employee set Name = ?, Salary = ?, Age = ? where Id = ?"

    con.query(updateQuery, [name, salary, age, id], (err, result) => {
        if(err){
            return res.status(500).json({ message: "Error : Problem in Updating Employee "+err})
        }
        if(result.affectedRows === 0){
            return res.status(404).json({ message: "Employee not found"})
        }
        res.status(200).json({ message: `Employee with id: ${id} updated successfully.`})
    })
})

//listen
app.listen(port, () => {
    console.log("Server is running in "+port)
})