"use server";

import { serializeCarData } from "@/lib/helper";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

    const bodyTypes = await db.car.findMany({
      where,
      select: { bodyType: true },
      distinct: ["bodyType"],
      orderBy: { bodyType: "asc" },
    });

    const fuelTypes = await db.car.findMany({
      where,
      select: { fuelType: true },
      distinct: ["fuelType"],
      orderBy: { fuelType: "asc" },
    });

    const transmission = await db.car.findMany({
      where,
      select: { transmission: true },
      distinct: ["transmission"],
      orderBy: { transmission: "asc" },
    });

    const priceAggregations = await db.car.aggregate({
      where,
      _min: { price: true },
      _max: { price: true },
    });

    return {
      success: true,
      data: {
        makes: makes.map((item) => item.make),
        bodyTypes: bodyTypes.map((item) => item.bodyType),
        fuelTypes: fuelTypes.map((item) => item.fuelType),
        transmission: transmission.map((item) => item.transmission),
        priceRange: {
          min: priceAggregations._min.price
            ? parseFloat(priceAggregations._min.price.toString())
            : 0,
          max: priceAggregations._max.price
            ? parseFloat(priceAggregations._max.price.toString())
            : 100000,
        },
      },
    };
  } catch (error) {
    throw new Error("Error fetching car filters:" + error.message);
  }
}

export async function getCars({
  search = "",
  make = "",
  bodyType = "",
  fuelType = "",
  transmission = "",
  minPrice = "",
  maxPrice = Number.MAX_SAFE_INTEGER,
  sortBy = "newest",
  page = 1,
  limit = 6,
}) {
  try {
    // Get currect user if authenticated
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    // Build where conditions
    let where = {
      status: "AVAILABLE",
    };

    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }

    if (make) where.make = { equals: make, mode: "insensitive" };
    if (bodyType) where.bodyType = { equals: bodyType, mode: "insensitive" };
    if (fuelType) where.fuelType = { equals: fuelType, model: "insensitive" };
    if (transmission)
      where.transmission = { equals: transmission, model: "insensitive" };

    // Add price range
    const parsedMinPrice = parseFloat(minPrice) || 0;
    const parsedMaxPrice = parseFloat(maxPrice);

    where.price = {
      gte: parsedMinPrice,
    };

    if (!isNaN(parsedMaxPrice) && parsedMaxPrice < Number.MAX_SAFE_INTEGER) {
      price.price.lte = parsedMaxPrice;
    }

    const skip = (page - 1) * limit;

    // Getermine sort order
    let orderBy = {};
    switch (sortBy) {
      case "priceAsc":
        orderBy = { price: "asc" };
        break;
      case "priceDesc":
        orderBy = { price: "desc" };
        break;
      case "newest":
        orderBy = { price: "desc" };
        break;
    }

    const totalCars = await db.car.findMany({ where });

    // Execute the main query
    const cars = await db.car.findMany({
      where,
      take: limit,
      skip,
      orderBy,
    });

    // If we have a user, check which cars are wishlisted
    let wishlisted = new Set();
    if (dbUser) {
      const savedCars = await db.userSavedCar.findMany({
        where: { userId: dbUser.id },
        selete: { carId: true },
      });

      wishlisted = new Set(savedCars.map((saved) => saved.carId));
    }

    //   Serialize and check wishlist status
    const serializeCarData = cars.map((car) =>
      serializeCarData(car, wishlisted.has(car.id))
    );

    return {
      success: true,
      data: serializeCarData,
      pagiantion: {
        total: totalCars,
        page,
        limit,
        pages: Math.ceil(totalCars / limit),
      },
    };
  } catch (error) {
    throw new Error("Error fetching cars:" + error.message);
  }
}

export async function toggleSavedCar(carId) {
  try {
    const { userId } = await auth();
    if (!userId)
      throw new Error("User needs to be logged in to save or unsave car");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found!");

    // Check if car exists
    const car = await db.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return {
        success: false,
        errror: "Car not found",
      };
    }

    // Check if car is already saved
    const existingSave = await db.userSavedCar.findUnique({
      where: {
        userId_carId: {
          userId: user.id,
          carId,
        },
      },
    });

    // If car is already saved, remove it
    if (existingSave) {
      await db.userSavedCar.delete({
        where: {
          userId_carId: {
            userId: user.id,
            carId,
          },
        },
      });
    }

    await db.userSavedCar.create({
      data: {
        userId: user.id,
        carId,
      },
    });

    revalidatePath("/saved-cars");
    return {
      success: true,
      saved: true,
      message: "Car added to favorites",
    };
  } catch (error) {
    throw new Error("Error toggling saved car:" + error.message);
  }
}

export async function getSavedCars() {
  try {
    const { userId } = await auth();
    if (!user)
      return {
        success: false,
        error: "Login to get Saved cars",
      };

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user)
      return {
        success: false,
        error: "User Not Found!",
      };

    const savedCars = await db.userSavedCar.findMany({
      where: { userId: user.id },
      include: {
        car: true,
      },
      orderBy: { savedAt: "desc" },
    });

    const cars = savedCars.map((saved) => serializeCarData(saved.car));

    return {
      success: true,
      data: cars,
    };
  } catch (error) {
    console.error("Error fetching saved cars", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getCarById(carId) {
  try {
    const { userId } = await auth();
    let dbUser = null;

    if (userId) {
      dbUser = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    }

    const car = await db.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return {
        success: false,
        error: "Car Not Found!",
      };
    }

    let isWishListed = false;
    if (dbUser) {
      const savedCar = await db.userSavedCar.findUnique({
        where: {
          userId_carId: {
            userId: user.id,
            carId,
          },
        },
      });
      isWishListed = !!savedCar;
    }

    const exisitngTestDrive = dbUser
      ? await db.testDriveBooking.findFirst({
          where: {
            carId,
            userId: user.id,
            status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
          },
          orderBy: { createdAt: "desc" },
        })
      : null;

    let userTestDrive = null;
    if (exisitngTestDrive) {
      userTestDrive = {
        id: exisitngTestDrive.id,
        status: exisitngTestDrive.status,
        bookingDate: exisitngTestDrive.bookingDate.toString(),
      };
    }

    const dealership = await db.dealershipInfo.findFirst({
      where: {
        include: {
          workingHours: true,
        },
      },
    });

    return {
      success: true,
      data: {
        ...serializeCarData(car, isWishListed),
        testDriveInfo: {
          userTestDrive,
          dealership: dealership
            ? {
                ...dealership,
                createdAt: dealership.createdAt.toISOString(),
                updatedAt: dealership.updatedAt.toISOString(),
                workingHours: dealership.workingHours.map((hour) => ({
                  ...hour,
                  createdAt: hour.createdAt.toISOString(),
                  updatedAt: hour.updatedAt.toISOString(),
                })),
              }
            : null,
        },
      },
    };
  } catch (error) {
    throw new Error("Error fetching car details:" + error.message);
  }
}
