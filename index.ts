import express from "express"
import { UsersControllers } from "./controllers/UsersController"
import cors from "cors"
import { QuacksController } from "./controllers/QuacksController"
import authenticateToken from "./lib/authenticateToken"
import { UserFollows } from "./models/UserFollows"
import { UserFollowsController } from "./controllers/UserFollowsController"
import { UserQuackLikeController } from "./controllers/UserQuackLikeController"
import { RequackController } from "./controllers/RequacksController"

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
app.get(
    "/users/profile/:userId/:userProfileCheck",
    authenticateToken,
    UsersControllers.getUserProfile
)

/**
 * Users follows realated routes
 */
app.post(
    "/usersFollows/follow",
    authenticateToken,
    UserFollowsController.follow
)
/**
 * Quacks related routes
 */
app.post("/quacks/main", authenticateToken, QuacksController.main)
app.post(
    "/quacks/quack/info/:quack_id",
    authenticateToken,
    QuacksController.getQuackById
)
app.post(
    "/quacks/quack/create",
    authenticateToken,
    QuacksController.createQuack
)
app.post(
    "/quacks/quack/like",
    authenticateToken,
    UserQuackLikeController.likeQuack
)
app.delete(
    "/quacks/quack/dislike",
    authenticateToken,
    UserQuackLikeController.disLikeQuack
)
app.post("/quacks/quack/requack", authenticateToken, RequackController.requack)

app.delete(
    "/quacks/quack/deleteRequack",
    authenticateToken,
    RequackController.deleteRequack
)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
