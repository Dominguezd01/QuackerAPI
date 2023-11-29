import express from "express"
import { UsersControllers } from "./controllers/UsersController"
import cors from "cors"
const app = express()
const PORT = process.env.PORT || 3333

app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173"

}))
app.get("/ping", (req, res) => {
  res.send("pong")
})

app.post("/users/auth/register", UsersControllers.register)
app.get("/users/auth/verifyRegister/:userId", UsersControllers.verifyUser)
app.post("/users/auth/login", UsersControllers.login)
/** 
async function createUser() {
  await prisma.users.create({
    data: {
      display_name: "Dominguez",
      email: "migueldominguezroman01@gmail.com",
      password: await encodePass("Manzanitas23"),
      email_is_valid: true,
      is_active: true,
      user_id: uuidv4(),
      user_name: "Dominguezd01",
    },
  })
}
*/
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})
