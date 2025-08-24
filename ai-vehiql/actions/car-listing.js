"use server";
import { bodyTypes } from "@/lib/data";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuid4 } from "uuid";

function ErrorMessage(message) {
  return {
    success: true,
    error: message,
  };
}

export async function addCar({ carData, images }) {
  try {
    const { userId } = await auth();

    if (!userId) return ErrorMessage("Not Authorized!");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) return ErrorMessage("User Not Found!");

    if (user.role !== "ADMIN") return ErrorMessage("Not Authorized!");

    const carId = uuid4();
    const folderPath = `cars/${carId}`;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const uploadPromises = images.map(async (base64Data, i) => {
      if (!base64Data?.startsWith("data:image/")) return null;

      const base64 = base64Data.split(",")[1];
      const imageBuffer = Buffer.from(base64, "base64");

      const mimeMatch = base64Data.match(/data:image\/([a-zA-Z0-9]+);/);
      const fileExtension = mimeMatch ? mimeMatch[1] : "jpeg";

      const fileName = `image-${Date.now()}-${i}.${fileExtension}`;
      const filePath = `${folderPath}/${fileName}`;

      const { error } = await supabase.storage
        .from("car-images")
        .upload(filePath, imageBuffer, {
          contentType: `image/${fileExtension}`,
        });

      if (error) throw new Error(`Upload failed: ${error.message}`);

      return supabase.storage.from("car-images").getPublicUrl(filePath).data
        .publicUrl;
    });

    const car = await db.car.create({
      data: {
        id: carId,
        make: carData.make,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        mileage: carData.mileage,
        color: carData.color,
        fuelType: carData.fuelType,
        transmission: carData.transmission,
        bodyType: carData.bodyType,
        seats: carData.seats,
        description: carData.description,
        status: carData.status,
        featured: carData.featured,
        images: imageUrls, // Store the array of images URLs
      },
    });

    revalidatePath("/admin/cars");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Add Car error", error);
    throw new Error("Errror addming car:" + error.message);
  }
}
