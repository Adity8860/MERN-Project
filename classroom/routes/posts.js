const express = require('express');
const router = express.Router();

router.get("/", (req, res)=>{
    res.send("Get for posts")
})
//Show
router.get("/:id", (req, res)=>{
    res.send("Get for posts id")
})

//POST -User Router
router.post('/', (req, res) => {
    res.send("post for users")
})
//delete -User Router
router.delete('/:id', (req, res) => {
    res.send("Delete User")
})

module.exports = router