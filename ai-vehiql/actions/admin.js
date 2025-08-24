"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

function ErrorMessage(success, message) {
  return {
    success,
    error: message,
  };
}

export async function getAdmin() {
  const { userId } = await auth();

  if (!userId) return ErrorMessage(false, "Not Authorized!");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) return ErrorMessage(false, "User Not Found!");

  if (user.role !== "ADMIN") return ErrorMessage(false, "Not Authorized!");

  return {
    authorized: true,
    user,
  };
}
