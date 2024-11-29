const express = require("express");
const router = express.Router();

//Index -User Router
router.get("/", (req, res) => {
  res.send("All Users");
});
//Show -User Router
router.get("/:id", (req, res) => {
  res.send("Show User");
});
//New -User Router
router.get("/new", (req, res) => {
  res.send("New User");
});
router.delete("/:id", (req, res) => {
  res.send("Delete User");
});

module.exports = router;