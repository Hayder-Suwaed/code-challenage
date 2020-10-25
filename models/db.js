const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/CrudDB",
  { useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.");
    } else {
      console.log("MongoDB Connection : " + err);
    }
  }
);


require('./appointment.model');