const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes/verifyRoutes')(app);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is up at port ${port}`);
})
