import express from 'express';
import cors from 'cors';
import passport from 'passport';
import router from './routes/app';

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// Body parser configuration

app.use(express.json({ extended: false }));

// Initialize passport, google && facebook
app.use(passport.initialize());

// Router configuration
app.use(router);

// render engine
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use((req, res) => {
  res.status(404).send({
    status: 404,
    error: 'resource not found'
  });
});
app.listen(port, () => {
  console.log(`server started successfully on the port: ${port}`);
});

export default app;