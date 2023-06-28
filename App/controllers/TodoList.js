const TodoList = require("../models/TodoList");
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

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Perhatikan penambahan 1 karena bulan dimulai dari 0
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

// create data
exports.createTodo = async (req, res) => {
  const { title, text, label, bgColor } = req.body;
  const token = extractToken(req.headers);

  try {
    if (token) {
      const timestamp = Date.now(); // Contoh timestamp, Anda dapat menggunakan timestamp yang sesuai dengan data Anda
      const createdAt = formatDate(timestamp);
      const decodedToken = jwt.decode(token);
      const userId = decodedToken._id;
      const data = new TodoList({
        title,
        text,
        label,
        userId,
        bgColor,
        createdAt,
      });
      await data.save();

      res.status(201).json({ message: createdAt });
    } else {
      res.status(401).json({ message: "Invalid Token" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// get data by userid
exports.getData = async (req, res) => {
  const token = extractToken(req.headers);

  try {
    if (token) {
      const decodedToken = jwt.decode(token);
      const userId = decodedToken._id;
      const data = await TodoList.find({ userId: userId });

      if (!data) {
        res.status(404).json({ message: "Data not found" });
      }

      res.json(data);
    } else {
      res.status(401).json({ message: "Invalid Token" });
    }
  } catch (err) {
    res.satatus(500).json({ message: "Internal server error" });
  }
};

// delete data
exports.deleteData = async (req, res) => {
  const { id } = req.params;
  const token = extractToken(req.headers);
  try {
    if (token) {
      const data = await TodoList.findByIdAndDelete(id);
      if (!data) {
        res.status(404).json({ message: "Data not found" });
      }
      res.json({ message: "Success delete data" });
    } else {
      res.status(401).json({ message: "Invalid Token" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// detail tood

exports.detailTodo = async (req, res) => {
  const { id } = req.params;
  const token = extractToken(req.headers);
  try {
    if (token) {
      const data = await TodoList.findById(id);

      if (!data) {
        res.status(404).json({ message: "Data not found" });
      }

      res.json(data);
    } else {
      res.status(401).json({ message: "invalid Token" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
