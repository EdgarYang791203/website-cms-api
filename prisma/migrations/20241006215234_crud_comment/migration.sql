-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT 'default_nickname',
    "option" TEXT NOT NULL DEFAULT 'upvote',
    "comment" TEXT NOT NULL DEFAULT 'default_comment',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);
