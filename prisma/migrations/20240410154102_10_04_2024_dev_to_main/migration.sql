-- CreateTable
CREATE TABLE "quacks" (
    "id" SERIAL NOT NULL,
    "quack_id" VARCHAR(45) NOT NULL,
    "content" TEXT NOT NULL,
    "creation_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parent_post_id" INTEGER,
    "is_quote" BOOLEAN NOT NULL,
    "is_reply" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,

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
    "user_id" INTEGER NOT NULL,
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
    "bio" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "comment_id" VARCHAR(60),
    "content" TEXT,
    "is_active" BOOLEAN,
    "creation_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_quack" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_quak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quack_comments" (
    "id" SERIAL NOT NULL,
    "quack_id" INTEGER,
    "comment_id" INTEGER,

    CONSTRAINT "quack_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_like" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "comment_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_requack" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "comment_requack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments_comment" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER,
    "comment_commented_id" INTEGER,

    CONSTRAINT "comments_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_comments" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER,
    "user_id" INTEGER,

    CONSTRAINT "user_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_follow" ON "user_follows"("user_id", "user_id_followed");

-- CreateIndex
CREATE UNIQUE INDEX "user_quack_like_uq" ON "user_quack_like"("user_id", "post_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_unique" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_unique" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "uq_like_comment" ON "comment_like"("comment_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_requack_comment" ON "comment_requack"("comment_id", "user_id");

-- AddForeignKey
ALTER TABLE "requacks" ADD CONSTRAINT "requacks_post_id_foreign" FOREIGN KEY ("post_id") REFERENCES "quacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requacks" ADD CONSTRAINT "requacks_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_followed_foreign" FOREIGN KEY ("user_id_followed") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_following_foreign" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_quack_like" ADD CONSTRAINT "user_quack_like_post_id_foreign" FOREIGN KEY ("post_id") REFERENCES "quacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_quack_like" ADD CONSTRAINT "user_quack_like_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_quack" ADD CONSTRAINT "user_quak_post_id_foreign" FOREIGN KEY ("post_id") REFERENCES "quacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_quack" ADD CONSTRAINT "user_quak_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quack_comments" ADD CONSTRAINT "quack_comments_comments_fk" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quack_comments" ADD CONSTRAINT "quack_comments_quacks_fk" FOREIGN KEY ("quack_id") REFERENCES "quacks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment_like" ADD CONSTRAINT "comment_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment_requack" ADD CONSTRAINT "comment_requack_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment_requack" ADD CONSTRAINT "comment_requack_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments_comment" ADD CONSTRAINT "comments_comment_comment_commented_id_fkey" FOREIGN KEY ("comment_commented_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments_comment" ADD CONSTRAINT "comments_comment_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_comments" ADD CONSTRAINT "user_comments_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_comments" ADD CONSTRAINT "user_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
