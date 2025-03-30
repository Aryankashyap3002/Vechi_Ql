"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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

    const [activeTab, setActiveTab] = useState("manual");
    const [uploadedImages, setUploadedImages] = useState([]);
    const [imageError, setImageError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

   const carFormSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().refine((val) => {
        const year = parseInt(val);
        return (
        !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1
        );
    }, "Valid year required"),
    price: z.string().min(1, "Price is required"),
    mileage: z.string().min(1, "Mileage is required"),
    color: z.string().min(1, "Color is required"),
    fuelType: z.string().min(1, "Fuel type is required"),
    transmission: z.string().min(1, "Transmission is required"),
    bodyType: z.string().min(1, "Body type is required"),
    seats: z.string().optional(),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
    status: z.enum(["AVAILABLE", "UNAVAILABLE", "SOLD"]),
    featured: z.boolean().default(false),
  });

  const {
    register, 
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(carFormSchema),
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

   const onSubmit = async (data) => {
        if(uploadedImages.length === 0) {
            setImageError("Please upload at least one image");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Prepare data for submission
            const carData = {
                ...data,
                images: uploadedImages
            };
            
            // Here you would typically send data to your API
            console.log("Submitting car data:", carData);
            
            // Simulate successful submission
            toast.success("Car added successfully!");
            
            // Reset form
            reset();
            setUploadedImages([]);
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to add car. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
   };

   // Handle image upload with react-dropzone
   const onMultiImagesDrop = (acceptedFiles) => {
    const validFiles = acceptedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit and will be skipped`);
        return false;
      }
      return true;
    });
  
    if (validFiles.length === 0) return;
  
    const newImages = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newImages.push(e.target.result);
  
        if (newImages.length === validFiles.length) {
          setUploadedImages((prev) => [...prev, ...newImages]);
          setImageError("");
          toast.success(`Uploaded ${validFiles.length} images successfully`);
        }
      };
  
      reader.readAsDataURL(file);
    });
  };
  
  const { getRootProps: getMultiImageRootProps, getInputProps: getMultiImageInputProps } =
    useDropzone({
      onDrop: onMultiImagesDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".webp"],
      },
      multiple: true,
    });
    
  const removeImage = (indexToRemove) => {
    setUploadedImages((prev) => 
      prev.filter((_, index) => index !== indexToRemove)
    );
    
    if (uploadedImages.length - 1 === 0) {
      setImageError("Please upload at least one image");
    }
  };
   
  // AI image processing (placeholder for the AI tab implementation)
  const processImageWithAI = async (image) => {
    // This would contain your actual AI processing logic
    toast.info("AI processing feature is coming soon");
  };
 
  return (
    <div>
        <Tabs 
            defaultValue="manual" 
            className="mt-6" 
            value={activeTab} 
            onValueChange={setActiveTab}
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="ai">AI Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Car Details</CardTitle>
                    <CardDescription>
                        Enter the details of the car you want to add.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form 
                        onSubmit={handleSubmit(onSubmit)}
                        className='space-y-6'
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className='space-y-2'>
                                <Label htmlFor="make">Make</Label>
                                <Input
                                    id="make"
                                    {...register("make")}
                                    placeholder="e.g. Toyota"
                                    className={errors.make ? "border-red-500" : ""}
                                />
                                {errors.make && (
                                    <p className="text-xs text-red-500">
                                        {errors.make.message}
                                    </p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="model">Model</Label>
                                <Input
                                    id="model"
                                    {...register("model")}
                                    placeholder="e.g. Camry"
                                    className={errors.model ? "border-red-500" : ""}
                                />
                                {errors.model && (
                                    <p className="text-xs text-red-500">
                                        {errors.model.message}
                                    </p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="year">Year</Label>
                                <Input
                                    id="year"
                                    {...register("year")}
                                    placeholder="e.g. 2022"
                                    className={errors.year ? "border-red-500" : ""}
                                />
                                {errors.year && (
                                    <p className="text-xs text-red-500">
                                        {errors.year.message}
                                    </p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    {...register("price")}
                                    placeholder="e.g. 25000"
                                    className={errors.price ? "border-red-500" : ""}
                                />
                                {errors.price && (
                                    <p className="text-xs text-red-500">
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="mileage">Mileage</Label>
                                <Input
                                    id="mileage"
                                    {...register("mileage")}
                                    placeholder="e.g. 15000"
                                    className={errors.mileage ? "border-red-500" : ""}
                                />
                                {errors.mileage && (
                                    <p className="text-xs text-red-500">
                                        {errors.mileage.message}
                                    </p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor="color">Color</Label>
                                <Input
                                    id="color"
                                    {...register("color")}
                                    placeholder="e.g. Red"
                                    className={errors.color ? "border-red-500" : ""}
                                />
                                {errors.color && (
                                    <p className="text-xs text-red-500">
                                        {errors.color.message}
                                    </p>
                                )}
                            </div>
            
                            <div className="space-y-2">
                                <Label htmlFor="fuelType">Fuel Type</Label>
                                <Select 
                                    onValueChange={(value) => setValue("fuelType", value)}
                                    value={watch("fuelType")}
                                >
                                    <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select fuel type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fuelTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
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
                                <Label htmlFor="transmission">Transmission</Label>
                                <Select
                                    onValueChange={(value) => setValue("transmission", value)}
                                    value={watch("transmission")}
                                >
                                    <SelectTrigger
                                        className={errors.transmission ? "border-red-500" : ""}
                                    >
                                        <SelectValue placeholder="Select transmission" />
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
                                <Label htmlFor="bodyType">Body Type</Label>
                                <Select
                                    onValueChange={(value) => setValue("bodyType", value)}
                                    value={watch("bodyType")}
                                >
                                    <SelectTrigger className={errors.bodyType ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select body type" />
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
                            <div className="space-y-2">
                                <Label htmlFor="seats">
                                    Number of Seats{" "}
                                    <span className="text-sm text-gray-500">(Optional)</span>
                                </Label>
                                <Input
                                    id="seats"
                                    {...register("seats")}
                                    placeholder="e.g. 5"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    onValueChange={(value) => setValue("status", value)}
                                    value={watch("status")}
                                >
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {carStatuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                        {status.charAt(0) + status.slice(1).toLowerCase()}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Enter detailed description of the car..."
                            className={`min-h-32 ${errors.description ? "border-red-500" : ""}`}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500">
                            {errors.description.message}
                            </p>
                        )}
                        </div>

                        <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                            <Checkbox
                                id="featured"
                                checked={watch("featured")}
                                onCheckedChange={(checked) => {
                                    setValue("featured", checked);
                                }}
                            />
                            <div className='space-y-1 leading-none'>
                                <Label htmlFor="featured">Feature this Car</Label>
                                <p className="text-sm text-gray-500">
                                    Featured cars appear on the homepage
                                </p>
                            </div>
                        </div>

                        <div>
                            <Label 
                                htmlFor="images"
                                className={imageError ? "text-red-500" : ""}
                            >
                                Images{" "}
                                {imageError && <span className='text-red-500'>*</span>}
                            </Label>

                            <div {...getMultiImageRootProps()} className={`border-2 border-dashed rounded-lg p-6 text-center 
                                    cursor-pointer hover:bg-gray-50 transition mt-2 ${imageError ? 
                                    "border-red-500" : "border-gray-300"
                                    }`}>
                                <input {...getMultiImageInputProps()} />
                                <div className='flex flex-col items-center justify-center'>
                                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                                    <p className="text-sm text-gray-600">
                                        Drag & drop or click to upload multiple images
                                    </p>
                                    
                                    <p className="text-gray-500 text-xs mt-1">
                                        (JPG, PNG, WebP, max 5MB each)
                                    </p>
                                </div>
                            </div>
                            {imageError && (
                                <p className='text-xs text-red-500 mt-1'>{imageError}</p>
                            )}
                        </div>

                        {uploadedImages.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium mb-2">Uploaded Images ({uploadedImages.length})</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {uploadedImages.map((image, index) => (
                                <div key={index} className="relative group">
                                    <div className="h-36 rounded-md overflow-hidden">
                                        <Image
                                        src={image}
                                        alt={`Car image ${index + 1}`}
                                        width={200}
                                        height={150}
                                        className='h-full w-full object-cover'
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                        >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            </div>
                        </div>
                        )}
                        
                        <Button 
                            type="submit" 
                            className="w-full md:w-auto mt-6"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add Car"}
                        </Button>
                         {/* <Button 
                            type="submit" 
                            className="w-full md:w-auto"
                            disabled={false}
                        >
                        {false ? ( 
                            <>
                             Adding Car...
                            </>
                        ) : (
                            "Add Car"
                        )}
                        </Button> */}
                    </form>
                </CardContent>
            </Card>

            </TabsContent>

            <TabsContent value="ai" className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>AI Upload Assistant</CardTitle>
                        <CardDescription>
                            Upload photos of your car and let our AI extract information automatically.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div {...getMultiImageRootProps()} className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition">
                            <input {...getMultiImageInputProps()} />
                            <div className="flex flex-col items-center justify-center">
                                <Upload className="h-16 w-16 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium">Upload car images</h3>
                                <p className="text-sm text-gray-600 mt-2">
                                    Our AI will extract make, model, and other details from your photos
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    (JPG, PNG, WebP, max 5MB each)
                                </p>
                            </div>
                        </div>
                        
                        {uploadedImages.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium mb-2">Uploaded Images ({uploadedImages.length})</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {uploadedImages.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <div className="h-36 rounded-md overflow-hidden">
                                                <Image
                                                    src={image}
                                                    alt={`Car image ${index + 1}`}
                                                    width={200}
                                                    height={150}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                
                                 <Button 
                                    onClick={() => processImageWithAI(uploadedImages)}
                                    className="mt-4 w-full"
                                >
                                    Process with AI
                                </Button> 
                               
                            </div>
                        )}
                        
                        <div className="rounded-md bg-blue-50 p-4">
                            <p className="text-sm text-blue-800">
                                This feature uses AI to analyze your car images and automatically fill in details like make, model, year, and more. Simply upload clear photos of your vehicle.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  )
}

export default AddCarForm