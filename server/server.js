import express from 'express';
import session from 'express-session';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import customerRoutes from './routes/customerRoutes.js';

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: ["https://scaling-system-rwvg9vjrp54f465-5173.app.github.dev"]
}

app.use(cors(corsOptions));

app.use(session({
  secret: "online-banking-secret",
  resave: false,
  saveUninitialized: false
}))

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);

// app.get("/api", (req, res) => {
//   res.json({
    
//   })
// })

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})