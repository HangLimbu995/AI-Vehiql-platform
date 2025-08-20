import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

const CarCard = ({ car }) => {
  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Car Image with Love Icon */}
      <div className="relative h-48 sm:h-52 overflow-hidden">
        <Image
          src={car.image}
          alt={`${car.make} ${car.model} ${car.year} ${car.bodyType} for sale`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={car.featured}
        />
        
        {/* Love Icon */}
        <button 
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all duration-200 hover:scale-110"
          aria-label={`Save ${car.make} ${car.model} to favorites`}
        >
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors duration-200" />
        </button>
      </div>

      {/* Car Details */}
      <div className="p-4 space-y-3">
        {/* Car Name */}
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {car.name}
        </h3>

        {/* Price */}
        <div className="text-xl font-bold text-blue-600">
          ${car.price.toLocaleString()}
        </div>

        {/* Key Specs */}
        <div className="flex items-center text-sm text-gray-600 space-x-2">
          <span>{car.year}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{car.transmission}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
          <span>{car.fuelType}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200">
            {car.bodyType}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200">
            {car.mileage === 0 ? 'New' : `${car.mileage.toLocaleString()} km`}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200">
            {car.color}
          </span>
        </div>

        {/* View Car Button */}
        <Link 
          href={`/car/${car.id}`}
          className="block w-full bg-gray-900 hover:bg-gray-800 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          aria-label={`View details for ${car.make} ${car.model}`}
        >
          View Car
        </Link>
      </div>
    </article>
  );
};

export default CarCard;
