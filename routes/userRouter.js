const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Profile = require("../models/Profile");
const nodemailer = require("nodemailer");
const authenticate = require("../middlewares/auth");
const randomstring = require("randomstring");

const sendVerifyMail = async (name, email, userId) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: email,
      subject: "For Verification of Email",
      html:
        "<p>Hi," +
        name +
        ' please click here to <a href="http://localhost:5000/api/users/verify-register?id=' +
        userId +
        '"> Verify </a> your email</p>',
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:-", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const sendResetMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: email,
      subject: "Reset password",
      html:
        "<p>Hi," +
        name +
        ' please click here to <a href="http://localhost:5000/api/users/forget-password?token=' +
        token +
        '"> Reset </a> your password</p>',
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent:-", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

/*
    @usage : to Register a User
    @url : /api/users/register
    @fields : name , email , password
    @method : POST
    @access : PUBLIC
 */

router.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(201).json({ msg: "User already exists" });
    } else {
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      let avatar =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOkHm3_mPQ5PPRvGtU6Si7FJg8DVDtZ47rw&usqp=CAU";

      user = new User({ name, email, password, avatar });
      let userData = await user.save();

      let userProfile = new Profile({
        user: userData._id,
        name,
        email,
        avatar,
      });
      await userProfile.save();
      sendVerifyMail(name, email, userData._id);

      res.status(200).json({
        msg: "Registration is successful. Please check your email to verify.",
      });
    }
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

/*
    @usage : to verify registration of a User
    @url : /api/users/verify-register
    @fields : null
    @method : GET
    @access : PUBLIC
 */
router.get("/verify-register", async (req, res) => {
  try {
    const UpdatedData = await User.updateOne(
      { _id: req.query.id },
      { $set: { isVerified: true } }
    );
    console.log(UpdatedData);
    // return res.status(200).json({ msg: "Your Email is Verified" });
    return res.render("verify-email", {
      msg: "Your email is verified Successfully, Go to login",
    });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
});

/*
    @usage : to Register An Admin
    @url : /api/users/admin-register
    @fields : name,email,password,secretkey
    @method : GET
    @access : PUBLIC
 */
router.post("/admin-register", async (req, res) => {
  try {
    let { name, email, password, secretKey } = req.body;
    if (process.env.ADMIN_SECRET_KEY !== secretKey) {
      return res.status(202).json({ msg: "Invalid credentials" });
    } else {
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(201).json({ msg: "Admin already exist" });
      } else {
        let salt = await bcrypt.genSalt(10); // salt is actually encrypted password
        password = await bcrypt.hash(password, salt); //password=saltF
        let avatar =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTOkHm3_mPQ5PPRvGtU6Si7FJg8DVDtZ47rw&usqp=CAU";
        user = new User({ name, email, password, avatar, isAdmin: true });
        let userData = await user.save();
        let userProfile = new Profile({
          user: userData._id,
          name,
          email,
          avatar,
          isAdmin:userData.isAdmin,
        });
        await userProfile.save();
        sendVerifyMail(name, email, userData._id);
        res.status(200).json({
          msg: "Registration is Successful, Please Check your email to verify",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: error.message }] });
  }
});

/*
    @usage : to log In a user
    @url : /api/users/login
    @fields : email,password
    @method : GET
    @access : PUBLIC
 */

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let userData = await User.findOne({ email: email });
    //email  exist
    if (userData) {
      let passwordMatch = await bcrypt.compare(password, userData.password);
      console.log(passwordMatch);
      if (passwordMatch) {
        if (userData.isVerified === false) {
          return res.status(203).json({ msg: "Please verify your email" });
        } else if (userData.isAdmin === true) {
          return res
            .status(204)
            .json({
              msg: "You are registered as admin, please login as admin",
            });
        } else {
          let payload = {
            user: {
              id: userData._id,
              name: userData.name,
            },
          };
          jwt.sign(payload, process.env.JWT_SECRET_KEY, (error, token) => {
            if (error) throw error;
            res.status(200).json({
              msg: "Login is Successfull",
              token: token,
            });
          });
        }
      } else {
        return res.status(201).json({ msg: "email or password is incorrect" });
      }
    } else {
      return res.status(201).json({ msg: "email or password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

/*
    @usage : to log In an admin
    @url : /api/users/admin-login
    @fields : email,password
    @method : GET
    @access : PUBLIC
 */

router.post("/admin-login", async (req, res) => {
  try {
    let { email, password, secretKey } = req.body;
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(202).json({ msg: "User Unauthorized" });
    }
    let userData = await User.findOne({ email: email });
    //email doesnot exist
    if (userData) {
      let passwordMatch = await bcrypt.compare(password, userData.password);
      console.log(passwordMatch);
      if (passwordMatch) {
        if (userData.isVerified === false) {
          return res.status(203).json({ msg: "Please verify your email" });
        } else if (userData.isAdmin === false) {
          return res
            .status(205)
            .json({ msg: "You are not registered as admin" });
        } else {
          let payload = {
            user: {
              id: userData._id,
              name: userData.name,
            },
          };
          jwt.sign(payload, process.env.JWT_SECRET_KEY, (error, token) => {
            if (error) throw error;
            res.status(200).json({
              msg: "Login is Successfull",
              token: token,
            });
          });
        }
      } else {
        return res.status(201).json({ msg: "email or password is incorrect" });
      }
    } else {
      return res.status(201).json({ msg: "email or password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

/*
    @usage :  to reset password using forget password
    @url : /api/users/forget-password
    @fields : email
    @method : POST
    @access : PUBLIC
 */

router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (userData) {
      if (userData.isVerified == false) {
        return res.status(201).json({ msg: "Please Verify your email first" });
      } else {
        const randString = randomstring.generate();
        let updatedData = await User.updateOne(
          { email: userData.email },
          { $set: { token: randString } }
        );
        sendResetMail(userData.name, email, randString);
        return res
          .status(200)
          .json({ msg: "Please check your email for reset link" });
      }
    } else {
      return res.status(202).json({ msg: "User email is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//admin forget password
router.post("/admin/forget-password", async (req, res) => {
  try {
    const { email, secretKey } = req.body;
    if (secretKey != process.env.ADMIN_SECRET_KEY) {
      return res.status(203).json({ msg: "Unidentified Secret key" });
    }
    const userData = await User.findOne({ email: email });
    if (userData) {
      if (userData.isVerified == false) {
        return res.status(201).json({ msg: "Please Verify your email first" });
      } else if (userData.isAdmin == false) {
        return res.status(204).json({ msg: "Not verified as an admin" });
      } else {
        const randString = randomstring.generate();
        let updatedData = await User.updateOne(
          { email: userData.email },
          { $set: { token: randString } }
        );
        sendResetMail(userData.name, email, randString);
        return res
          .status(200)
          .json({ msg: "Please check your email for reset link" });
      }
    } else {
      return res.status(202).json({ msg: "User email is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/forget-password", async (req, res) => {
  try {
    const token = req.query.token;
    let tokenData = await User.findOne({ token: token });
    if (tokenData) {
      return res.status(200).render("reset-password", { id: tokenData._id });
    } else {
      return res.status(301).json({ msg: "Unauthorized token access" });
    }
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    let password = req.body.password;
    let id = req.body.id;
    let salt = await bcrypt.genSalt(10); // salt is actually encrypted password
    password = await bcrypt.hash(password, salt);
    const updatedData = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { password: password, token: "" } }
    );
    res.render("success", {
      msg: "Password updated Successfully, go to login",
    });
  } catch (error) {
    return res.status(302).json({ msg: error.message });
  }
});

//admin reset password
router.post("/admin/reset-password", async (req, res) => {
  try {
    let { password, id, secretKey } = req.body;
    if (secretKey != process.env.ADMIN_SECRET_KEY) {
      return res.status(301).json({ msg: "Unidentified Secret Key" });
    }
    let salt = await bcrypt.genSalt(10); // salt is actually encrypted password
    password = await bcrypt.hash(password, salt);
    const updatedData = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { password: password, token: "" } }
    );
    return res
      .status(200)
      .json({ msg: "Password updated Successfully, goto login" });
  } catch (error) {
    return res.status(302).json({ msg: error.message });
  }
});

/*
    @usage :  to get user Info
    @url : /api/users/me
    @fields : no-fields
    @method : GET
    @access : PRIVATE
 */
router.get("/me", authenticate, async (request, response) => {
  try {
    let user = await Profile.findOne({user:request.user.id})
    response.status(200).json({
      user: user,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ errors: [{ msg: error.message }] });
  }
});

module.exports = router;
