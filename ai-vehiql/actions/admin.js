"use server";

import { auth } from "@clerk/nextjs/server";

export async function getAdmin() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Not Authorized");
  }
}
