import { Router } from "express";
import prisma from "../config/databse.js";
import { authLimitter } from "../config/rateLimit.js";
import { ZodError } from "zod";
import { formatError } from "../helper.js";
import { forgetPasswordSchema } from "../validation/passwordValidation.js";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
const router = Router();
router.post("/forget-password", authLimitter, async (req, res) => {
    try {
        const body = req.body;
        const payload = forgetPasswordSchema.parse(body);
        // Checking user existence of the email.
        let user = await prisma.user.findUnique({ where: { email: payload.email } });
        if (!user || user == null) {
            return res.status(422).json({ message: "Invalid data", errors: {
                    email: "No user found with this email."
                } });
        }
        const salt = await bcrypt.genSalt(10);
        const token = await bcrypt.hash(uuid4(), salt);
        await prisma.user.update({
            data: {
                password_reset_token: token,
                token_send_at: new Date().toISOString()
            },
            where: {
                email: payload.email
            },
        });
        const url = `${process.env.CLIENT_APP_URL}/reset-password?email=${payload.email}&token=${token}`;
    }
    catch (error) {
        if (error instanceof ZodError) {
            const errors = formatError(error);
            return res.status(422).json({ message: "Invalid data", errors });
        }
        return res.status(500).json({ message: "Something went wrong, please try again!" });
    }
});
export default router;
