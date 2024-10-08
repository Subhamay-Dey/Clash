import express from "express";
import "dotenv/config";
import ejs from "ejs";
const app = express();
const PORT = process.env.PORT || 8000;
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import Routes from "./routes/index.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import fileUpload from "express-fileupload";
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(appLimitter);
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
// Routes
app.use(Routes);
app.get("/", async (req, res) => {
    const html = await ejs.renderFile(__dirname + `/views/emails/welcome.ejs`, {
        name: "Subhamay Dey"
    });
    // await sendEmail("gejovic245@degcos.com", "Testing SMTP", html)
    await emailQueue.add(emailQueueName, { to: "gejovic245@degcos.com", subject: "Testing SMTP", html: html });
    return res.json({ msg: "Email send successfully!" });
});
import "./jobs/index.js";
import { emailQueue, emailQueueName } from "./jobs/EmailJob.js";
import { appLimitter } from "./config/rateLimit.js";
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
