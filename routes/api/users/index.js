const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const guard = require("../../../helpers/guard");
const { validateUser, validateUpdateUser } = require("./validation_users");
const upload = require("../../../helpers/upload");

router.get("/verify/:verificationToken", ctrl.verify);

router.post("/verify", ctrl.repeatSendEmailVerify);

router.post("/signup", validateUser, ctrl.signup);

router.post("/login", validateUser, ctrl.login);

router.post("/logout", guard, ctrl.logout);

router.get("/current", guard, ctrl.getUser);

router.patch("/avatars", [guard, upload.single("avatar")], ctrl.avatars);

router.patch("/", guard, validateUpdateUser, ctrl.update);

module.exports = router;
