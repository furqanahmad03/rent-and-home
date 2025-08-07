"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, BedDouble, Bath, Ruler, MapPin, Calendar, Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

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
  photos: string[];
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
}

// Skeleton component for house cards
function HouseSkeleton() {
  return (
    <Card className="min-w-[300px] !pt-0 pb-0 gap-0 rounded-lg shadow-sm border-0 overflow-hidden bg-white h-full flex flex-col">
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
      {/* Content skeleton */}
      <CardContent className="p-3 pb-3">
        {/* Price skeleton */}
        <div className="flex items-center gap-1 mb-1.5">
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {/* Address skeleton */}
        <div className="w-full h-4 bg-gray-200 rounded mb-1.5 animate-pulse"></div>
        <div className="w-3/4 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
        {/* Features grid skeleton */}
        <div className="grid grid-cols-3 gap-1 mb-2">
          <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-sm">
            <div className="w-3 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-4 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-sm">
            <div className="w-3 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-4 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-sm">
            <div className="w-3 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-8 h-3 bg-gray-300 rounded mb-0.5 animate-pulse"></div>
            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        {/* Location and date skeleton */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        {/* Button skeleton */}
        <div className="w-full h-8 bg-gray-200 rounded-md animate-pulse"></div>
      </CardContent>
    </Card>
  );
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const router = useRouter();

  // Fetch user's favorite houses
  useEffect(() => {
    if (status === "authenticated") {
      fetchFavorites();
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/favorites');
      const result = await response.json();
      
      if (response.ok) {
        setFavorites(result.data || []);
      } else {
        console.error('Failed to fetch favorites:', result.error);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (houseId: string) => {
    setLoadingFavorites(true);
    try {
      await fetch(`/api/favorites?houseId=${houseId}`, {
        method: 'DELETE',
      });
      // Remove from local state
      setFavorites(prev => prev.filter(house => house.id !== houseId));
      toast.success('Property removed from favorites!', {
        icon: '💔',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove property from favorites. Please try again.', {
        icon: '❌',
        duration: 4000,
      });
    } finally {
      setLoadingFavorites(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
        <p className="text-gray-600">
          {favorites.length === 0 
            ? "You haven't added any properties to your favorites yet."
            : `You have ${favorites.length} favorite propert${favorites.length === 1 ? 'y' : 'ies'}.`
          }
        </p>
      </div>

      {/* Grid of Favorite Houses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Show skeleton cards while loading
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              <HouseSkeleton />
            </div>
          ))
        ) : favorites.length > 0 ? (
          // Show actual favorite house cards
          favorites.map((house) => (
            <div key={house.id} className="group relative">
              <Card className="min-w-[300px] !pt-0 pb-0 gap-0 rounded-lg shadow-sm border-0 overflow-hidden bg-white h-full flex flex-col hover:scale-101 transition-all duration-300 group-hover:shadow-md">
                {/* Image Section */}
                <div className="relative">
                  <img
                    key={house.pictures?.[0]?.url || house.id}
                    src={house.pictures?.[0]?.url || '/house.jpg'}
                    alt={house.streetAddress}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => (e.currentTarget.src = "/house.jpg")}
                  />
                  {/* Status Badge */}
                  <div className="absolute top-1.5 left-1.5">
                    <span className={`text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm ${house.homeStatus === 'RECENTLY_SOLD' ? 'bg-gray-500' : house.homeStatus === 'FOR_RENT' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                      {house.homeStatus === 'RECENTLY_SOLD' ? 'Sold' : house.homeStatus}
                    </span>
                  </div>
                  {/* Property Type Badge */}
                  <div className="absolute top-1.5 right-1.5">
                    <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      {house.homeType}
                    </span>
                  </div>
                  {/* Heart Button - Always visible in favorites */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(house.id);
                    }}
                    disabled={loadingFavorites}
                    className="absolute bottom-1.5 left-1.5 bg-white rounded-full p-1.5 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Heart 
                      className="w-4 h-4 fill-red-500 text-red-500" 
                    />
                  </button>
                </div>
                {/* Content Section */}
                <CardContent className="p-3 pb-3">
                  {/* Price */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="text-base font-bold text-blue-700">{house.currency} {house.price.toLocaleString()}</div>
                    <span className="text-xs text-gray-500">/ {house.homeStatus === 'FOR_RENT' ? 'month' : 'total'}</span>
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
                    onClick={() => router.push(`/houses/${house.id}`)}
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
            </div>
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">
              Start exploring properties and add them to your favorites to see them here.
            </p>
            <Button 
              onClick={() => router.push('/houses')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Browse Properties
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 