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
  Car,
  CarIcon,
  Eye,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  StarOff,
  Trash2,
  View,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

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
    fn: deleteCarFn,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API call for searching

    await fetchCars(search);
  };

  const handleToogleStatus = async (car, newStatus) => {
    await updateCarStatusFn(car.id, { status: newStatus });
    await fetchCars(search);
  };

  const handleToogleFeatured = async (car) => {
    await updateCarStatusFn(car.id, { featured: !car.featured });
    await fetchCars(search);
  };

  const handleDeleteCar = async () => {
    if (!carToDelete) return;

    await deleteCarFn(carToDelete.id);
    await fetchCars(search);
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  // useEffect(() => {
  //   carsData?.data?.forEach((car) => {
  //     router.prefetch(`/cars/${car.id}`);
  //   });
  // }, [carsData]);

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

  const statusOptions = [
    { label: "Set Available", value: "AVAILABLE" },
    { label: "Set Unavailable", value: "UNAVAILABLE" },
    { label: "Mark as Sold", value: "SOLD" },
  ];

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
                      <TableHead className="w-12" aria-hidden></TableHead>

                      {/* wider Make & Model column */}
                      <TableHead className="min-w-[220px]">
                        Make & Model
                      </TableHead>

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
                        <TableCell className="font-medium">
                          {car.make} {car.model}
                        </TableCell>
                        <TableCell>{car.year}</TableCell>
                        <TableCell className="text-slate-700 font-semibold">
                          {car.price}
                        </TableCell>
                        <TableCell>{getStatusBadge(car.status)}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-9 w-9"
                            disabled={updatingCar}
                            onClick={() => handleToogleFeatured(car)}
                          >
                            {car.featured ? (
                              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                            ) : (
                              <StarOff className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0 h-8 w-8"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => router.push(`/cars/${car.id}`)}
                              >
                                <Eye className="w-4 h-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>Status</DropdownMenuLabel>
                              {statusOptions.map((item, index) => (
                                <DropdownMenuItem
                                  key={item.value}
                                  disabled={
                                    car?.status === item.value || updatingCar
                                  }
                                  onClick={() =>
                                    handleToogleStatus(car, item.value)
                                  }
                                >
                                  {item.label}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setCarToDelete(car);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-gray-300 opacity-30 rounded-full scale-125 animate-pulse" />
                <div className="relative flex flex-col items-center justify-center">
                  <CarIcon className="w-16 h-16 text-gray-400 drop-shadow-md transform transition-transform hover:scale-110 hover:rotate-3" />
                </div>
              </div>

              <h3 className="mt-6 text-xl font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-black bg-clip-text text-transparent">
                No Cars Found!
              </h3>

              <p className="text-gray-500 max-w-sm">
                There are no cars available in the system yet.
              </p>

              <Button
                asChild
                className="mt-6 px-6 py-2 rounded-xl shadow-lg shadow-black/40 hover:shadow-black/60 transition-all transform hover:-translate-y-1 hover:scale-105"
              >
                <Link href="/admin/cars/create">🚗 Add Your First Car</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} isOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingCar}
            >
              <X className="w-4 h-4" /> Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCar}
              disabled={deletingCar}
            >
              {deletingCar ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="m-4 h-4 " />
                  Delete Car
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarList;
