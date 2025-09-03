"use server";

import { db } from "@/lib/prisma";

export async function getCarFilters() {
  try {
    let where = { status: "AVAILABLE" };

    // Get Unique makes

    const makes = await db.car.findMany({
      where,
      select: { make: true },
      distinct: ["make"],
      orderBy: { make: "asc" },
    });
  } catch (error) {}
}
