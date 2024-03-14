import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    //console.log(req.body);
    const { fullname, password, corretcionPassword, phoneNumber, email } =
      req.body;

    if (password !== corretcionPassword)
      return res.status(400).json({ message: "Parolalar uyuşmuyor" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    return res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    return res.json({ message: "Kullanıcı oluşturma başarısız" });
  }
});
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "Kullanıcı mevcut değil" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Yanlış Parola" });

    return res.status(200).json({ user, message: "Kimlik Doğrulama Başarılı" });
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
});

export default router;
