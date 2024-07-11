const fs = require("fs");
const path = require('path');

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile(path.join(__dirname, 'data', 'courses.json'),'utf8', (err, courseData) => {
            if (err) {
                reject(err); return;
            }

            fs.readFile(path.join(__dirname, 'data', 'students.json'),'utf8', (err, studentData) => {
                if (err) {
                    reject(err); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve(dataCollection.students.length);
            });
        });
    });
}

module.exports.getAllStudents = function(){
    return new Promise((resolve,reject)=>{
        if (dataCollection.students.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(dataCollection.students);
    })
}

module.exports.getTAs = function () {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.getCourses = function(){
   return new Promise((resolve,reject)=>{
    this.initialize()
    .then((data) => {
        if (dataCollection.courses.length == 0) {
            reject("query returned 0 results"); return;
        }
        resolve(dataCollection.courses);
       });
    })
    .catch(err => {
        console.log(err)
    })
    
};

module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    });
};

module.exports.getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    });
};

module.exports.addStudent = function (requestBody) {
    return new Promise(function (resolve, reject) {
        try {
            requestBody.studentNum = dataCollection.students.length + 1;
            if(requestBody.TA === undefined)
                requestBody.TA = false;
            else
                requestBody.TA = true;
                dataCollection.students.push(requestBody);
            resolve("Student Added");
        } catch (err) {
            console.log(err)
            reject(err);
        }
    });
};


