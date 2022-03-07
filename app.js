require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// package moves image from local to server
const fileUpload = require('express-fileupload')

// bring in Cloudinary package, must use v2 or this will not work
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
});
// database
const connectDB = require('./db/connect');

// product router
const productRouter = require('./routes/productRoutes')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// allows to retrieve req.body as json response
app.use(express.json())
app.use(express.static('./public'))
// invoke file upload
app.use(fileUpload({ useTempFiles:true }))

app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>');
});

app.use('/api/v1/products', productRouter);

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
