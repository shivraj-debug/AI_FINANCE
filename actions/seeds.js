"use server";

import { prisma } from "@/lib/prisma";
import { subDays } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"

// Categories
const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [5000, 8000] },
    { name: "freelance", range: [1000, 3000] },
    { name: "investments", range: [500, 2000] },
    { name: "other-income", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "housing", range: [1000, 2000] },
    { name: "transportation", range: [100, 500] },
    { name: "groceries", range: [200, 600] },
    { name: "utilities", range: [100, 300] },
    { name: "entertainment", range: [50, 200] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [100, 500] },
    { name: "healthcare", range: [100, 1000] },
    { name: "education", range: [200, 1000] },
    { name: "travel", range: [500, 2000] },
  ],
};

function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category =
    categories[Math.floor(Math.random() * categories.length)];

  const amount = getRandomAmount(category.range[0], category.range[1]);

  return { category: category.name, amount };
}

export async function seedTransactions() {
  try {
    // 🔥 Get logged-in user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

   
    const account = await prisma.financeAccount.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    });

    if (!account) {
      throw new Error("No default account found");
    }

    const transactions = [];
    let totalBalance = 0;

    // Generate 90 days
    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        const transaction = {
          id: crypto.randomUUID(),
          type,
          amount,
          description:
            type === "INCOME"
              ? `Received ${category}`
              : `Paid for ${category}`,
          date,
          category,
          status: "COMPLETED",
          userId,
          accountId: account.id,
          createdAt: date,
          updatedAt: date,
        };

        totalBalance += type === "INCOME" ? amount : -amount;
        transactions.push(transaction);
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: { accountId: account.id },
      });

      await tx.transaction.createMany({
        data: transactions,
      });

      await tx.account.update({
        where: { id: account.id },
        data: { balance: totalBalance },
      });
    });

    return {
      success: true,
      message: `Created ${transactions.length} transactions`,
    };
  } catch (error) {
    console.error("Error seeding transactions:", error);
    return { success: false, error: error.message };
  }
}