/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Alect Prasad Student ID: aprasad20 Date: 6/14/2024
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
const collegeData = require('./modules/collegeData');
const path = require('path');

// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get("/about", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get("/htmlDemo", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

app.get("/students", (req, res) => {
    if (req.query && req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
        .then((students) => {
            res.status(200).json(students);
        })
        .catch((err) => {
            res.status(200).json({message:"no results"});
        })
    }
    else {
        collegeData.getAllStudents()
        .then((students) => {
            res.status(200).json(students);
        })
        .catch((err) => {
            res.status(200).json({message:"no results"});
        })
    }
});

app.get("/students/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
    .then((tas) => {
        res.status(200).json(tas);
    })
    .catch((err) => {
        res.status(200).json({message:"no results"});
    })
});

app.get("/tas", (req, res) => {
    collegeData.getTAs()
    .then((tas) => {
        res.status(200).json(tas);
    })
    .catch((err) => {
        res.status(200).json({message:"no results"});
    })
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
    .then((courses) => {
        res.status(200).json(courses);
    })
    .catch((err) => {
        res.status(200).json({message:"no results"});
    })
});

app.all('*',(req, res) => {
    res.status(404).json({message:"Page Not Found"});
});
// setup http server to listen on HTTP_PORT
collegeData.initialize()
.then (() => {
    app.listen(HTTP_PORT, ()=>{console.log("server listening on port: " + HTTP_PORT)});
}).catch((err) => {
    console.log("Failed to fetch data from disk")
})

