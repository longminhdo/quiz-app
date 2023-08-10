if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { TokenExpiredError } = require('jsonwebtoken');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mediaRoute = require('./router/media.router');
const questionRoute = require('./router/question.router');
const departmentRoute = require('./router/department.router');
const authRoute = require('./router/auth.router');
const collectionRoute = require('./router/collection.router');
const quizRoute = require('./router/quiz.router');
const userRoute = require('./router/user.router');
const userQuizRoute = require('./router/userQuiz.router');
const quizAttemptRoute = require('./router/quizAttempt.router');
const analyticsRoute = require('./router/analytics.router');

const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOSTNAME, LISTENING_PORT = 8080 } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const url = process.env.APP_ENV === 'prod'
  ? `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/quiz-app?retryWrites=true&w=majority`
  : `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}/quiz-app?retryWrites=true&w=majority`;

mongoose
  .connect(url, options)
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// NOTE: the order of these router is mater!
app.use('/collections/:collectionId/questions', questionRoute);
app.use('/media', mediaRoute);
app.use('/auth', authRoute);
app.use('/department', departmentRoute);
app.use('/collections', collectionRoute);
app.use('/quizzes', quizRoute);
app.use('/users', userRoute);
app.use('/userQuizzes', userQuizRoute);
app.use('/quizAttempts', quizAttemptRoute);
app.use('/analytics', analyticsRoute);

// Handle error
// should has 4 params so express can identify this as error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  let statusCode = err?.statusCode || 500;
  let message = err?.message || 'Oops,something went wrong';
  if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'token expired';
  }
  res.status(statusCode).json({
    success: false,
    data: message,
  });
});

/**
 * const CronJob = require('cron').CronJob;
 * const deleteImages = require('./helper/schedule-clear-cloud');
 * // Remove unused images on cloud at 11:59 PM every day.
 * const job = new CronJob('59 23 * * * *', deleteImages, null, true, 0);
 */

app.listen(LISTENING_PORT, () => {
  console.log('Serving on port', LISTENING_PORT);
});
