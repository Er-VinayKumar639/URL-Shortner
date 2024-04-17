const shortid = require("shortid");
const URL = require('../models/url');

async function handleGenerateNewShortURL(req, res){
  const body = req.body;
  if (!body.url) return res.status(400).json({ error :'URL is required'});
  const shortID= shortid();

  await URL.create({
    shortId : shortID,
    redirectURL : body.url,
    visitHistory : [],
    createdBy: req.user._id,
  });
  const urls = await URL.find({});
  return res.render("home", {id : shortID, urls})
}

async function handleGetAnalytics(req, res){
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totleClicks : result.visitHistory.length,
    analytics : result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL, handleGetAnalytics,
};

