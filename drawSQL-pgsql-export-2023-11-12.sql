
CREATE TABLE "quacks"(
    "id" SERIAL NOT NULL,
    "quack_id" VARCHAR(45) NOT NULL
    "content" VARCHAR(255) NOT NULL,
    "creation_date" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT 'NOW()',
    "parent_post_id" INTEGER NULL,
    "isQuote" BOOLEAN NOT NULL
);
ALTER TABLE
    "quacks" ADD PRIMARY KEY("id");


CREATE TABLE "users"(
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "profile_picture" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "isActive" BOOLEAN NOT NULl,
    "emailIsValid" BOOLEAN NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_user_id_unique" UNIQUE("user_id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");


CREATE TABLE "user_quack_like"(
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL
);
ALTER TABLE
    "user_quack_like" ADD PRIMARY KEY("id");



CREATE TABLE "requacks"(
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL
);

ALTER TABLE
    "requacks" ADD PRIMARY KEY("id");



CREATE TABLE "user_quak"(
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL
);
ALTER TABLE
    "user_quak" ADD PRIMARY KEY("id");


CREATE TABLE "user_follows"(
    "id" SERIAL NOT NULL,
    "user_id_following" INTEGER NOT NULL,
    "user_id_followed" INTEGER NOT NULL
);
ALTER TABLE
    "user_follows" ADD PRIMARY KEY("id");
ALTER TABLE
    "requacks" ADD CONSTRAINT "requacks_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "user_quack_like" ADD CONSTRAINT "user_quack_like_post_id_foreign" FOREIGN KEY("post_id") REFERENCES "quacks"("id");
ALTER TABLE
    "user_quak" ADD CONSTRAINT "user_quak_post_id_foreign" FOREIGN KEY("post_id") REFERENCES "quacks"("id");
ALTER TABLE
    "user_follows" ADD CONSTRAINT "user_follows_user_id_followed_foreign" FOREIGN KEY("user_id_followed") REFERENCES "users"("id");
ALTER TABLE
    "user_quack_like" ADD CONSTRAINT "user_quack_like_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "user_follows" ADD CONSTRAINT "user_follows_user_id_following_foreign" FOREIGN KEY("user_id_following") REFERENCES "users"("id");
ALTER TABLE
    "user_quak" ADD CONSTRAINT "user_quak_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "requacks" ADD CONSTRAINT "requacks_post_id_foreign" FOREIGN KEY("post_id") REFERENCES "quacks"("id");