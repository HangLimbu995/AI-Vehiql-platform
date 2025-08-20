"use client";

import Link from "next/link";
import { Button } from "../components/ui/button";
import { Calendar, Car, ChevronRight, Shield } from "lucide-react";
import CarCard from "../components/car-card";
import BrandCard from "../components/brand-card";
import { bodyTypes, carMakes, faqItems, featuredCars } from "../lib/data";
import Image from "next/image";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32 dotted-background">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight gradient-title">
              Find your Dream Car with Vehiql AI
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Advanced AI Car Search and test drive from thousands of vehicles.
            </p>
          </div>

          {/* Search Component Placeholder */}
          <div className="mt-12 sm:mt-16">
            {/* <HomeSearch /> */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Search component coming soon...
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Featured Cars
            </h2>
            <Button
              variant="ghost"
              className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800"
              asChild
            >
              <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredCars.map((car) => (
              <CarCard
                key={car.id}
                car={{
                  ...car,
                  name: `${car.make} ${car.model}`,
                  year: car.year.toString(),
                  image: car.images[0],
                  featured: false,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Make Section */}
      <section className="py-12 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Browse by Make
            </h2>
            <Button
              variant="ghost"
              className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800"
              asChild
            >
              <Link href="/brands">
                View All Brands <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {carMakes.map((brand) => (
              <BrandCard
                key={brand.id}
                brand={{
                  ...brand,
                  logo: brand.image,
                  slug: brand.name.toLowerCase().replace(/\s+/g, "-"),
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of verified vehicles from trusted dealerships and
                private sellers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Test Drive</h3>
              <p className="text-gray-600">
                Book a test drive online in minutes, with flexible scheduling
                options.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Process</h3>
              <p className="text-gray-600">
                Verified listings and secure booking process for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Browse by Body Type</h2>
            <Button variant="ghost" className="flex items-center" asChild>
              <Link href="/cars">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bodyTypes.map((type) => {
              return (
                <Link
                  key={type.name}
                  href={`/cars?bodyType=${type.name}`}
                  className="relative group cursor-pointer"
                >
                  <div className="overflow-hidden rounded-lg flex justify-end h-28 mb-4 relative">
                    <Image
                      src={type.image}
                      alt={type.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end">
                    <h3 className="text-white text-xl font-bold pl-4 pg-2">
                      {type.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => {
              return (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      <section className="py-16 dotted-background text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Dream Car?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect
            vehicle through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size={"lg"} variant="secondary" asChild>
              <Link href="/cars">View All Cars</Link>
            </Button>
            <Button size="lg" asChild>
              <Link href="/sign-up">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
