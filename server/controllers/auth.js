import User from "../models/user";
import { comparePassword, hashPassword } from "../utils/auth";
import jwt from "jsonwebtoken"; //npm i jsonwebtoken
import AWS from "aws-sdk"; //npm i aws-sdk
import { nanoid } from "nanoid"; //npm i nanoid for unique shortcodes

//configuring aws
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};
//create a new instance of aws
const SES = new AWS.SES(awsConfig);
///route functions
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    //hash password
    const hashedPassword = await hashPassword(password);

    // register
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    // console.log("saved user", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error.. Try again");
  }
};

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    //check if user exists
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    //compare password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong Password");
    //create signin jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    //return user and token to client, exclude hashed password
    user.password = undefined;
    //send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      //secure:true, //only works on https
    });
    // send user as json response
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error! Please Try Again.");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signount success" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const sendTestEmail = async (req, res) => {
  // console.log("send email using ses");
  // res.json({ ok: true });
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: ["akumyoungt@gmail.com"],
    },
    ReplyToAddresses: [process.env.EMAIL_FROM],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
          <html>
          <h1>Reset password link</h1>
          <p>Please use the following link to reset your password</p>
          </html>
          `,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Password reset link",
      },
    },
  };
  const emailSent = SES.sendEmail(params).promise();
  emailSent
    .then((data) => {
      console.log(data);
      res.json({ ok: true });
    })
    .catch((err) => {
      console.log(err);
    });
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //console.log(email);
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) res.status(400).send("user not found");
    //prepare for email
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
            <html>
            <h1>Reset Password</h1>
            <p>Use this code to reset your password<p>
            <h2 style="color:red;">${shortCode}</h2>
            <i>Zamsi.com</i>
            </html>
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Password",
        },
      },
    };
    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

//
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, code } = req.body;
    const hashedPassword = await hashPassword(newPassword);
    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error!! try again");
  }
};
