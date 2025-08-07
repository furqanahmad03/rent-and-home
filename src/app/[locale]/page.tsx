"use client";

import { HeroSection } from "@/components/hero-section";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BedDouble, Bath, Ruler, MapPin, Calendar, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

// Define the type for a house listing
interface House {
  id: string;
  zpid?: number;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  neighborhood?: string | null;
  community?: string | null;
  subdivision?: string | null;
  pictures?: { url: string }[];
  bedrooms: number;
  bathrooms: number;
  price: number;
  yearBuilt: number;
  longitude: number;
  latitude: number;
  homeStatus: string;
  description: string;
  livingArea: number;
  currency: string;
  homeType: string;
  datePostedString: string;
  daysOnStickball?: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
}



// Carousel skeleton card for homepage
function CarouselHouseSkeleton() {
  return (
    <Card className="min-w-[280px] !pt-0 pb-0 gap-0 rounded-lg shadow-sm border-0 overflow-hidden bg-white h-full flex flex-col">
      {/* Image skeleton */}
      <div className="relative">
        <div className="w-full h-32 bg-gray-200 animate-pulse"></div>
        {/* Status badge skeleton */}
        <div className="absolute top-1.5 left-1.5">
          <div className="w-12 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        {/* Property type badge skeleton */}
        <div className="absolute top-1.5 right-1.5">
          <div className="w-16 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      </div>
      <CardContent className="p-3 pb-3">
        {/* Price skeleton */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {/* Address skeleton */}
        <div className="mb-1.5">
          <div className="w-32 h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {/* Features grid skeleton */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div className="flex flex-col items-center p-1.5 bg-blue-50 rounded-sm">
            <div className="w-3 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-4 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center p-1.5 bg-green-50 rounded-sm">
            <div className="w-3 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-4 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center p-1.5 bg-purple-50 rounded-sm">
            <div className="w-3 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-8 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        {/* Button skeleton */}
        <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse"></div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [carouselHouses, setCarouselHouses] = useState<House[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    
    async function fetchHouses() {
      const [rentRes, buyRes, soldRes] = await Promise.all([
        fetch("/api/houses?status=FOR_RENT&limit=5"),
        fetch("/api/houses?status=FOR_SALE&limit=3"),
        fetch("/api/houses?status=RECENTLY_SOLD&limit=2"),
      ]);
      const [rentData, buyData, soldData] = await Promise.all([
        rentRes.json(),
        buyRes.json(),
        soldRes.json(),
      ]);
      setCarouselHouses([
        ...(rentData.data || []),
        ...(buyData.data || []),
        ...(soldData.data || []),
      ]);
    }
    fetchHouses();
  }, [session]);

  return (
    <main>
      <HeroSection />
      {session && (  
        <div className="my-12 mx-auto max-w-7xl px-20">
          <h3 className="text-2xl font-bold mb-6 ml-4">Homes for you</h3>
          <Carousel className="w-full" opts={{ loop: true, align: "start", slidesToScroll: 1 }}>
            <CarouselContent className="-ml-4 py-3 bg-transparent">
              {!session || carouselHouses.length === 0
                ? Array.from({ length: 4 }).map((_, i) => (
                    <CarouselItem
                      key={i}
                      className="pl-4 basis-80 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <CarouselHouseSkeleton />
                    </CarouselItem>
                  ))
                : carouselHouses.map((house) => (
                    <CarouselItem
                      key={house.id}
                      className="pl-4 basis-80 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <Card className="min-w-[280px] !pt-0 pb-0 gap-0 rounded-lg shadow-sm border-0 overflow-hidden bg-white h-full flex flex-col hover:scale-101 transition-all duration-300 group-hover:shadow-md">
                        {/* Image Section */}
                        <div className="relative">
                          <Image
                            src={house.pictures?.[0]?.url || "/house.jpg"}
                            alt={house.streetAddress}
                            width={280}
                            height={128}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/house.jpg";
                            }}
                          />
                          {/* Status Badge */}
                          <div className="absolute top-1.5 left-1.5">
                            <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                              {house.homeStatus}
                            </span>
                          </div>
                          {/* Property Type Badge */}
                          <div className="absolute top-1.5 right-1.5">
                            <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                              {house.homeType}
                            </span>
                          </div>
                        </div>
                        {/* Content Section */}
                        <CardContent className="p-3 pb-3">
                          {/* Price */}
                          <div className="flex items-center gap-1 mb-1.5">
                            <div className="text-base font-bold text-blue-700">{house.currency} {house.price.toLocaleString()}</div>
                            <span className="text-xs text-gray-500">/ {house.homeStatus === 'For Rent' ? 'month' : 'total'}</span>
                          </div>
                          {/* Address (2 lines) */}
                          <div className="mb-1.5">
                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                              {house.streetAddress}
                            </div>
                            <div className="text-xs text-gray-700">
                              {house.city}, {house.state} {house.zipcode}
                            </div>
                          </div>
                          {/* Key Features Grid */}
                          <div className="grid grid-cols-3 gap-1 mb-2">
                            <div className="flex flex-col items-center p-1.5 bg-blue-50 rounded-sm group-hover:bg-blue-100 transition-colors">
                              <BedDouble className="w-3 h-3 text-blue-600 mb-0.5" />
                              <span className="text-xs font-medium text-gray-700">{house.bedrooms}</span>
                              <span className="text-xs text-gray-500">beds</span>
                            </div>
                            <div className="flex flex-col items-center p-1.5 bg-green-50 rounded-sm group-hover:bg-green-100 transition-colors">
                              <Bath className="w-3 h-3 text-green-600 mb-0.5" />
                              <span className="text-xs font-medium text-gray-700">{house.bathrooms}</span>
                              <span className="text-xs text-gray-500">baths</span>
                            </div>
                            <div className="flex flex-col items-center p-1.5 bg-purple-50 rounded-sm group-hover:bg-purple-100 transition-colors">
                              <Ruler className="w-3 h-3 text-purple-600 mb-0.5" />
                              <span className="text-xs font-medium text-gray-700">{house.livingArea.toLocaleString()}</span>
                              <span className="text-xs text-gray-500">sqft</span>
                            </div>
                          </div>
                          {/* Location and Date */}
                          <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-red-500" />
                              <span className="truncate">{house.city}, {house.state}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5 text-gray-400" />
                              <span>Listed {new Date(house.datePostedString).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {/* Features Preview */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {/* The original code had features.slice(0, 2).map, but features is not defined in the new interface.
                                Assuming the intent was to use a placeholder or remove this section if features are not available.
                                For now, removing the map as features is not part of the House interface. */}
                          </div>
                          {/* Action Button */}
                          <button
                            onClick={() => {
                              if (!session) {
                                // Show a toast or alert that user needs to sign in
                                alert('Please sign in to view property details');
                                return;
                              }
                              if (house.homeStatus !== 'RECENTLY_SOLD') {
                                window.location.href = `/houses/${house.id}`;
                              }
                            }}
                            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 rounded-md shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-101 text-xs flex items-center justify-center ${house.homeStatus === 'RECENTLY_SOLD' ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={house.homeStatus === 'RECENTLY_SOLD'}
                          >
                            <Eye className="w-2.5 h-2.5 mr-1" />
                            {house.homeStatus === 'RECENTLY_SOLD'
                              ? 'Sold'
                              : house.homeStatus === 'FOR_RENT'
                                ? 'Rent this house'
                                : 'Buy this house'}
                          </button>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
            </CarouselContent>
            <CarouselPrevious size="icon" className="!w-10 !h-10" />
            <CarouselNext size="icon" className="!w-10 !h-10" />
          </Carousel>
        </div>
      )}
      {/* 3 Feature Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-8 px-2 max-w-7xl mx-auto">
        {/* Buy a home */}
        <div className="bg-white rounded-2xl shadow-md flex flex-col gap-4 items-center p-8 pb-12 text-center border border-gray-100 hover:scale-105 transition-all duration-300">
          <Image 
            src="/buy-home.webp" 
            alt="Buy a home" 
            width={400}
            height={300}
            className="w-full h-auto object-contain mb-4"
            onError={(e) => {
              console.error('Failed to load buy-home.webp, trying fallback');
              const target = e.target as HTMLImageElement;
              target.src = '/house.jpg';
            }}
            onLoad={() => {
              console.log('Successfully loaded buy-home.webp');
            }}
          />
          <h3 className="text-3xl font-bold mb-2">Buy a home</h3>
          <p className="text-gray-500 mb-6">Find your place with an immersive photo experience and the most listings, including things you won&apos;t find anywhere else.</p>
          <button
            onClick={() => {
              if (!session) {
                toast.error('Please sign in to browse homes');
                return;
              }
              window.location.href = '/houses?purpose=buy';
            }}
            className="inline-block border border-blue-500 text-blue-600 font-semibold rounded-lg px-6 py-2 hover:bg-blue-50 transition cursor-pointer"
          >
            Browse homes
          </button>
        </div>
        {/* Sell a home */}
        <div className="bg-white rounded-2xl shadow-md flex flex-col gap-4 items-center p-8 pb-12 text-center border border-gray-100 hover:scale-105 transition-all duration-300">
          <Image 
            src="/sell-home.webp" 
            alt="Sell a home" 
            width={400}
            height={300}
            className="w-full h-auto object-contain mb-4"
            onError={(e) => {
              console.error('Failed to load sell-home.webp, trying fallback');
              const target = e.target as HTMLImageElement;
              target.src = '/house.jpg';
            }}
            onLoad={() => {
              console.log('Successfully loaded sell-home.webp');
            }}
          />
          <h3 className="text-3xl font-bold mb-2">Sell a home</h3>
          <p className="text-gray-500 mb-6">No matter what path you take to sell your home, we can help you navigate a successful sale.</p>
          <button
            onClick={() => {
              if (!session) {
                toast.error('Please sign in to see selling options');
                return;
              }
              window.location.href = '/sell';
            }}
            className="inline-block border border-blue-500 text-blue-600 font-semibold rounded-lg px-6 py-2 hover:bg-blue-50 transition cursor-pointer"
          >
            See your options
          </button>
        </div>
        {/* Rent a home */}
        <div className="bg-white rounded-2xl shadow-md flex flex-col gap-4 items-center p-8 pb-12 text-center border border-gray-100 hover:scale-105 transition-all duration-300">
          <Image 
            src="/rent-home.webp" 
            alt="Rent a home" 
            width={400}
            height={300}
            className="w-full h-auto object-contain mb-4"
            onError={(e) => {
              console.error('Failed to load rent-home.webp, trying fallback');
              const target = e.target as HTMLImageElement;
              target.src = '/house.jpg';
            }}
            onLoad={() => {
              console.log('Successfully loaded rent-home.webp');
            }}
          />
          <h3 className="text-3xl font-bold mb-2">Rent a home</h3>
          <p className="text-gray-500 mb-6">We&apos;re creating a seamless online experience – from shopping on the largest rental network to applying, to paying rent.</p>
          <button
            onClick={() => {
              if (!session) {
                toast.error('Please sign in to find rentals');
                return;
              }
              window.location.href = '/houses?purpose=rent';
            }}
            className="inline-block border border-blue-500 text-blue-600 font-semibold rounded-lg px-6 py-2 hover:bg-blue-50 transition cursor-pointer"
          >
            Find rentals
          </button>
        </div>
      </div>
    </main>
  );
}
