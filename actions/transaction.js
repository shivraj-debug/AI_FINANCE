"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const serializeAmount = (obj) => ({
  ...obj,
  amount: Number(obj.amount),
});

// 🔥 Helper
async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) throw new Error("User not found");

  return { user, session };
}

// ================= CREATE =================

export async function createTransaction(data) {
  try {
    const { user, session } = await getCurrentUser();

    const req = await request();

    const decision = await aj.protect(req, {
      userId: session.user.id,
      requested: 1,
    });

    if (decision.isDenied()) {
      throw new Error("Too many requests. Please try again later.");
    }

    const account = await prisma.financeAccount.findFirst({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) throw new Error("Account not found");

    const balanceChange =
      data.type === "EXPENSE" ? -data.amount : data.amount;

    const transaction = await prisma.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(
                  data.date,
                  data.recurringInterval
                )
              : null,
        },
      });

      await tx.financeAccount.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: balanceChange,
          },
        },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

// ================= GET SINGLE =================

export async function getTransaction(id) {
  const { user } = await getCurrentUser();

  const transaction = await prisma.transaction.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

// ================= UPDATE =================

export async function updateTransaction(id, data) {
  try {
    const { user } = await getCurrentUser();

    const original = await prisma.transaction.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!original) throw new Error("Transaction not found");

    const oldChange =
      original.type === "EXPENSE"
        ? -Number(original.amount)
        : Number(original.amount);

    const newChange =
      data.type === "EXPENSE"
        ? -data.amount
        : data.amount;

    const netChange = newChange - oldChange;

    const updated = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.update({
        where: { id },
        data: {
          ...data,
          nextRecurringDate:
            data.isRecurring && data.recurringInterval
              ? calculateNextRecurringDate(
                  data.date,
                  data.recurringInterval
                )
              : null,
        },
      });

      await tx.financeAccount.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netChange,
          },
        },
      });

      return transaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(updated) };
  } catch (error) {
    throw new Error(error.message);
  }
}

// ================= GET ALL =================

export async function getUserTransactions(query = {}) {
  try {
    const { user } = await getCurrentUser();

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        ...query,
      },
      include: {
        account: true,
      },
      orderBy: { date: "desc" },
    });

    return {
      success: true,
      data: transactions.map(serializeAmount),
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

// ================= RECEIPT SCAN =================

export async function scanReceipt(file) {
  try {
    // const model = genAI.getGenerativeModel({
    //   model: "gemini-1.5-flash",
    // });

//     const models = await genAI.listModels();
// console.log(models);

    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `
      Analyze this receipt image and extract:
      amount, date (ISO), description, merchantName, category.
      Return valid JSON only.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      },
      prompt,
    ]
    );

    const response = await  result.response;
    const cleaned = response.text().replace(/```(?:json)?\n?/g, "").trim();

    const data = JSON.parse(cleaned);

    return {
      amount: parseFloat(data.amount),
      date: new Date(data.date),
      description: data.description,
      category: data.category,
      merchantName: data.merchantName,
    };
  } catch (error) {
    console.error("Receipt scan actual error:", error);
    throw error;   // temporarily rethrow original error
  }
}

// ================= HELPER =================



function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      date.setDate(date.getDate() + 1);
      break;
    case "WEEKLY":
      date.setDate(date.getDate() + 7);
      break;
    case "MONTHLY":
      date.setMonth(date.getMonth() + 1);
      break;
    case "YEARLY":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}