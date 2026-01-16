// import connectDB from "./db/index.js";
// import { app } from "./app.js";
// import dotenv from "dotenv";

// const PORT = 8000; // Directly define port

// dotenv.config({
//   path:'./env'
// })
// connectDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("❌ Mongo DB Connection failed:", err);
//   });

// Load .env first

import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Mongo DB Connection failed:", err);
  });
