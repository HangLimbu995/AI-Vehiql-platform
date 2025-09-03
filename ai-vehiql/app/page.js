import React from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Calendar, Car, ChevronRight, Shield } from "lucide-react";
import CarCard from "../components/car-card";
import BrandCard from "../components/brand-card";
import SearchBar from "../components/search-bar";
import { bodyTypes, carMakes, faqItems } from "../lib/data";
import Image from "next/image";
import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/components/ui/accordion";
import { SignedOut } from "@clerk/nextjs";
import { getFeaturedCars } from "@/actions/home";

export default async function Home() {
  const featuredCars = await getFeaturedCars();

  return (
    <>
      <main className="min-h-screen pt-16 sm:pt-20 animated-page-bg">
        {/* Hero */}
        <section
          className="dotted-background relative px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32"
          aria-labelledby="home-hero-title"
          data-section="hero"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h1
              id="home-hero-title"
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 gradient-title"
            >
              Find your dream car with Vehiql AI
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Advanced AI-assisted search, verified listings, and instant test
              drive booking.
            </p>

            <div className="mt-8">
              <SearchBar />
              <div className="mt-3 text-xs text-slate-500">
                Tip: Try queries like &quot;electric SUV under 50k&quot; or
                &quot;Toyota Corolla 2020&quot;.
              </div>
            </div>
          </div>
        </section>

        {/* Featured Cars */}
        <section
          className="py-12 px-4 sm:px-6 lg:px-8"
          aria-labelledby="featured-cars"
          data-section="featured-cars"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2
                id="featured-cars"
                className="text-2xl sm:text-3xl font-bold text-slate-900"
              >
                Featured Cars
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/cars">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={{
                    ...car,
                    name: `${car.make} ${car.model}`,
                    year: String(car.year),
                    image: car.images?.[0] || "/placeholder-car.jpg",
                    featured: car.featured ?? true,
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Browse by Make */}
        <section
          className="py-12 bg-slate-50 px-4 sm:px-6 lg:px-8"
          aria-labelledby="browse-make"
          data-section="browse-make"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2
                id="browse-make"
                className="text-2xl sm:text-3xl font-bold text-slate-900"
              >
                Browse by Make
              </h2>
              <Button variant="ghost" asChild>
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

        {/* Core Benefits */}
        <section className="py-16 px-4 sm:px-6 lg:px-8" data-section="benefits">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">Why Choose Our Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full text-blue-700 mb-4 mx-auto benefit-gradient">
                  <Car className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
                <p className="text-slate-600">
                  Thousands of verified vehicles from trusted sellers.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full text-blue-700 mb-4 mx-auto benefit-gradient">
                  <Calendar className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Test Drive</h3>
                <p className="text-slate-600">
                  Book a test drive online in minutes with flexible scheduling.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-2">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-full text-blue-700 mb-4 mx-auto benefit-gradient">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Process</h3>
                <p className="text-slate-600">
                  Verified listings and secure booking for peace of mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by Body Type */}
        <section
          className="py-12 bg-slate-50 px-4 sm:px-6 lg:px-8"
          aria-labelledby="by-body"
          data-section="body-types"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 id="by-body" className="text-2xl font-bold">
                Browse by Body Type
              </h2>
              <Button variant="ghost" asChild>
                <Link href="/cars">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bodyTypes.map((type) => (
                <Link
                  key={type.name}
                  href={`/cars?bodyType=${encodeURIComponent(type.name)}`}
                  className="group relative overflow-hidden rounded-lg block h-28"
                  aria-label={`Browse ${type.name}`}
                  data-body-type={type.name}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={type.image}
                      alt={type.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <h3 className="text-white text-lg font-bold">
                      {type.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="py-12 px-4 sm:px-6 lg:px-8"
          aria-labelledby="faq"
          data-section="faq"
        >
          <div className="max-w-4xl mx-auto">
            <h2 id="faq" className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((faq, idx) => (
                <AccordionItem value={`q-${idx}`} key={idx}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 dotted-background text-white">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Dream Car?
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join thousands of satisfied customers who found their perfect
              vehicle through our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/cars">View All Cars</Link>
              </Button>
              <SignedOut>
                <Button size="lg" asChild>
                  <Link href="/sign-up">Sign Up Now</Link>
                </Button>
              </SignedOut>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
