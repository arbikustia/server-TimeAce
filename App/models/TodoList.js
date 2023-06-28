const mongoose = require("mongoose");

const todoListSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
  userId: {
    type: String,
  },
  bgColor : {
    type: String,
    required : true
  },
  createdAt : {
    type : String,
    required : true
  }
});


const TodoList = mongoose.model("TodoList", todoListSchema);

module.exports = TodoList;
