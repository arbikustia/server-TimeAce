const express = require("express")
const roomActivity = require("../controllers/Activity")

const router = express.Router();

router.post("/", roomActivity.createRoomActivity)
router.post("/addactivity/:id", roomActivity.addActivity)
router.get("/", roomActivity.getAllRoom)
router.get("/getactivity/:id", roomActivity.getActivity)
router.delete("/:id", roomActivity.deleteRoom)
router.delete("/deleteactivity/:id/:index", roomActivity.deleteActivity)

module.exports = router;