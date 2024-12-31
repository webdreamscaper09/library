const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // Prevents client-side JS from accessing cookies
    secure: false,   // Set to true if you're using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day (in milliseconds)
  }
}));

app.use(flash());

// Make flash messages available
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Make 'user' and 'role' available in all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.session.userId || null; 
  res.locals.role = req.session.role || null;
  next();
});


// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Import routes
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// Home page
app.get("/", (req, res) => {
  res.render("index", { title: "Welcome to Book Library" });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
