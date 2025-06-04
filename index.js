const express = require("express");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const User = require("./db/userModel");
//const CommentRouter = require("./routes/CommentRouter");

dbConnect();

app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});


app.post("/admin/login", async (request, response) => {
  const { login_name, password } = request.body;

  try{
    const user = await User.findOne({ login_name, password });
    response.status(200).json(user);
    console.log(user);
  }
  catch(error){
    response.status(500).send({ error: "Error" });
  }
})



app.listen(8081, () => {
  console.log("server listening on port 8081");
});
