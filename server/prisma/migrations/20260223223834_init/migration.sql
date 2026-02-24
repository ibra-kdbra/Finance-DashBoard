-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "expense" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "buyer" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KPI" (
    "id" TEXT NOT NULL,
    "totalProfit" DECIMAL(10,2) NOT NULL,
    "totalRevenue" DECIMAL(10,2) NOT NULL,
    "totalExpenses" DECIMAL(10,2) NOT NULL,
    "expensesByCategory" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KPI_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthData" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "revenue" DECIMAL(10,2) NOT NULL,
    "expenses" DECIMAL(10,2) NOT NULL,
    "operationalExpenses" DECIMAL(10,2) NOT NULL,
    "nonOperationalExpenses" DECIMAL(10,2) NOT NULL,
    "kpiId" TEXT NOT NULL,

    CONSTRAINT "MonthData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayData" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "revenue" DECIMAL(10,2) NOT NULL,
    "expenses" DECIMAL(10,2) NOT NULL,
    "kpiId" TEXT NOT NULL,

    CONSTRAINT "DayData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductTransactions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductTransactions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_ProductTransactions_B_index" ON "_ProductTransactions"("B");

-- AddForeignKey
ALTER TABLE "MonthData" ADD CONSTRAINT "MonthData_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "KPI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayData" ADD CONSTRAINT "DayData_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "KPI"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTransactions" ADD CONSTRAINT "_ProductTransactions_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTransactions" ADD CONSTRAINT "_ProductTransactions_B_fkey" FOREIGN KEY ("B") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
