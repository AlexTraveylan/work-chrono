-- CreateTable
CREATE TABLE "TaskSession" (
    "id" SERIAL NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT NOT NULL,
    "endedAt" TIMESTAMP(3),
    "daySessionId" INTEGER,

    CONSTRAINT "TaskSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pause" (
    "id" SERIAL NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "daySessionId" INTEGER,

    CONSTRAINT "Pause_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DaySession" (
    "id" SERIAL NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "userId" INTEGER,

    CONSTRAINT "DaySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserApp" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "taches" TEXT[],

    CONSTRAINT "UserApp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserApp_email_key" ON "UserApp"("email");

-- AddForeignKey
ALTER TABLE "TaskSession" ADD CONSTRAINT "TaskSession_daySessionId_fkey" FOREIGN KEY ("daySessionId") REFERENCES "DaySession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pause" ADD CONSTRAINT "Pause_daySessionId_fkey" FOREIGN KEY ("daySessionId") REFERENCES "DaySession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaySession" ADD CONSTRAINT "DaySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserApp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
