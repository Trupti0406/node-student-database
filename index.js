const express = require("express");
const storage = require("node-persist");
const app = express();
// const jsonParser = require("body-parser");
app.use(express.json());

const init = async () => {
  await storage.init({ dir: "./students" });
};

init();

app.post("/student", async (req, res) => {
  const student = {
    id: req.body.id,
    name: req.body.name,
    gpa: req.body.gpa,
  };

  const allStudents = (await storage.getItem("students")) || [];
  allStudents.push(student);
  //   console.log(student);

  await storage.setItem("students", allStudents);

  res.status(200).json({ success: true });
});

// Sending HTML back with GET request
app.get("/allStudents", async (req, res) => {
  const allStudents = (await storage.getItem("students")) || [];

  let htmlCode = "<h1>All Students Data!</h1><br>";

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

app.listen(5000, () => {
  console.log("Sever started running on port 5000");
});
