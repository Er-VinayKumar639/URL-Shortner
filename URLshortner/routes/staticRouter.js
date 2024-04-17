const express = require("express");
const URL = require("../models/url");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if(!req.user) return res.redirect('/login')
    const urls = await URL.find({createdBy: req.user._id});
    res.render("home", { urls });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving URLs");
  }
});

router.get("/signup" , (req, res) =>{
  return res.render("signup");
})
router.get("/login" , (req, res) =>{
  return res.render("login");
})

module.exports = router;
