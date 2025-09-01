"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { success } from "zod";

function ErrorMessage(message) {
  return {
    success: false,
    error: message,
  };
}

export async function getDealershipInfo() {
  try {
    const { userId } = await auth();
    if (!userId) return ErrorMessage("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") return ErrorMessage("Not Authorized");

    let dealership = await db.dealershipInfo.findFirst({
      include: {
        workingHours: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
    });

    if (!dealership) {
      dealership = await db.dealershipInfo.create({
        data: {
          workingHours: {
            create: [
              {
                dayOfWeek: "MONDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "TUESDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "WEDNESDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "THURSDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "FRIDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "SATURDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: true,
              },
              {
                dayOfWeek: "SUNDAY",
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: false,
              },
            ],
          },
        },
        include: {
          workingHours: {
            orderBy: {
              dayOfWeek: "asc",
            },
          },
        },
      });
    }

    return {
      success: true,
      data: {
        ...dealership,
        createdAt: dealership.createdAt.toISOString(),
        updatedAt: dealership.updatedAt.toISOString(),
        workingHours: dealership.workingHours.map((hour) => ({
          ...hour,
          createdAt: hour.createdAt.toISOString(),
          updatedAt: hour.updatedAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    throw new Error("Error fetching dealership info:" + error.message);
  }
}

export async function saveWorkingHours(workingHours) {
  try {
    const { userId } = await auth();
    if (!userId) return ErrorMessage("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") return ErrorMessage("Not Authorized");

    const dealership = await db.dealershipInfo.findFirst();
    if (!dealership) return ErrorMessage("DealerShip data not found!");

    // Delete existing hours
    await db.workingHour.deleteMany({
      where: { dealershipId: dealership.id },
    });
    // Bulk create new hours
    for (let hour of workingHours) {
      await db.workingHour.create({
        data: {
          dayOfWeek: hour.dayOfWeek,
          isOpen: hour.isOpen,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          dealershipId: dealership.id,
        },
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    throw new Error("Error saving working hours: " + error.message);
  }
}

export async function getUsers() {
  try {
    const { userId } = await auth();
    if (!userId) return ErrorMessage("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user || user.role !== "ADMIN") return ErrorMessage("Not Authorized!");

    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    throw new Error("Error fetching users:" + error.message);
  }
}

export async function updateUserRole(userId, role) {
  try {
    const { userId: adminId } = await auth();
    if (!adminId) return ErrorMessage("Unauthorized");

    const adminUser = await db.user.findUnique({
      where: { clerkUserId: adminId },
    });

    if (!adminUser || adminUser.role !== "ADMIN")
      return ErrorMessage("Not Authorized!");

    // Update user role
    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    // Revalidate path
    revalidatePath("/admin/settings");
    return {
      success: true,
    };
  } catch (error) {
    throw new Error("Error updating user role:" + error.message);
  }
}
