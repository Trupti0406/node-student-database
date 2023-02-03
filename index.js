const express = require("express");
const storage = require("node-persist");
const app = express();
app.use(express.json());

const init = async () => {
  await storage.init({ dir: "./students" });
};

init();

// Creating a post request that accepts student details
app.post("/student", async (req, res) => {
  const student = {
    id: req.body.id,
    name: req.body.name,
    gpa: req.body.gpa,
  };

  const allStudents = (await storage.getItem("students")) || [];
  allStudents.push(student);

  await storage.setItem("students", allStudents);
  res.status(200).json({ success: true });
});

// Sending HTML back with GET request (All Students)
app.get("/allStudents", async (req, res) => {
  const allStudents = (await storage.getItem("students")) || [];
  let htmlCode = "<h1>All Students Data!</h1>";
  allStudents.forEach((student) => {
    htmlCode += `
    <div>
        <h3> Student id: ${student.id} </h3>
        <h3> Student Name: ${student.name} </h3>
        <h3> Student GPA: ${student.gpa} </h3>
    </div> <hr>
    `;
  });
  res.send(htmlCode);
});

// GET request for retrieving data of a particular student using ID
app.get("/student/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const allStudents = await storage.getItem("students");
  const student = allStudents.filter((student) => id === student.id);
  //   console.log(student);

  let htmlCode = `<h1>The ID belongs to:</h1>`;
  student.forEach((targetIdStudent) => {
    htmlCode += `<div>
        <h3> Student id: ${targetIdStudent.id} </h3>
        <h3> Student Name: ${targetIdStudent.name} </h3>
        <h3> Student GPA: ${targetIdStudent.gpa} </h3>
    </div> <hr> `;
  });
  res.send(htmlCode);
});

// GET request for retrieving data of a student with maximun GPA
app.get("/topper", async (req, res) => {
  const allStudents = await storage.getItem("students");
  const gpaArray = allStudents.map((a) => a.gpa); //Storing all GPAs in seperate array
  let highest = Math.max(...gpaArray);
  console.log("Highets GPA is: " + highest);

  const topper = allStudents.filter((student) => {
    if (student.gpa === highest) {
      return student;
    }
  });

  let htmlCode = `<h1> Topper student is: </h1>`;
  topper.forEach((topperStudent) => {
    htmlCode += `
        <div>
        <h3> Student id: ${topperStudent.id} </h3>
        <h3> Student Name: ${topperStudent.name} </h3>
        <h3> Student GPA: ${topperStudent.gpa} </h3>
    </div> <hr>
        `;
  });

  res.send(htmlCode);
});

app.listen(5000, () => {
  console.log("Sever started running on port 5000");
});
