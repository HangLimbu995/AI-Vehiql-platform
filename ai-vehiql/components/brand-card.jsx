import Image from "next/image";
import Link from "next/link";

const BrandCard = ({ brand }) => {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className="group block"
      aria-label={`Browse ${brand.name} cars`}
    >
      <div className="brand-card-gradient bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 text-center py-2">
        {/* Brand Logo */}
        <div className="relative h-20 w-20 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 brand-logo-wrap">
          <Image
            src={brand.logo}
            alt={`${brand.name} logo`}
            fill
            className="object-contain"
            sizes="80px"
          />
        </div>

        {/* Brand Name */}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {brand.name}
        </h3>
      </div>
    </Link>
  );
};

export default BrandCard;
