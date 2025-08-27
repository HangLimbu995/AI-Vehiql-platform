"use server";
import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuid4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";

function ErrorMessage(message) {
  return {
    success: true,
    error: message,
  };
}

async function fileToBase64(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
}

export async function processCarImageWithAI(file) {
  try {
    const { userId } = await auth();
    if (!userId) return ErrorMessage("Not Authorized!");
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (user.role !== "ADMIN") return ErrorMessage("Not Authorized!");

    if (!process.env.GEMINI_API_KEY)
      return ErrorMessage("AI Service Not Configured!");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Image = await fileToBase64(file);

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type,
      },
    };

    const prompt = `
    Analyze this car image and extract the following information and don't miss anything if possible:
    1. Make (manufacturer)
    2. Model
    3. Year
    4. Color
    5. Body Type (e.g., SUV, sedan, Hatchback, convertible, coupe, wagon, pickup etc.)
    6. Mileage (give your best guess)
    7. Fuel Type (your best guess) (options are (petrol, deisel, electric, hybrid, plug-in hubrid))
    8. Transmission type (your best guess)
    9. Price (Your best guess just number without any sign but in string)
    10. Short Description as to be added to a car listing
    10. Number of seats

    Format your response as a clean JSON object with these fields:
    {
    "make":"",
    "model":"",
    "year":"0000",
    "color":"",
    "price":"",
    "mileage":"",
    "bodyType":"",
    fuelType":"",
    "transmission":"",
    "description":"",
    "seats":"",
    "confidence":0.0,
    }
For confidence, provide a value between 0 and 1 representing how confident you are in your overall identification. 
Only respond with the JOSN object, nothing else.
    `;

    // Get response from Gemini
    const result = await model.generateContent([imagePart, prompt]);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    // Parse the JSON response
    try {
      const carDetails = JSON.parse(cleanedText);

      // Validate the response format
      const requiredFields = [
        "make",
        "model",
        "year",
        "color",
        "bodyType",
        "price",
        "mileage",
        "fuelType",
        "transmission",
        "description",
        "confidence",
      ];

      const missingFields = requiredFields.filter(
        (field) => !(field in requiredFields)
      );

      if (missingFields.length === 0) {
        throw new Error(
          `AI response required fileds: ${missingFields.join(", ")}`
        );
      }

      // Return success response with data
      return {
        success: true,
        data: carDetails,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return {
        success: false,
        error: "Failed to parse AI response",
      };
    }
  } catch (error) {
    console.error("processCarImageWithAI error", error);
    return {
      success: false,
      error: "Error processing image with AI: " + error.message,
    };
  }
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

      return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/car-images/${filePath}`;
    });

    const imageUrls = (await Promise.all(uploadPromises)).filter(Boolean);

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
    throw new Error("Error adding car:" + error.message);
  }
}
