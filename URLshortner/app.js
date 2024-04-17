const express = require("express");
const {connectToMongoDB} = require('./connect');
const cookieParser = require('cookie-parser');
const path = require("path");
const URL = require("./models/url")
const { restrictToLoggedInUserOnly, checkAuth } = require('./middlewares/auth');

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user")

const app = express();
const PORT = 8001;

app.set("view engine", "ejs" );
app.set("views", path.resolve("./views"));

connectToMongoDB('mongodb://0.0.0.0:27017/short-url')
.then(()=> console.log("MongoDB connected"));



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/", checkAuth,staticRoute);



app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory : { 
          timestamp : Date.now(),
        }
      }
    }
  );
  if (!entry) {
    return res.status(404).send('Short URL not found');
  }
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));

