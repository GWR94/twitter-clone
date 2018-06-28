const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const multer = require('multer');
const User = mongoose.model('users');

module.exports = app => {
    // app.use(multer({
    //     dest: './uploads/',
    //     rename: function (fieldname, filename) {
    //         return filename;
    //     }
    // }));

    app.post('/api/photo', function (req, res) {
        const {username, fileType} = req.body;
        const user = User.findOne({username});
        if (!user) 
            return res.status(404).send('Not a valid user');
        user.img.data = fs.readFileSync(req.files.userPhoto.path);
        user.img.contentType = 'image/png',
        user.save();
    })
}