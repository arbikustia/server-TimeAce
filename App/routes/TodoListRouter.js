const express = require("express");
const TodoList = require("../controllers/TodoList");
const router = express.Router();

router.post("/", TodoList.createTodo);
router.get("/", TodoList.getData);
router.delete("/:id", TodoList.deleteData);
router.get("/:id", TodoList.detailTodo);

module.exports = router;
