-- CreateTable
CREATE TABLE "Alert" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "threshold" DECIMAL(65,30) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "triggeredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
