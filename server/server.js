import express from 'express';
import session from 'express-session';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import customerRoutes from './routes/customerRoutes.js';

const app = express();
const PORT = 8080;

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true
}

app.use(cors(corsOptions));

app.use(session({
  secret: "online-banking-secret",
  resave: false,
  saveUninitialized: false
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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