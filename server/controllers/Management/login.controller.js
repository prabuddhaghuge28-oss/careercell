const User = require("../../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Use projection to only fetch needed fields (much faster, especially with large documents)
    const user = await User.findOne({ email }).select('email password role _id');
    if (!user)
      return res.status(400).json({ msg: "User Doesn't Exist!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch || user.role !== "management_admin")
      return res.status(400).json({ msg: 'Credentials Not Matched!' });

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Use findOneAndUpdate instead of save() - only updates token field, much faster
    await User.findOneAndUpdate(
      { _id: user._id },
      { token: token },
      { new: true }
    );
    
    return res.json({ token });
  } catch (error) {
    console.log("management.login.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

module.exports = Login;