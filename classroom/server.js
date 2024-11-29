const express = require("express");
const app = express();
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");



const sessionOptions = {
  secret: "secretcode",
  resave: false,
  saveUninitialized: true,
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));




app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.successMsg = req.flash("success");
  res.locals.failedMsg = req.flash("failed");
  
  next();
})

app.get("/register", (req, res)=>{
  let {name="Anonymous"} = req.query
    req.session.name = name;
if(name==="Anonymous"){
      req.flash("failed", "User not registered");

}else{
      req.flash("success", "You have registered successfully");

}

    res.redirect("/hello")
})

app.get("/hello", (req, res)=>{
 
 res.render("page.ejs", { name: req.session.name });
})



 
// app.get("/requestcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`You have made ${req.session.count} time requests`);
// });

// app.get("/test", (req, res)=>{
//     res.send("Test Route")
// })

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
