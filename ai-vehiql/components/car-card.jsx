import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

const formatPrice = (value) =>
  typeof value === "number"
    ? value.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : value;

const CarCard = ({ car = {} }) => {
  const {
    id,
    make,
    model,
    year,
    bodyType,
    transmission,
    fuelType,
    mileage,
    color,
    price,
    image,
    featured = false,
    name,
  } = car;

  // Persist favorite in localStorage so browser remembers preference
  const storageKey = `fav:car:${id}`;
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setFavorited(stored === "1");
    } catch {
      /* ignore storage errors */
    }
  }, [storageKey]);

  const toggleFavorite = useCallback(() => {
    setFavorited((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(storageKey, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, [storageKey]);

  return (
    <article
      role="article"
      aria-labelledby={`car-title-${id}`}
      data-component="car-card"
      data-ai="car-card"
      data-car-id={id}
      data-make={make}
      data-model={model}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
    >
      {/* Image + actions */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-50">
        <Image
          src={image}
          alt={`${make} ${model} ${year} ${bodyType} for sale`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover w-full h-full transform-gpu group-hover:scale-105 transition-transform duration-300"
          priority={!!featured}
        />

        {/* top-left badges */}
        {featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-xs font-semibold text-white shadow-sm">
            Featured
          </span>
        )}

        {/* Favorite toggle */}
        <button
          type="button"
          aria-pressed={favorited}
          aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
          onClick={toggleFavorite}
          className="absolute right-3 top-3 inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/95 hover:bg-white shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-transform duration-150"
          title={favorited ? "Remove from favorites" : "Save to favorites"}
          data-action="favorite-toggle"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${favorited ? "text-red-500" : "text-slate-600 group-hover:text-slate-800"}`}
            aria-hidden="true"
          />
          <span className="sr-only">{favorited ? "Favorited" : "Not favorited"}</span>
        </button>

        {/* subtle gradient bottom for readable text */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h3 id={`car-title-${id}`} className="text-base sm:text-lg font-semibold text-slate-900 leading-tight">
              {name || `${make} ${model}`}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              <span>{year}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{bodyType}</span>
            </p>
          </div>

          <div className="text-right">
            <div className="text-lg sm:text-xl font-extrabold text-blue-600 leading-none">
              ${formatPrice(price)}
            </div>
            <div className="text-xs text-slate-500">One-time price</div>
          </div>
        </header>

        {/* Specs */}
        <ul className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <li className="px-2 py-1 bg-slate-100 rounded-full border border-slate-200">{transmission}</li>
          <li className="px-2 py-1 bg-slate-100 rounded-full border border-slate-200">{fuelType}</li>
          <li className="px-2 py-1 bg-slate-100 rounded-full border border-slate-200">{mileage === 0 ? "New" : `${mileage.toLocaleString()} km`}</li>
          <li className="px-2 py-1 bg-slate-100 rounded-full border border-slate-200 capitalize">{color}</li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={`/car/${id}`}
            className="inline-flex items-center justify-center flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={`View details for ${make} ${model}`}
            data-action="view-car"
          >
            View car
          </Link>

          <Link
            href={`/admin/test-drives/new?carId=${id}`}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label={`Book a test drive for ${make} ${model}`}
            data-action="book-test-drive"
          >
            Book test drive
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CarCard;
