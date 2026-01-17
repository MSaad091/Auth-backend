// // import express from "express";
// // import cors from "cors";
// // import cookieParser from "cookie-parser";
// // import UserRouter from "./routes/route.js";

// // const app = express();

// // const allowedOrigins = [
// //   "http://localhost:5173",
// //   "https://YOUR-FRONTEND.vercel.app"
// // ];

// // app.use(cors({
// //   origin: function(origin, callback) {
// //     if (!origin || allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   credentials: true,
// //   methods: ["GET","POST","PUT","DELETE","OPTIONS"]
// // }));

// // // JSON + URL encoded
// // app.use(express.json({ limit: "16kb" }));
// // app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// // app.use(cookieParser());

// // // Routes
// // app.use("/user", UserRouter);

// // app.get("/", (req, res) => res.send("Backend live!"));

// // // ✅ Remove this line:
// // // app.options("/*", cors());  <-- Remove, crash fix

// // export default app;
// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import UserRouter from "./routes/route.js";

// const app = express();

// app.use(cors({
//   origin: ["http://localhost:5173", "https://YOUR-FRONTEND.vercel.app"],
//   credentials: true,
// }));

// app.use(express.json());
// app.use(cookieParser());

// app.use("/user", UserRouter);

// export default app;
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/route.js";

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",                   // Local dev
  "https://auth-app-ten-bay.vercel.app"     // Your deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like Postman) or from allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // ✅ Needed for cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Parse cookies
app.use(cookieParser());

// Routes
app.use("/user", UserRouter);

// Test route
app.get("/", (req, res) => res.send("🚀 Backend Live!"));

export default app;
