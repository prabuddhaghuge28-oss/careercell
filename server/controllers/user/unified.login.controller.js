const User = require("../../models/user.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ msg: 'Email and password are required!' });

    const normalizedEmail = email.trim().toLowerCase();

    // Find user by normalized email
    const user = await User.findOne({ email: normalizedEmail }).select('email password role _id studentProfile');
    if (!user)
      return res.status(400).json({ msg: "User Doesn't Exist!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: 'Credentials Not Matched!' });

    // Allow students to login even if not yet approved by TPO.
    // Return the approval status so the frontend can inform the student and
    // let TPO accept/reject the student later.
    const isApproved = !!(user.studentProfile && user.studentProfile.isApproved);

    // Include role and approval status in the JWT so client-side checks can read them
    const payload = { userId: user.id, role: user.role, isApproved };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    await User.findOneAndUpdate(
      { _id: user._id },
      { token: token },
      { new: true }
    );

    return res.json({ token, role: user.role, isApproved });
  } catch (error) {
    console.log("unified.login.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

module.exports = Login;
