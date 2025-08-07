"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, BedDouble, Bath, Ruler, Calendar, Star, MapPin, Home, Tag, Hash, Users, Layers, Globe, Eye, Heart } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSession } from "next-auth/react";
import toast from 'react-hot-toast';
import BookingDialog from "@/components/BookingDialog";

const StaticMap = dynamic(() => import("@/components/StaticMap"), { ssr: false });

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
  __v?: number;
  ownerId: string;
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarHouses, setSimilarHouses] = useState<House[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to home page if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  // Don't render anything if not authenticated
  useEffect(() => {
    setLoading(true);
    fetch(`/api/houses/${id}`)
      .then((res) => res.json())
      .then((apiData) => {
        setHouse(apiData.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!house) return;
    fetch(`/api/houses?status=${encodeURIComponent(house.homeStatus)}&exclude=${house.id}&limit=5`)
      .then((res) => res.json())
      .then((apiData) => {
        setSimilarHouses(apiData.data || []);
      });
  }, [house]);

  // Check if house is in user's favorites
  useEffect(() => {
    if (!house || !session?.user?.id) return;
    
    fetch('/api/favorites')
      .then((res) => res.json())
      .then((data) => {
        const isInFavorites = data.data?.some((favHouse: House) => favHouse.id === house.id);
        setIsFavorite(isInFavorites);
      })
      .catch((error) => {
        console.error('Error checking favorites:', error);
      });
  }, [house, session?.user?.id]);

  const toggleFavorite = async () => {
    if (!session?.user?.id || !house) return;

    try {
      if (isFavorite) {
        // Remove from favorites
        await fetch(`/api/favorites?houseId=${house.id}`, {
          method: 'DELETE',
        });
        setIsFavorite(false);
        toast.success('Removed from favorites!', {
          icon: '💔',
          duration: 3000,
        });
      } else {
        // Add to favorites
        await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ houseId: house.id }),
        });
        setIsFavorite(true);
        toast.success('Added to favorites!', {
          icon: '❤️',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites. Please try again.', {
        icon: '❌',
        duration: 4000,
      });
    }
  };

  // Don't render anything if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
      {/* Back to Listings Skeleton */}
      <div className="mb-6 h-6 w-40 bg-gray-200 rounded" />
      {/* Carousel Skeleton */}
      <div className="mb-8 px-3">
        <div className="relative w-full mx-auto rounded-2xl overflow-hidden shadow-lg">
          <div className="w-full h-[450px] bg-gray-200 rounded-2xl" />
        </div>
      </div>
      {/* Key Details Box Skeleton */}
      <div className="mb-8 p-6 bg-blue-50/60 border-blue-100 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-wrap gap-8 items-center justify-between w-full">
          <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-6 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-6 w-20 bg-gray-200 rounded mb-2" />
          <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-6 w-16 bg-gray-200 rounded mb-2" />
          <div className="h-6 w-28 bg-gray-200 rounded mb-2" />
        </div>
      </div>
      {/* Title, Price, Main Stats Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div className="h-10 w-2/3 bg-gray-200 rounded mb-2" />
        <div className="h-10 w-40 bg-gray-200 rounded mb-2" />
      </div>
      <div className="flex flex-wrap gap-4 items-center mb-2">
        <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-20 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
      </div>
      <div className="flex flex-wrap gap-8 items-center mb-6 text-lg">
        <div className="h-6 w-20 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-20 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
      </div>
      {/* Description Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-40 bg-gray-200 rounded mb-4" />
        <div className="h-4 w-full bg-gray-100 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-100 rounded mb-2" />
      </div>
      {/* Iconic Details Section Skeleton */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-6 w-3/4 bg-gray-100 rounded" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-6 w-2/3 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
      {/* Map section Skeleton */}
      <div className="mb-8">
        <div className="w-full h-72 rounded-xl overflow-hidden shadow bg-gray-200" />
      </div>
      {/* Main Action Button Skeleton */}
      <div className="mb-8">
        <div className="w-full h-12 bg-gray-300 rounded-md" />
      </div>
      {/* Similar homes carousel skeleton */}
      <div className="flex flex-row gap-8 mb-12">
        <div className="w-full max-w-4xl xl:max-w-4xl 2xl:max-w-none grow">
          <div className="relative">
            <div className="relative">
              <div className="flex">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-stretch basis-full sm:basis-1/2 xl:basis-1/3 px-2">
                    <div className="min-w-[250px] rounded-lg shadow-sm border-0 overflow-hidden bg-white h-full flex flex-col">
                      <div className="relative">
                        <div className="w-full h-32 bg-gray-200 animate-pulse" />
                        <div className="absolute top-1.5 left-1.5">
                          <div className="w-12 h-4 bg-gray-300 rounded-full animate-pulse" />
                        </div>
                        <div className="absolute top-1.5 right-1.5">
                          <div className="w-16 h-4 bg-gray-300 rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div className="p-3 pb-3">
                        <div className="flex items-center gap-1 mb-1.5">
                          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="w-full h-4 bg-gray-200 rounded mb-1.5 animate-pulse" />
                        <div className="w-3/4 h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="grid grid-cols-3 gap-1 mb-2">
                          <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-sm">
                            <div className="w-3 h-3 bg-gray-300 rounded mb-0.5 animate-pulse" />
                            <div className="w-4 h-3 bg-gray-300 rounded mb-0.5 animate-pulse" />
                            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse" />
                          </div>
                          <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-sm">
                            <div className="w-3 h-3 bg-gray-300 rounded mb-0.5 animate-pulse" />
                            <div className="w-4 h-3 bg-gray-300 rounded mb-0.5 animate-pulse" />
                            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse" />
                          </div>
                          <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-sm">
                            <div className="w-3 h-3 bg-gray-300 rounded mb-0.5 animate-pulse" />
                            <div className="w-8 h-3 bg-gray-300 rounded mb-0.5 animate-pulse" />
                            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 bg-gray-300 rounded animate-pulse" />
                            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2.5 h-2.5 bg-gray-300 rounded animate-pulse" />
                            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse" />
                          </div>
                        </div>
                        <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Carousel navigation skeleton buttons */}
              <button className="absolute left-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-gray-300 opacity-60" disabled />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-gray-300 opacity-60" disabled />
            </div>
          </div>
        </div>
      </div>
      {/* End Similar homes carousel skeleton */}
    </div>
  );
  if (!house) return <div className="p-12 text-center text-lg text-red-500">House not found.</div>;

  const isRent = house.homeStatus === 'FOR_RENT';
  const isSold = house.homeStatus === 'RECENTLY_SOLD';

  const pricePerSqft = house.price && house.livingArea ? Math.round(house.price / house.livingArea) : null;

  // Responsive class for max-w-4xl but full width on larger screens
  const carouselContainerClass = "w-full max-w-4xl xl:max-w-4xl 2xl:max-w-none";



  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Back to Listings */}
      <div className="mb-6">
        <Link href="/houses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to {isRent ? 'Rentals' : 'Listings'}
        </Link>
      </div>

      {/* Carousel + View All Photos Modal */}
      <div className="mb-8 px-3">
        <div className="relative w-full max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-lg">
          {/* View all photos button (overlapping carousel, top-right) */}
          {(house.pictures?.length ?? 0) > 0 ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="absolute top-4 right-4 z-30 bg-white/90 hover:bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-2 border border-blue-100">
                    <span>View all photos</span>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="!max-w-[90vw] !max-h-[90vh] p-0 overflow-hidden">
                  <AlertDialogHeader className="sticky top-0 z-10 bg-white shadow-sm flex flex-row items-center justify-between px-8 py-4 border-b">
                    <div className="flex items-center gap-4">
                      <AlertDialogTitle className="text-2xl font-bold">All Photos</AlertDialogTitle>
                      <span className="text-base text-gray-500 font-medium">{house.pictures?.length ?? 0} photo{(house.pictures?.length ?? 0) > 1 ? 's' : ''}</span>
                    </div>
                    <AlertDialogCancel className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 ml-auto">
                      <X className="w-6 h-6" />
                    </AlertDialogCancel>
                  </AlertDialogHeader>
                  <div className="max-h-[75vh] overflow-y-auto p-8 grid gap-8 bg-white">
                    {house.pictures?.map((img, i) => (
                      <Image
                        key={i}
                        src={img.url}
                        alt={house.streetAddress}
                        width={800}
                        height={600}
                        className="w-full max-h-[70vh] object-contain rounded-xl border"
                      />
                    ))}
                  </div>
                </AlertDialogContent>
              </AlertDialog>
              
              {/* Heart button for favorites */}
              {session?.user?.id && (
                <button
                  onClick={toggleFavorite}
                  disabled={session?.user?.id === house.ownerId}
                  className={`absolute top-4 right-48 z-30 p-3 rounded-full shadow-lg border transition-all duration-200 ${
                    session?.user?.id === house.ownerId
                      ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed opacity-60'
                      : isFavorite 
                        ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                        : 'bg-white/90 text-gray-600 border-gray-200 hover:bg-white hover:text-red-500'
                  }`}
                  title={session?.user?.id === house.ownerId ? "You can't favorite your own property" : isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              )}
              
              {/* Simple custom photo carousel */}
              <Carousel className="w-full h-[450px]" opts={{ loop: true, align: "start", slidesToScroll: 1 }}>
                <CarouselContent>
                  {house.pictures?.map((img, i) => (
                    <CarouselItem key={i}>
                      <div className="w-full h-[450px] flex items-center justify-center bg-gray-100 rounded-2xl overflow-hidden">
                        <Image
                          src={img.url}
                          alt={house.streetAddress}
                          width={800}
                          height={450}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2" />
                <CarouselNext className="right-2 top-1/2 -translate-y-1/2" />
              </Carousel>
            </>
          ) : (
            <div className="w-full h-[450px] bg-gray-100 rounded-2xl">No images</div>
          )}
        </div>
      </div>
      {/* Key Details Box */}
      <Card className="mb-8 p-6 bg-blue-50/60 border-blue-100 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex flex-wrap gap-8 items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-blue-700">{house.currency} {house.price.toLocaleString()}</div>
            <span className="text-sm text-gray-600">/ {isRent ? 'month' : 'total'}</span>
          </div>
          <div className="flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">{house.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">{house.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">{house.livingArea.toLocaleString()} sqft</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">{house.homeType}</span>
          </div>
          <Badge variant={isSold ? "secondary" : "default"}>{isSold ? "Sold" : house.homeStatus}</Badge>
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <span className="font-semibold">{house.city}, {house.state}</span>
          </div>
        </div>
      </Card>

      {/* Title, Price, Main Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Home className="text-blue-600" /> {house.streetAddress}
        </h1>
        <div className="text-3xl font-semibold text-blue-700">{house.currency} {house.price.toLocaleString()}</div>
      </div>
      <div className="flex flex-wrap gap-4 items-center mb-2">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-5 h-5" />
          {house.streetAddress}, {house.city}, {house.state} {house.zipcode}
        </div>
        <Badge variant={isSold ? "secondary" : "default"}>{isSold ? "Sold" : house.homeStatus}</Badge>
        <Badge variant="secondary">Listed: {house.datePostedString}</Badge>
        {pricePerSqft && <Badge variant="outline">${pricePerSqft}/sqft</Badge>}
      </div>
      <div className="flex flex-wrap gap-8 items-center mb-6 text-lg">
        <div className="flex items-center gap-2"><BedDouble className="w-6 h-6 text-blue-600" /> <span className="font-bold">{house.bedrooms}</span> beds</div>
        <div className="flex items-center gap-2"><Bath className="w-6 h-6 text-blue-600" /> <span className="font-bold">{house.bathrooms}</span> baths</div>
        <div className="flex items-center gap-2"><Ruler className="w-6 h-6 text-blue-600" /> <span className="font-bold">{house.livingArea.toLocaleString()}</span> sqft</div>
        <div className="flex items-center gap-2"><Calendar className="w-6 h-6 text-blue-600" /> Built {house.yearBuilt}</div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <div className="text-gray-700 leading-relaxed">
          {house.description}
        </div>
      </div>
      {/* Iconic Details Section */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-blue-600" /><span className="font-semibold">Address:</span> {house.streetAddress}, {house.city}, {house.state} {house.zipcode}</div>
          <div className="flex items-center gap-3"><Tag className="w-5 h-5 text-gray-500" /><span className="font-semibold">Status:</span><Badge variant="secondary" className="ml-2">{house.homeStatus}</Badge></div>
          <div className="flex items-center gap-3"><Home className="w-5 h-5 text-blue-600" /><span className="font-semibold">Type:</span> {house.homeType}</div>
          <div className="flex items-center gap-3"><Ruler className="w-5 h-5 text-purple-600" /><span className="font-semibold">Living Area:</span> {house.livingArea.toLocaleString()} sqft</div>
          <div className="flex items-center gap-3"><BedDouble className="w-5 h-5 text-blue-600" /><span className="font-semibold">Bedrooms:</span> {house.bedrooms}</div>
          <div className="flex items-center gap-3"><Bath className="w-5 h-5 text-green-600" /><span className="font-semibold">Bathrooms:</span> {house.bathrooms}</div>
          <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-gray-600" /><span className="font-semibold">Year Built:</span> {house.yearBuilt}</div>
          <div className="flex items-center gap-3"><Star className="w-5 h-5 text-yellow-500" /><span className="font-semibold">Days on Stickball:</span> {house.daysOnStickball ?? 'N/A'}</div>
          <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-gray-600" /><span className="font-semibold">Date Posted:</span> {house.datePostedString}</div>
          <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-gray-600" /><span className="font-semibold">Created At:</span> {house.createdAt}</div>
          <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-gray-600" /><span className="font-semibold">Updated At:</span> {house.updatedAt}</div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3"><Hash className="w-5 h-5 text-gray-500" /><span className="font-semibold">ZPID:</span> {house.zpid ?? 'N/A'}</div>
          <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-gray-400" /><span className="font-semibold">Neighborhood:</span> {house.neighborhood ?? 'N/A'}</div>
          <div className="flex items-center gap-3"><Users className="w-5 h-5 text-blue-400" /><span className="font-semibold">Community:</span> {house.community ?? 'N/A'}</div>
          <div className="flex items-center gap-3"><Layers className="w-5 h-5 text-purple-400" /><span className="font-semibold">Subdivision:</span> {house.subdivision ?? 'N/A'}</div>
          <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-green-500" /><span className="font-semibold">Latitude:</span> {house.latitude}</div>
          <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-green-500" /><span className="font-semibold">Longitude:</span> {house.longitude}</div>
        </div>
      </div>

      {/* Map section */}
      <div className="mb-8">
        <div className="w-full h-72 rounded-xl overflow-hidden shadow">
          <StaticMap
            houses={[{
              id: house.id,
              title: house.streetAddress,
              images: house.pictures?.map(p => p.url) || [],
              address: {
                city: house.city,
                state: house.state,
              },
              location: {
                lat: house.latitude,
                lng: house.longitude,
              },
            }]}
            center={[house.latitude, house.longitude]}
            zoom={16}
          />
        </div>
      </div>

      {/* Main Action Button */}
      <div className="mb-8">
        {session?.user?.id === house.ownerId ? (
          <Button
            className="w-full font-semibold py-4 text-lg bg-gray-400 cursor-not-allowed text-white"
            disabled
          >
            You posted this property
          </Button>
        ) : isSold ? (
          <Button
            className="w-full font-semibold py-4 text-lg bg-blue-600 hover:bg-blue-700 opacity-60 cursor-not-allowed text-white"
            disabled
          >
            Sold
          </Button>
        ) : (
          <BookingDialog
            trigger={
              <Button className="w-full font-semibold py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white">
                Schedule a Tour
              </Button>
            }
          />
        )}
      </div>
      {/* Similar homes carousel section */}
      {similarHouses.length > 0 && (
        <div className="flex flex-row gap-8 mb-12">
          <div className={`${carouselContainerClass} grow`}>
            <Carousel className="relative" opts={{ loop: true }}>
              <CarouselContent>
                {similarHouses.map((house) => (
                  <CarouselItem
                    key={house.id}
                    className="flex flex-col items-stretch basis-full sm:basis-1/2 xl:basis-1/3"
                  >
                    <Link href={`/houses/${house.id}`} className="block group">
                      <Card className="min-w-[250px] !pt-0 pb-0 gap-0 rounded-lg shadow-sm border-0 overflow-hidden bg-white h-full flex flex-col hover:scale-101 transition-all duration-300 group-hover:shadow-md">
                        {/* Image Section */}
                        <div className="relative">
                          <Image
                            src={house.pictures?.[0]?.url || "/house.jpg"}
                            alt={house.streetAddress}
                            width={300}
                            height={128}
                            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/house.jpg";
                            }}
                          />
                          {/* Status Badge */}
                          <div className="absolute top-1.5 left-1.5">
                            <span className={`text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm ${house.homeStatus === 'RECENTLY_SOLD' ? 'bg-gray-500' : house.homeStatus === 'For Rent' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                              {house.homeStatus === 'RECENTLY_SOLD' ? 'Sold' : house.homeStatus}
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
                          {/* Action Button */}
                          <Button
                            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-1.5 rounded-md shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-101 text-xs flex items-center justify-center ${house.homeStatus === 'RECENTLY_SOLD' ? 'opacity-60 cursor-not-allowed' : ''}`}
                            disabled={house.homeStatus === 'RECENTLY_SOLD'}
                          >
                            <Eye className="w-2.5 h-2.5 mr-1" />
                            {house.homeStatus === 'RECENTLY_SOLD'
                              ? 'Sold'
                              : house.homeStatus === 'FOR_RENT'
                                ? 'Rent this house'
                                : 'Buy this house'}
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 md:-left-8" />
              <CarouselNext className="right-0 md:-right-8" />
            </Carousel>
          </div>
          {/* No right-side placeholder needed */}
        </div>
      )}
    </div>
  );
}
