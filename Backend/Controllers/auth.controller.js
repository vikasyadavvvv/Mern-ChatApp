import bcrypt from 'bcryptjs'
import User from "../models/user.model.js";
import GenerateTokenandSetCookies from '../Utils/Generatetoken.js';


export const Signup = async (req, resp) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return resp.status(400).json({ error: "Password don't match" });
        }
        const user = await User.findOne({ username });
        if (user) {
            return resp.status(400).json({ error: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);

        const Boyprofilepic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const Girlprofilepic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const NewUser = new User({
            fullName,
            username,
            password: hashpassword,
            gender,
            profilepic: gender === "male" ? Boyprofilepic : Girlprofilepic
        });

        await NewUser.save();
        GenerateTokenandSetCookies(NewUser._id, resp);

        return resp.status(201).json({
            _id: NewUser._id,
            fullName: NewUser.fullName,
            username: NewUser.username,
            profilepic: NewUser.profilepic
        });
    } catch (error) {
        console.log("Error in Signup Controller", error.message);
        return resp.status(500).json("Internal Server Error");
    }
};

export const Login = async (req, resp) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return resp.status(500).json({ error: "Invalid Username or Password" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password || "");

        if (!isPasswordCorrect) {
            return resp.status(500).json({ error: "Invalid Username or Password" });
        }

        GenerateTokenandSetCookies(user._id, resp);

        return resp.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            password: user.password,
            profilepic: user.profilepic
        });
    } catch (error) {
        console.log("Error in Login Controller", error.message);
        return resp.status(500).json("Internal Server Error");
    }
};

export const Logout = (req, resp) => {
    try {
        resp.cookie("jwt", "", { maxAge: 0 });
        return resp.status(200).json('Logout Successfully');
    } catch (error) {
        console.log("Error in Logout Controller", error.message);
        return resp.status(500).json("Internal Server Error");
    }
};
