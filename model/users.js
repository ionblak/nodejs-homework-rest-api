const User = require("./schemas/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const create = async (options) => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  const result = await User.findByIdAndUpdate(
    { _id: id },
    { token },
    { new: true }
  );
  return result;
};
const update = async (id, body) => {
  const result = await User.findByIdAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  );
  return result;
};
const updateAvatar = async (id, avatar, userIdImg = null) => {
  return await User.updateOne({ _id: id }, { avatar, userIdImg });
};

module.exports = {
  findById,
  findByEmail,
  create,
  update,
  updateToken,
  updateAvatar,
};
