const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Rohit@2004",
    database: "signup"
});

db.connect((err) => {
    if (err) {
        console.error("Error in connecting database ", err);
    }
    console.log("Database Connected");
});

app.get('/users', (req, res) => {
    const sql = "SELECT id,name,email FROM login";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.send(result);
    });
});

app.get('/users/read/:id', (req, res) => {
    const sql = "SELECT  id,name,email,password FROM login WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.send(result);
    });
});

app.post('/users/data', (req, res) => {
    db.query('SELECT MAX(ID) AS max_serial FROM login', (err, result) => {
        if (err) {
            console.error('Error fetching maximum serial number: ', err);
            return res.status(500).send('Internal Server Error');
        }
        const newSerial = result[0].max_serial + 1;
        const sql = "INSERT INTO login (id, name, email, password, cpassword) VALUES (?, ?, ?, ?, ?)";
        const values = [newSerial, req.body.name, req.body.email, req.body.password, req.body.cpassword];
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            console.log(result);
            res.status(200).json(values);
        });
    });
});

app.put("/users/update/:id", (req, res) => {
    const sql = "UPDATE login SET name=?, email=?, password=? WHERE id=?";
    const id = req.params.id;
    const { name, email, password } = req.body;
    const values = [name, email, password, id];
    db.query(sql, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Server error");
        }
        console.log(results);
        res.status(200).json(results);
    });
});

app.delete("/users/delete/:id", (req, res) => {
    const sql = "DELETE FROM login WHERE id=?";
    const id = req.params.id;
    db.query(sql, id, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Server error");
        }
        console.log(result);
        res.status(200).json("Successfully deleted");
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Your app is running on port ${port}`));
