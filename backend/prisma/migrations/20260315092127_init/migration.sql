-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyPrice" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "open" DECIMAL(65,30) NOT NULL,
    "high" DECIMAL(65,30) NOT NULL,
    "low" DECIMAL(65,30) NOT NULL,
    "close" DECIMAL(65,30) NOT NULL,
    "volume" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarningResult" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "quarter" TEXT NOT NULL,
    "revenue" DECIMAL(65,30),
    "netProfit" DECIMAL(65,30),
    "eps" DECIMAL(65,30),
    "yoyGrowth" DECIMAL(65,30),
    "announcedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarningResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" SERIAL NOT NULL,
    "stockId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "confidence" DECIMAL(65,30) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pattern_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stock_symbol_key" ON "Stock"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPrice_stockId_date_key" ON "DailyPrice"("stockId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "EarningResult_stockId_quarter_key" ON "EarningResult"("stockId", "quarter");

-- AddForeignKey
ALTER TABLE "DailyPrice" ADD CONSTRAINT "DailyPrice_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarningResult" ADD CONSTRAINT "EarningResult_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pattern" ADD CONSTRAINT "Pattern_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
