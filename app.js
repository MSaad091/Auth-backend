import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import UserRouter from './routes/route.js'

const app = express();

// app.use(cors({
//   origin: "http://localhost:5173", // frontend ka exact URL
//   credentials: true
// }));


app.use(cors({
  origin: "https://auth-app-ten-bay.vercel.app", // frontend Vercel URL
  credentials: true
}));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Backend is live on Vercel!");
});

app.use('/user', UserRouter)

export { app };
