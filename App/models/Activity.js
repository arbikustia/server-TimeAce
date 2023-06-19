const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  id : {
    type : String,
  },
  roomName: {
    type: String,
    required: true,
  },
  activity: [
    {
      nameActivity: String,
      condition1: String,
      condition2: String,
      act: String,
    },
  ],
});

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
