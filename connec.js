const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL)
    .then((data) => console.log(`Connected to ${data.connection.host}`))
    .catch((err) => console.log(err));
