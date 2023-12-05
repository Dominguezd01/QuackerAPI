-- CreateTable
CREATE TABLE "quacks" (
    "id" SERIAL NOT NULL,
    "quack_id" VARCHAR(45) NOT NULL,
    "content" TEXT NOT NULL,
    "creation_date" TIMESTAMP(0) NOT NULL DEFAULT '2023-11-28 12:15:23.287615'::timestamp without time zone,
    "parent_post_id" INTEGER,
    "is_quote" BOOLEAN NOT NULL,
    "is_reply" BOOLEAN NOT NULL,

    CONSTRAINT "quacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requacks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "requacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follows" (
    "id" SERIAL NOT NULL,
    "user_id_following" INTEGER NOT NULL,
    "user_id_followed" INTEGER NOT NULL,

    CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_quack_like" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_quack_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_quak" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_quak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "profile_picture" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "email_is_valid" BOOLEAN NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_unique" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_unique" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "users"("email");

-- AddForeignKey
ALTER TABLE "requacks" ADD CONSTRAINT "requacks_post_id_foreign" FOREIGN KEY ("post_id") REFERENCES "quacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requacks" ADD CONSTRAINT "requacks_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_followed_foreign" FOREIGN KEY ("user_id_followed") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_following_foreign" FOREIGN KEY ("user_id_following") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_quack_like" ADD CONSTRAINT "user_quack_like_post_id_foreign" FOREIGN KEY ("post_id") REFERENCES "quacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_quack_like" ADD CONSTRAINT "user_quack_like_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_quak" ADD CONSTRAINT "user_quak_post_id_foreign" FOREIGN KEY ("post_id") REFERENCES "quacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_quak" ADD CONSTRAINT "user_quak_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
