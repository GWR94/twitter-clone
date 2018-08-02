const mongoose = require("mongoose");
const User = mongoose.model("users");
const bcyrpt = require("bcrypt");

/*
    
*/

module.exports = app => {
    app.post("/api/signup", async (req, res) => {
        try {
            const {handle, email, password } = req.body;
            const existingUser = await User.findOne({handle});
            if (existingUser) {
                console.log('Username already taken');
                return res
                    .status(409)
                    .send("Email already taken");
            }
            const hash = bcyrpt.hashSync(password, 10);
            const user = await new User({handle, email, password: hash}).save(); //saving hashed password
            return res.send({user});
        } catch (e) {
            console.log(e);
            res.send(e);
        }
    });
};
