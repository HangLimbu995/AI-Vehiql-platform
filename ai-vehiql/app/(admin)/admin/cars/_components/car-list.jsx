"use client";

import { deleteCar, getCars, updateCarStatus } from "@/actions/cars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetch from "@/helpers/use-fetch";
import Image from "next/image";
import {
  CarIcon,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  StarOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const CarList = () => {
  const [search, setSearch] = useState("");
  const [carToDelete, setCarToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const router = useRouter();

  const {
    loading: loadingCars,
    fn: fetchCars,
    data: carsData,
    error: carsError,
  } = useFetch(getCars);

  useEffect(() => {
    fetchCars(search);
  }, [search]);

  const {
    loading: deletingCar,
    fn: carDeleteFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteCar);

  const {
  loading: updatingCar,
    fn: updateCarStatusFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateCarStatus);

  useEffect(() => {
    if (carsError) toast.error("Failed to load cars");
    if (deleteError) toast.error("Failed to delete car");
    if (updateError) toast.error("Failed to update car");
  }, [carsError, updateError, deleteError]);

  console.log("cars data", carsData?.data);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API call for searching

    await fetchCars(search);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Available
          </Badge>
        );
      case "UNAVAILABLE":
        return (
          <Badge className="bg-green-100 text-red-800 hover:bg-green-100">
            Unavailable
          </Badge>
        );
      case "SOLD":
        return (
          <Badge className="bg-green-100 text-blue-800 hover:bg-green-100">
            Sold
          </Badge>
        );

      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={() => router.push(`/admin/cars/create`)}>
          <Plus className="h-4 w-4 mr-2" /> Add Car
        </Button>

        <form onSubmit={handleSubmit}>
          <div className="relative flex  flex-1 gap-4 items-center">
            <Search className="absolute left-2.5 text-gray-500 w-4 h-4 " />
            <Input
              type="search"
              placeholder="Search cars"
              className="pl-9 w-full sm:w-60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Cars Table */}
      <Card>
        <CardContent>
           {loadingCars && !carsData ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : carsData?.success && carsData.data.length > 0 ? (
            <>
              {/* Desktop/Table view for md+ */}
              <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-100">
                <Table>
                  <TableHeader className="bg-white">
                    <TableRow className="sticky top-0 bg-white">
                      {/* image column header (small) */}
                      <TableHead className="w-12" aria-hidden>
                        
                      </TableHead>

                      {/* wider Make & Model column */}
                      <TableHead className="min-w-[220px]">Make & Model</TableHead>

                      <TableHead className="w-20">Year</TableHead>
                      <TableHead className="w-28">Price</TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      <TableHead className="w-24">Featured</TableHead>
                      <TableHead className="text-right w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carsData?.data?.map((car, idx) => (
                      <TableRow
                        key={car.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <TableCell className="w-10">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden">
                            {car.images && car.images.length > 0 ? (
                              <Image
                                src={car.images[0]}
                                alt={`${car.make} ${car.model}`}
                                fill
                                className="object-cover"
                                priority
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <CarIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{car.make} {car.model}</TableCell>
                        <TableCell>{car.year}</TableCell>
                        <TableCell className="text-slate-700 font-semibold">{car.price}</TableCell>
                        <TableCell>{getStatusBadge(car.status)}</TableCell>
                        <TableCell className="text-center">
                          {car.featured ? (
                            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="h-4 w-4 text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <MoreHorizontal className="w-4 h-4" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile/compact card list */}
              <div className="md:hidden space-y-3">
                {carsData?.data?.map((car) => (
                  <div key={car.id} className="bg-white border border-slate-100 rounded-lg p-3 shadow-sm flex items-start gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      {car.images && car.images.length > 0 ? (
                        <Image src={car.images[0]} alt={`${car.make} ${car.model}`} fill className="object-cover" priority />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <CarIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-semibold truncate">{car.make} {car.model}</div>
                        <div className="text-sm text-slate-500">{car.year}</div>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-slate-700">{car.price}</div>
                        <div className="flex items-center gap-2">
                          <div>{getStatusBadge(car.status)}</div>
                          <div>{car.featured ? <Star className="h-4 w-4 text-amber-500" /> : <StarOff className="h-4 w-4 text-gray-400" />}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
            
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CarList;
