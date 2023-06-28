const Activity = require("../models/Activity");
const jwt = require("jsonwebtoken");

// get token
const extractToken = (headers) => {
  const getToken = headers.authorization;
  if (getToken && getToken.startsWith("Bearer ")) {
    return getToken.substring(7);
  } else {
    return getToken;
  }
};

// post new room
exports.createRoomActivity = async (req, res) => {
  const { roomName } = req.body ;
  const token = extractToken(req.headers);

  try {
    if (token) {
      const decodedToken = jwt.decode(token);
      const userId = decodedToken._id;
      const newRoomActivity = new Activity({
        userId,
        roomName,
        activity: [],
      });
      const savedRoomActivity = await newRoomActivity.save();

      res.status(201).json(savedRoomActivity);
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// post mew activity
exports.addActivity = async (req, res) => {
  const { id } = req.params;
  const { nameActivity, condition1, condition2, act } = req.body;
  const token = extractToken(req.headers);

  try {
    if (token) {
      const data = await Activity.findById(id);
      if (!data) {
        return res.status(404).json({ message: "Data not found" });
      }

      const newData = { nameActivity, condition1, condition2, act };
      data.activity.push(newData);
      await data.save();

      res.json(data);
    } else {
      res.status(401).json({ message: "Token not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

// get all room by userId
exports.getAllRoom = async (req, res) => {
  const token = extractToken(req.headers);
  try {
    if (token) {
      const decodedToken = jwt.decode(token);
      const userId = decodedToken._id;

      const data = await Activity.find({ userId: userId });
      if (!data) {
        return res.status(404).json({ message: "Data not found" });
      }
      res.json(data);
    } else {
      res.status(401).json({ message: "Token not found" });
    }
  } catch (err) {
    res.status(500).json({ message: token });
  }
};

// get activity by id
exports.getActivity = async (req, res) => {
  const { id } = req.params;
  const token = extractToken(req.headers);
  try {
    if (token) {
      const data = await Activity.findById(id);
      const dataActivity = data.activity;
      if (!dataActivity) {
        return res.status(404).json({ message: "Data not found" });
      }

      res.json(dataActivity);
    } else {
      res.status(401).json({ message: "Token not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete room
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  const token = extractToken(req.headers);
  try {
    if (token) {
      const data = await Activity.findByIdAndDelete(id);
      if (!data) {
        res.status(404).json({ message: "Data not found" });
      }
      res.json({ message: "Success delete data" });
    } else {
      res.status(401).json({ message: "Token not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete data activity
exports.deleteActivity = async (req, res) => {
  const { id, index } = req.params;
  const token = extractToken(req.headers);

  try {
    if (token) {
      const data = await Activity.findById(id);
      if (!data) {
        res.status(404).json({ message: "Data not found" });
      }
      if (!data.activity) {
        return res.status(404).json({ message: "Array not found" });
      }
      data.activity.splice(index, 1);
      const updatedData = await data.save();
      res.json(updatedData);
    } else {
      res.status(401).json({ message: "Token not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" + index });
  }
};
