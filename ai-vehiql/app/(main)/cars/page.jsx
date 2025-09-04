import { getCarFilters } from "@/actions/car-listing";
import React from "react";
import CarFilters from "./_components/car-filter";

export const metadata = {
  title: "Cars || Vehiql",
  description: "Browse and search for your dream car",
};

const CarsPage = async () => {
  const filterData = await getCarFilters();
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-6xl mb-4 gradient-title">Browser Cars</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 flex-shrink-0">
          {/* Filters */}
          <CarFilters filters={filterData.data} />
        </div>
        <div className="flex-1">
          {/* CarListings */}
          Car Listings
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
