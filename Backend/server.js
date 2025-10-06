require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const predictionRoutes = require("./routes/predictionRoutes");
const runModel= require("./mlmodels/model")

// Connect Database
connectDB();

const app = express();

// Security & utility middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "*", // In production, replace "*" with your frontend domain
  credentials: true,
}));
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(compression());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  })
);


const testArray = [
  1.0,  // Degree
  2.0,  // Major
  8.7,  // CGPA
  0.0,  // Employed
  7.0,  // Experience
  1.0,  // Certifications
  1.0,  // Industry Preference
  0.0,  // Accounting
  0.0,  // AutoCAD
  1.0,  // C
  0.0,  // C++
  1.0,  // Circuit Design
  0.0,  // Data Analysis
  0.0,  // Econometrics
  1.0,  // Embedded Systems
  0.0,  // Excel
  0.0,  // Financial Modeling
  0.0,  // Java
  1.0,  // MATLAB
  0.0,  // Machine Learning
  0.0,  // Python
  0.0,  // R
  0.0,  // Risk Analysis
  0.0,  // SQL
  0.0,  // SolidWorks
  0.0,  // Statistics
  0.0,  // Thermodynamics
  0.0   // VHDL
];

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
console.log(runModel(testArray));

// Routes
app.get("/", (req, res) => res.send("Hello Backend 🚀"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes")); // Profile Routes
app.use("/api/predictions",  require("./routes/predictionRoutes"));

// Error handling middlewares (keep after routes)
app.use(notFound);
app.use(errorHandler);

app.post("/api/predict", (req, res) => {
  const { degree, major, cgpa, experience, skills, certifications } = req.body;

  // TODO: Pass these values into your trained model
  // For now, just return a fake prediction:
  let prediction = "Software Engineer";
  if (major.toLowerCase().includes("data")) prediction = "Data Scientist";
  if (major.toLowerCase().includes("business")) prediction = "Business Analyst";

  res.json({ prediction });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);


 