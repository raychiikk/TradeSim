-- CreateTable
CREATE TABLE "BotConfig" (
    "id" TEXT NOT NULL,
    "botName" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BotConfig_botName_key" ON "BotConfig"("botName");
