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
import React, { useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useDropzone } from "react-dropzone";
import { Cross, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

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
  const [uploadImages, setUploadImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [imagePreview, setimagePreview] = useState(null);

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
          setUploadImages((prev) => [...prev, ...newImages]);
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

  const removeImage = (index) => {
    setUploadImages((prev) => prev.filter((_, i) => i !== index));
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
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Make</Label>
                    <Input placeholder="e.g., Toyota" />
                  </div>
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Input placeholder="e.g., Camry" />
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Input placeholder="e.g., 2022" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input placeholder="e.g., 25000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Mileage</Label>
                    <Input placeholder="e.g., 15000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input placeholder="e.g., Blue" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Fuel Type</Label>
                    <Select>
                      <SelectTrigger>
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
                  </div>
                  <div className="space-y-2">
                    <Label>Transmission</Label>
                    <Select>
                      <SelectTrigger>
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
                  </div>
                  <div className="space-y-2">
                    <Label>Body Type</Label>
                    <Select>
                      <SelectTrigger>
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
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Number of Seats{" "}
                      <span className="text-sm text-gray-500">(Optional)</span>"
                    </Label>
                    <Input placeholder="e.g. 5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select>
                      <SelectTrigger>
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
                  </div>
                </div>
                <div className="space-y-2">
                  <Label> Description</Label>
                  <Textarea className={"min-h-32"} />
                </div>
                <div className="space-y-2 flex gap-4 items-start rounded-md border p-4">
                  <Checkbox />
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

                  {uploadImages.length > 0 && (
                    <div>
                      <h3>Uploaded Images ({uploadImages.length})</h3>
                      <div className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {uploadImages.map((image, index) => {
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
                <Button className={"w-full md:w-auto"}>Add Car</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default AddCarForm;
