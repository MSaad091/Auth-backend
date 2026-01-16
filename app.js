// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import UserRouter from './routes/route.js';
// import serverless from 'serverless-http';

// const app = express();

// // Frontend URL for CORS
// app.use(cors({
//     origin: "https://auth-app-ten-bay.vercel.app",
//     credentials: true
// }));


// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(express.static("public"));
// app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.send("Backend is live on Vercel!");
// });

// // Routes
// app.use('/user', UserRouter);

// // ✅ Serverless export for Vercel
// export default serverless(app);

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import UserRouter from './routes/route.js';
import serverless from 'serverless-http';

const app = express();

// CORS
app.use(cors({
  origin: "https://auth-app-ten-bay.vercel.app",
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

// Handle preflight requests
app.options("*", cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is live on Vercel!");
});

app.use('/user', UserRouter);

export default serverless(app);
