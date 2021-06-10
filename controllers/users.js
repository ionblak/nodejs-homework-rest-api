const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { promisify } = require("util");

require("dotenv").config();

const Users = require("../model/users");
const { HTTP_CODE } = require("../helpers/constants");
const Upload = require("../services/upload-avatars-cloud");
const EmailService = require("../services/email");
const CreateSenderSendgrid = require("../services/sender-email");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HTTP_CODE.CONFLICT).json({
        status: "error",
        code: HTTP_CODE.CONFLICT,
        nessage: "Email is already used",
      });
    }
    const newUser = await Users.create(req.body);
    const { id, name, email, subscription, avatar, verifyToken } = newUser;
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendgrid()
      );

      await emailService.sendVerifyPasswordEmail(verifyToken, email, name);
    } catch (err) {
      console.log(err);
    }
    return res.status(HTTP_CODE.CREATED).json({
      status: "success",
      code: HTTP_CODE.CREATED,
      data: { id, name, email, subscription, avatar },
    });
  } catch (err) {
    next(err);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);
    if (!user || !isValidPassword) {
      return res.status(HTTP_CODE.UNAUTHORIZED).json({
        status: "error",
        code: HTTP_CODE.UNAUTHORIZED,
        nessage: "Invalid crendentials",
      });
    }
    if (!user.verify) {
      return res.status(HTTP_CODE.UNAUTHORIZED).json({
        status: "error",
        code: HTTP_CODE.UNAUTHORIZED,
        nessage: "Check email for verification",
      });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(user.id, token);
    return res.status(HTTP_CODE.OK).json({
      status: "success",
      code: HTTP_CODE.OK,
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};
const logout = async (req, res, next) => {
  try {
    await Users.updateToken(req.user.id, null);
    return res.status(HTTP_CODE.NO_CONTENT).json({});
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, subscription } = await Users.findById(userId);
    return res.status(HTTP_CODE.OK).json({
      status: "success",
      code: HTTP_CODE.OK,
      data: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, subscription } = await Users.update(userId, req.body);

    return res.status(HTTP_CODE.OK).json({
      status: "success",
      code: HTTP_CODE.OK,
      data: {
        email,
        subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};
const avatars = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const uploadCloud = promisify(cloudinary.uploader.upload);
    const uploads = new Upload(uploadCloud);

    const { userIdImg, avatarUrl } = await uploads.saveAvatarToCloud(
      req.file.path,
      req.user.userIdImg
    );
    await Users.updateAvatar(userId, avatarUrl, userIdImg);

    return res.status(HTTP_CODE.OK).json({
      status: "success",
      code: HTTP_CODE.OK,
      data: { avatarUrl },
    });
  } catch (e) {
    next(e);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findUserByVerifyToken(
      req.params.verificationToken
    );
    if (user) {
      await Users.updateVerifyToken(user.id, true, null);
      return res.status(HTTP_CODE.OK).json({
        status: "success",
        code: HTTP_CODE.OK,
        message: "Verification successful",
      });
    } else {
      return res.status(HTTP_CODE.NOT_FOUND).json({
        status: "error",
        message: "User not found",
        code: HTTP_CODE.NOT_FOUND,
      });
    }
  } catch (e) {
    next(e);
  }
};
const repeatSendEmailVerify = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);

    if (user) {
      const { name, email, verifyToken, verify } = user;

      if (!verify) {
        try {
          const emailService = new EmailService(
            process.env.NODE_ENV,
            new CreateSenderSendgrid()
          );
          await emailService.sendVerifyPasswordEmail(verifyToken, email, name);
          return res.status(HTTP_CODE.OK).json({
            status: "success",
            code: HTTP_CODE.OK,
            message: "Verification email resubmited!",
          });
        } catch (err) {
          console.log(err);
        }
      }
      return res.status(HTTP_CODE.CONFLICT).json({
        status: "error",
        code: HTTP_CODE.CONFLICT,
        nessage: "Email has already been verified",
      });
    } else {
      return res.status(HTTP_CODE.NOT_FOUND).json({
        status: "error",
        message: "User not found",
        code: HTTP_CODE.NOT_FOUND,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getUser,
  update,
  avatars,
  verify,
  repeatSendEmailVerify,
};
