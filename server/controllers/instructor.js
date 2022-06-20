import User from "../models/user";
import Course from "../models/course";
import queryString from "query-string";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

export const makeInstructor = async (req, res) => {
  try {
    //find user from db
    const user = await User.findById(req.user._id).exec();
    //if user doesnt have stripe account yet, create a new one
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({ type: "express" });
      user.stripe_account_id = account.id;
      user.save();
    }
    // create account link based on account id(for frontend to complete onboarding )
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });
    // pre-fill any info such as email(optional, and send url response to frontend)
    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    });
    // send the account link as a response to the front end
    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (err) {
    console.log("Make instructor error", err);
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    //console.log("accounts =>", account);
    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorized");
    } else {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account,
          $addToSet: { role: "Instructor" }, //addto set makes sure there is no duplicate
        },
        { new: true }
      ).exec();
      statusUpdated.password = undefined;
      res.json(statusUpdated);
    }
  } catch (err) {
    console.log(err);
  }
};

//get current instructor
export const currentInstructor = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).select("-password").exec();
    console.log(user);
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};

export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 })
      .exec();
    res.json(courses);
  } catch (err) {
    console.log(err);
  }
};

export const studentCount = async (req, res) => {
  try {
    const users = await User.find({ courses: req.body.courseId })
      .select("_id")
      .exec();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};
export const instructorBalance = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).exec();
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });
    res.json(balance);
  } catch (err) {
    console.log(err);
  }
};

export const instructorPayoutSettings = async (req, res) => {
  try {
    let user = await User.findById(req.user._id).exec();
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_seller.id,
      { redirect_url: process.env.STRIPE_SETTINGS_REDIRECT }
    );
    res.json(loginLink.url);
  } catch (err) {
    console.log("stripe payout login error", err);
  }
};
