import express from 'express';
import dbConnect from './utils/dbConnect.js';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import userRouter from './routes/user.js';

const app = express();
const PORT = process.env.PORT || 8000;



app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());





app.use(express.json());

app.use(cors());


const startServer = () =>  app.listen(PORT, async () => {
  await dbConnect();
  console.log(`Server is running on http://localhost:${PORT}`);
});

startServer();


app.use('/api/v1/users', userRouter);

