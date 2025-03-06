-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "orgId" INTEGER,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "hasElevator" BOOLEAN NOT NULL,
    "hasStairs" BOOLEAN NOT NULL,
    "hasDoor" BOOLEAN NOT NULL,
    "searchTags" TEXT[],
    "floor" INTEGER NOT NULL,
    "building" TEXT NOT NULL,
    "edgeId" INTEGER[],

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" SERIAL NOT NULL,
    "nodeAId" INTEGER NOT NULL,
    "nodeBId" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "clearance" INTEGER NOT NULL,
    "obstructed" BOOLEAN NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("id")
);
