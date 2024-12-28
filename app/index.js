const express = require('express') , http = require('http');
const cors = require('cors')
const app = express()

const connection = require('./connection.js');

const port = 3000
app.use(cors());
app.use(express.json());

/* GET home page. */
app.get('/', (req, res) => {

    connection.query('SELECT * FROM `task`', function (error, results, fields) {
        console.log(results);
        res.json(results);
    });
})

app.post('/addTask', (req, res) =>{
    let sql = 'INSERT INTO `task` SET ?';
    console.log(req.body);
    let post = {
        taskName : req.body.taskName,
        priority: req.body.priority,
        status: req.body.status
    }
    connection.query(sql, post, (error, results) => {
        if(error) throw error;
        res.status(200).json({message: "Task added successfully", tid: results.insertId, status: 200});
    });
})

app.post('/editTask', (req, res) =>{
    const tid = req.query.id;
    let allowedColumns = ['taskName', 'priority', 'status'],
        stmts = [], values = [];

    console.log('param=' + tid);
    // console.log('param=' + req.json(req));
    for (let c of allowedColumns){
        if(c in req.body){
            stmts.push(`${c} = ?`),
            values.push(req.body[c]);
            console.log('body=' + req.body[c]);
        }
    }
    if (stmts.length == 0) {
        return res.sendStatus(204); //nothing to do
    }

    values.push(tid);
    connection.query(`UPDATE task SET ${stmts.join(", ")} WHERE id = ?`, values, (error, result) => {
        if (error) {
            res.status(400).json({ error: "Database error", details: error });
        } else {
            res.status(200).json({message: "Task updated successfully", updatedFields: req.body, status: 200});
        }
    });
})

app.post('/deleteTask', (req, res) =>{
    const tid = req.query.id;

    connection.query(`DELETE FROM task WHERE id = ?`, tid, (error, result) => {
        if (error) {
            res.status(400).json({ error: "Database error", details: error });
        } else {
            res.status(200).json({message: "Task deleted successfully",status: 200});
        }
    });
})

app.post('/editTaskStatus', (req, res) =>{
    const tid = req.query.id;

    connection.query(`UPDATE task SET status = Case When status='Pending' Then 'Done' When status='Done' Then 'Pending' End  WHERE id = ?`, tid, (error, result) => {
        if (error) {
            res.status(400).json({ error: "Database error", details: error });
        } else {
            res.status(200).json({message: "Task deleted successfully",status: 200});
        }
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

