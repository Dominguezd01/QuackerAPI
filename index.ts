import express from "express"
import { UsersControllers } from "./controllers/UsersController"
import cors from "cors"
import { QuacksController } from "./controllers/QuacksController"
import authenticateToken from "./lib/authenticateToken"
import { UserFollowsController } from "./controllers/UserFollowsController"
import { UserQuackLikeController } from "./controllers/UserQuackLikeController"
import { RequackController } from "./controllers/RequacksController"
import { CommentsController } from "./controllers/CommentsController"
import { SearchController } from "./controllers/SearchController"
import { Quack } from "./models/Quack"
import { PrismaClient } from "@prisma/client"

//Initialization variables
const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3333
let acceptedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://quackersocial.netlify.app",
]

//Setting middlewares
app.use(express.json())
app.use(
    cors({
        origin: acceptedOrigins,
    })
)

//Routes to test the state
app.get("/ping", (req, res) => {
    res.send("pong")
})

/**
 * Users related routes
 */
app.post("/users/auth/register", UsersControllers.register)
app.get("/users/auth/verifyRegister/:userName", UsersControllers.verifyUser)
app.post("/users/auth/login", UsersControllers.login)
app.get(
    "/users/profile/:userName",
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

app.delete(
    "/usersFollows/unfollow",
    authenticateToken,
    UserFollowsController.unFollow
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

app.post(
    "/comments/comment/create",
    authenticateToken,
    CommentsController.create
)

app.delete(
    "/comments/comment/delete",
    authenticateToken,
    CommentsController.delete
)

app.get(
    "/comments/comment/getComments/:quackId",
    authenticateToken,
    CommentsController.getCommentsFromQuack
)
/**
 * Search related routes
 */
app.post("/search", authenticateToken, SearchController.search)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})
