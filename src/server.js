import app from "./app.js"
import { createServer } from "http"
import dotenv from "dotenv"

dotenv.config();

const { APP_PORT } = process.env;

const port = APP_PORT || 3000

const server = createServer(app)

server.listen(port, () => {
    console.log("server running on port " + port);
})
