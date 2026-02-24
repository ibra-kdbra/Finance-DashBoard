import prisma from "../../data/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* SIGNUP */
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Signup Request Received:", { username, email });

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: "Username or Email already in use. " });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: passwordHash,
            },
        });

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: "Account creation failed: " + err.message });
    }
};

/* LOGIN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body; // 'email' field in request can be email or username
        console.log("Login Request Received for identifier:", email);

        // Find user by email OR username
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: email }
                ]
            }
        });

        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({ token, user: userWithoutPassword });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
