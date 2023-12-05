import express from "express"
import { UsersControllers } from "./controllers/UsersController"
import cors from "cors"
import { QuacksController } from "./controllers/QuacksController"
import authenticateToken from "./lib/authenticateToken"

//Initialization variables
const app = express()
const PORT = process.env.PORT || 3333
let acceptedOrigins = ["http://localhost:5173"]

//setting middlewares
app.use(express.json())
app.use(
    cors({
        origin: acceptedOrigins,
    })
)

//routes to test the state
app.get("/ping", (req, res) => {
    res.send("pong")
})

/**
 * Users related routes
 */
app.post("/users/auth/register", UsersControllers.register)
app.get("/users/auth/verifyRegister/:userId", UsersControllers.verifyUser)
app.post("/users/auth/login", UsersControllers.login)

/**
 * Quacks related routes
 */
app.post("/quacks/main", authenticateToken, QuacksController.main)
app.get("/quacks/quack/:quack_id", QuacksController.getQuackById)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
