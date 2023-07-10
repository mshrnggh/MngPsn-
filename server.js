const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const foodRoutes = require("./routes/foodRoutes.js");
//app.use(foodRoutes);

//DB connection
mongoose
  .connect(
    "mongodb+srv://mshrngch:1mol0623MNG@clustermn.jyrlvq2.mongodb.net/foofdb_postman_test?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log(err));

app.listen(3000, () => console.log("Server started at Port 3000"));
