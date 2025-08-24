"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const CarList = () => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={() => router.push(`/admin/cars/create`)}>
          <Plus className="h-4 w-4 mr-2" /> Add Car
        </Button>

        <form >
            <div className="relative flex  flex-1 gap-4 items-center">
                <Search className="absolute left-2.5 text-gray-500 w-4 h-4 " />
                <Input type="search" placeholder="Search cars" className="pl-9 w-full sm:w-60" />
                </div>
        </form>
      </div>
    </div>
  );
};

export default CarList;
