import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs/promises';
import Jimp from 'jimp';
import gravatar from 'gravatar';
import { User } from '../models/user.js';
import { errorRequest } from '../assets/errorMessages.js';
import { sendEmail } from '../assets/sendEmail.js';
import { createVerifyEmail } from '../assets/createVerifyEmail.js';
import { nanoid } from 'nanoid';

const secKey = process.env.SECRET_KEY;
const avatarsDir = path.resolve('./', 'public', 'avatars');

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw errorRequest(409, 'Email in use');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const result = await User.create({
      name,
      email,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const mail = createVerifyEmail(email, verificationToken);
    await sendEmail(mail);

    res.status(201).json({
      name: result.name,
      email: result.email,
      subscription: result.subscription,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const verify = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new Error('User not found');
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: '' });

    res.status(200).json({
      message: 'Verification successful',
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw RequestError(404);
  }

  if (user.verify) {
    throw RequestError(400, 'Verification has already been passed');
  }

  const mail = createVerifyEmail(email, user.verificationToken);

  await sendEmail(mail);

  res.json({
    message: 'Verification email sent',
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.verify) {
      throw errorRequest(401, 'Email or password is wrong');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw errorRequest(401, 'Email or password is wrong');
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, secKey, { expiresIn: '12h' });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
      message: 'Login success',
      token,
      name: user.name,
      email: user.email,
      subscription: user.subscription,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const getCurrent = async (req, res) => {
  try {
    const { name, email, subscription } = req.user;
    res.status(200).json({
      name,
      email,
      subscription,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const logout = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.status(200).json({
      message: 'Logout success',
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const updateUserSubscription = async (req, res) => {
  try {
    const { email } = req.user;
    const { subscription } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw errorRequest(401, 'Email or password is wrong');
    }

    const result = await User.findByIdAndUpdate(user._id, { subscription });
    res.status(200).json({
      name: user.name,
      email: user.email,
      subscription,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const extension = originalname.split('.').pop();
    const filename = `${_id}.${extension}`;

    const resultUpload = path.join(avatarsDir, filename);

    Jimp.read(tempUpload, async (error, avatar) => {
      try {
        if (error) throw error;
        await avatar.resize(250, 250).writeAsync(tempUpload);
        fs.rename(tempUpload, resultUpload);
      } catch (error) {
        throw error;
      }
    });

    const avatarURL = path.join('public', 'avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({
      message: 'Avatar updated',
      avatarURL,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while updating the avatar',
      error,
    });
  }
};
