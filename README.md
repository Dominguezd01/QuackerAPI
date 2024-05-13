# Quacker API

This is the api of [Quacker](https://github.com/Dominguezd01/Quacker "Quacker Repo") a Twitter inspired social media that I'm making for my final project.

# Cloning

Clone the repository:

```bash
git clone https://github.com/Dominguezd01/QuackerAPI.git
```

Go to the directory

```bash
cd QuackerAPI
```

# Install dependencies

```bash
bun install
```

# **Dont forget to add your .env configurations, otherwise the project will fail at start**
Just create a .env file in the root of the project and modify the values shown to match your needs
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
GMAIL_ACC= example@gmail.com
GMAIL_TOKEN="your third party app token"
TOKEN_SECRET="Secret to create JWT"
LOGIN_QUACKER="http://localhost:5173/users/auth/login"
```
Now you have to run the migration needed to create the tables in the database:
```
bunx prisma migrate dev
```
This will create the tables in your database and also the prisma_migrations table 

# Run the project in development
To run the project you can either use two of this commands:

If you dont want the server to restart with every change run this command:
```bash
bun index.ts
```
Otherwise:
```bash
bun run dev
```

## Building

Run the following command to compile to JavaScript all the project, create the prisma client and start the API:
```bash
bun run build
```
If you already have the API compiled, you can use this command in the directory of the file:
```
bun server.js
``` 
