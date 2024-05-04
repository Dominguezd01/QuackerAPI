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
import { CommentLikeController } from "./controllers/CommentLikeController"
import { CommentRequackController } from "./controllers/CommentRequackController"
import { getViewsDir } from "./lib/getViewsDir"
import { Server } from "socket.io"
//Initialization variables
const app = express()
const prisma = new PrismaClient()
const PORT: number = Number(process.env.PORT) || 3333
const WSPORT: any = process.env.WSPORT || 3334
const rooms = ["news", "sports", "games"]
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

app.get("/rooms", authenticateToken, (req, res) => {
    res.status(200).json({ status: 200, rooms: rooms })
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

app.get(
    "/users/profileEdit/editInfo/getProfileEdit",
    authenticateToken,
    UsersControllers.getUserEditProfile
)

app.patch(
    "/users/profileEdit/editInfo/edit/editProfile",
    authenticateToken,
    UsersControllers.editProfile
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

app.patch(
    "/quacks/quack/delete",
    authenticateToken,
    QuacksController.deleteQuack
)

app.patch("/quacks/quack/edit", authenticateToken, QuacksController.editQuack)

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
    "/quacks/getUserQuacks",
    authenticateToken,
    QuacksController.getUserQuacks
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

app.post(
    "/comments/comment/like",
    authenticateToken,
    CommentLikeController.likeQuack
)

app.delete(
    "/comments/comment/dislike",
    authenticateToken,
    CommentLikeController.disLikeQuack
)

app.post(
    "/comments/comment/requack",
    authenticateToken,
    CommentRequackController.create
)

app.delete(
    "/comments/comment/deleteRequack",
    authenticateToken,
    CommentRequackController.delete
)

/**
 * Search related routes
 */
app.post("/search", authenticateToken, SearchController.search)

const httpServer = app.listen(PORT, () => {
    console.log(`Listening in port ${PORT}`)

    const io = new Server(httpServer, { cors: { origin: acceptedOrigins } })

    io.on("connection", (socket) => {
        socket.removeAllListeners()
        for (const room of rooms) {
            socket.rooms.add(room)
        }

        socket.on("join-room", (room) => {
            console.log(room)
            for (let room of socket.rooms) {
                socket.leave(room)
            }

            socket.join(room)
            console.log(socket.rooms)
        })

        socket.on("leave-room", (room) => {
            console.log(`${room} leave`)
            socket.leave(room)
        })

        socket.on("message", (data, room) => {
            if (room !== undefined) {
                console.log(data)
                io.to(room).emit("message", data)
            }
        })

        socket.on("disconnect", () => {
            console.log("A user disconnected")
        })
    })
})

httpServer.listen(WSPORT)
