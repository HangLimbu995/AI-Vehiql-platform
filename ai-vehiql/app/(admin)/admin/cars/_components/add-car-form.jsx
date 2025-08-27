"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import React, { useCallback, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useDropzone } from "react-dropzone";
import { Camera, Cross, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useFetch from "@/helpers/use-fetch";
import { addCar, processCarImageWithAI } from "@/actions/cars";

const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"];
const transmissions = ["Automatic", "Manual", "Semi-Automatic"];
const bodyTypes = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Convertible",
  "Coupe",
  "Wagon",
  "Pickup",
];

const carStatuses = ["AVAILABLE", "UNAVAILABLE", "SOLD"];

const AddCarForm = () => {
  const [activeTab, setActiveTab] = useState("ai");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [imagePreview, setimagePreview] = useState(null);
  const [uploadedAiImage, setUplaodedAiImage] = useState(null);

  const router = useRouter();

  const carFormSchedma = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().min(1, "Year is required"),
    price: z.string().min(1, "Price is required"),
    mileage: z.string().min(1, "Mileage is required"),
    color: z.string().min(1, "Color is required"),
    fuelType: z.string().min(1, "Fuel type is required"),
    transmission: z.string().min(1, "Transmission is required"),
    bodyType: z.string().min(1, "Body type is required"),
    seats: z.string().optional(),
    description: z
      .string()
      .min(10, "Description should be at least 10 characters long"),
    status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"], "Status is required"),
    featured: z.boolean().default(false),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(carFormSchedma),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      color: "",
      fuelType: "",
      transmission: "",
      bodyType: "",
      seats: "",
      description: "",
      status: "AVAILABLE",
      featured: false,
    },
  });

  const onAiDrop = async (acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0];

    if (file && file.size > 2 * 1024 * 1024) {
      toast.error(`${file.name} exceeds 2MB limit.`);
      return;
    }

    setUplaodedAiImage(file);

    const reader = new FileReader();

    reader.onloadend = (e) => {
      setimagePreview(e.target.result);
      toast.success(`Successfully uploaded ${file.name}`);
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps: getAiRootProps, getInputProps: getAiInputProps } =
    useDropzone({
      onDrop: onAiDrop,
      accept: {
        "image/*": [".jpeg", ".png", ".jpg", ".webp"],
      },
      multiple: false,
      maxFiles: 1,
    });

  const {
    loading: aiLoading,
    data: aiResult,
    fn: aiImageFn,
    error: aiError,
  } = useFetch(processCarImageWithAI);

  useEffect(() => {
    if (aiError) {
      toast.error("Error extracting car details from image. Please try again.");
    }
  }, [aiError]);
  useEffect(() => {
    if (aiResult?.success) {
      const carDetails = aiResult?.data;

      // Update form with AI result
      setValue("make", carDetails.make);
      setValue("model", carDetails.model);
      setValue("year", carDetails.year);
      setValue("price", carDetails.price);
      setValue("mileage", carDetails.mileage);
      setValue("color", carDetails.color);
      setValue("bodyType", carDetails.bodyType);
      setValue("fuelType", carDetails.fuelType);
      setValue("transmission", carDetails.transmission);
      setValue("description", carDetails.description);
      setValue("seats", carDetails.seats);

      const reader = new FileReader();

      reader.onload = (e) => {
        setUploadedImages((prev) => [...prev, e.target.result]);
      };

      if (uploadedAiImage) {
        reader.readAsDataURL(uploadedAiImage);
      }

      toast.success(
        "Successfully extracted car details from image. Please review and submit."
      );
    }
  }, [aiResult]);


  const extractDetails = async () => {
    if (!uploadedAiImage) {
      toast.error("Please upload an image first");
      return;
    }

    await aiImageFn(uploadedAiImage);
  };

  const onMultiImagesDrop = (acceptedFiles) => {
    // Do something with the files
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB  limit and will be skipped`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newImages = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = (e) => {
        newImages.push(e.target.result);

        if (newImages.length === validFiles.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
          setImageError("");
          toast.success(`Successfully uploaded ${validFiles.length} images`);
        }
      };

      reader.readAsDataURL(file);
    });
  };
  const {
    getRootProps: getMultiImageRootProps,
    getInputProps: getMultiImageInputProps,
  } = useDropzone({
    onDrop: onMultiImagesDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".webp"],
    },
    multiple: true,
  });


  const {
    loading: addCarLoading,
    data: addCarResult,
    fn: addCarFn,
  } = useFetch(addCar);

  useEffect(() => {
    if (addCarResult?.success) {
      toast.success("Car Added Successfully");
      router.push("/admin/cars");
    }
  }, [addCarResult]);

  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      setImageError("Please upload at least one Image");

      return;
    }

    const carData = {
      ...data,
      year: parseInt(data.year),
      price: parseInt(data.price),
      mileage: parseInt(data.mileage),
      seats: data.seats ? parseInt(data.seats) : null,
    };

    await addCarFn({ carData, images: uploadedImages });
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Tabs defaultValue="ai" className="mt-6">
        <TabsList className="w-full  ">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="ai">AI Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Car Details</CardTitle>
              <CardDescription>
                Enter the details of the car you want to add.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Make</Label>
                    <Input
                      placeholder="e.g., Toyota"
                      {...register("make")}
                      className={errors.make && "border-red-500"}
                    />
                    {errors.make && (
                      <p className="text-red-500 text-sm">
                        {errors.make.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input
                      placeholder="e.g., Camry"
                      {...register("model")}
                      className={errors.model && "border-red-500"}
                    />
                    {errors.model && (
                      <p className="text-red-500 text-sm">
                        {errors.model.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input
                      placeholder="e.g., 2022"
                      {...register("year")}
                      className={errors.year && "border-red-500"}
                    />
                    {errors.year && (
                      <p className="text-red-500 text-sm">
                        {errors.year.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      placeholder="e.g., 25000"
                      {...register("price")}
                      className={errors.price && "border-red-500"}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Mileage</Label>
                    <Input
                      placeholder="e.g., 15000"
                      {...register("mileage")}
                      className={errors.mileage && "border-red-500"}
                    />
                    {errors.mileage && (
                      <p className="text-red-500 text-sm">
                        {errors.mileage.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input
                      placeholder="e.g., Blue"
                      {...register("color")}
                      className={errors.color && "border-red-500"}
                    />
                    {errors.color && (
                      <p className="text-red-500 text-sm">
                        {errors.color.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Fuel Type</Label>
                    <Select
                      onValueChange={(value) => setValue("fuelType", value)}
                      defaultValue={getValues("fuelType")}
                    >
                      <SelectTrigger
                        className={errors.fuelType && "border-red-500"}
                      >
                        <SelectValue placeholder="Select Fuel Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fuelType && (
                      <p className="text-xs text-red-500">
                        {errors.fuelType.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Transmission</Label>
                    <Select
                      defaultValue={getValues("transmission")}
                      onValueChange={(value) => setValue("transmission", value)}
                    >
                      <SelectTrigger
                        className={errors.transmission && "border-red-500"}
                      >
                        <SelectValue placeholder="Select Transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissions.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.transmission && (
                      <p className="text-xs text-red-500">
                        {errors.transmission.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Body Type</Label>
                    <Select
                      defaultValue={getValues("bodyType")}
                      onValueChange={(value) => setValue("bodyType", value)}
                    >
                      <SelectTrigger
                        className={errors.bodyType && "border-red-500"}
                      >
                        <SelectValue placeholder="Select Body Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bodyType && (
                      <p className="text-xs text-red-500">
                        {errors.bodyType.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Number of Seats{" "}
                      <span className="text-sm text-gray-500">(Optional)</span>"
                    </Label>
                    <Input
                      placeholder="e.g. 5"
                      {...register("seats")}
                      className={errors.seats && "border-red-500"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      defaultValue={getValues("status")}
                      onValueChange={(value) => setValue("status", value)}
                    >
                      <SelectTrigger
                        className={errors.status && "border-red-500"}
                      >
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {carStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-xs text-red-500">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description"> Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the car, including its features, condition, and any other relevant information that would help potential buyers make an informed decision."
                    {...register("description")}
                    className={`min-h-32 w-full ${
                      errors.description && "red-bg-500"
                    } `}
                  />
                </div>
                <div className="space-y-2 flex gap-4 items-start rounded-md border p-4">
                  <Checkbox
                    checked={watch("featured")}
                    onCheckedChange={(checked) => {
                      setValue("featured", checked);
                    }}
                  />
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="featured">Feature this Car</Label>
                    <p className="text-sm text-gray-500">
                      Featured cars appear on the homepage.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="images">Images</Label>
                  <div
                    {...getMultiImageRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 mt-2 transition`}
                  >
                    <input {...getMultiImageInputProps()} />
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-600 text-sm">
                        Drag & Drop a car image or click to select
                      </p>
                      <p className="text-gray-500 text-xs mt-2">
                        (Supports: JPG, PNG, WebP, max 5MB each)
                      </p>
                    </div>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div>
                      <h3>Uploaded Images ({uploadedImages.length})</h3>
                      <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {uploadedImages.map((image, index) => {
                          return (
                            <div key={index} className="group relative">
                              <Image
                                src={image}
                                alt={`Car image ${index + 1}`}
                                height={50}
                                width={50}
                                className="h-40 md:h-28 w-full object-cover rounded-md"
                                priority
                              />
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition"
                                onClick={() => removeImage(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className={"w-full md:w-auto"}
                  disabled={addCarLoading}
                >
                  {addCarLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Car...
                    </>
                  ) : (
                    "Add Car"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Car Details Extraction</CardTitle>
              <CardDescription>
                Uplaod an image of a car and let AI extract its details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-6 text-center ">
                  {imagePreview ? (
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Car Preview"
                        className="max-h-56 object-contain mb-4"
                      />
                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setimagePreview(null);
                            setUplaodedAiImage(null);
                          }}
                        >
                          Remove
                        </Button>
                        <Button onClick={extractDetails} disabled={aiLoading}>
                          {aiLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Camera className="mr-2 h-4 w-4" /> Extract Car
                              Details
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div {...getAiRootProps()}>
                        <input {...getAiInputProps()} />
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Camera className="h-12 w-12 text-gray-400 mb-2 mx-auto" />
                          <p className="text-sm text-slate-600">
                            Drag & drop a car image or click to select
                          </p>
                          <p className="text-xs text-slate-500">
                            Supports: JPG, PNG, WebP (max 5MB)
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">How it works</h3>
                  <ol className="space-y-1 text-sm text-gray-600 list-decimal pl-4">
                    <li>Upload a clear image of the car</li>
                    <li>Click "Extract Details" to analyze with Gemini AI</li>
                    <li>Review the extracted information</li>
                    <li>Fill in any missing details manually</li>
                    <li>Add the car to your inventory</li>
                  </ol>
                </div>
                <div className="bg-amber-50 p-4 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-2">
                    Tips for best results
                  </h3>
                  <ol className="space-y-1 text-sm text-amber-700 pl-4">
                    <li>• Use clear, well-lit images</li>
                    <li>• Try to capture the entire vehicle</li>
                    <li>• For difficult models, use multiple views</li>
                    <li>• Always verify AI-extracted information</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddCarForm;
