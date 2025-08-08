"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from 'next-intl';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, BedDouble, Bath, Ruler, Search, MapPin, Calendar, Eye } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import toast from 'react-hot-toast';

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
  ownerId: string;
}

// Skeleton component for house cards
function HouseSkeleton() {
  return (
    <Card className="!pt-0 pb-0 gap-0 rounded-lg shadow-sm border-0 md:overflow-hidden overflow-visible bg-white h-full flex flex-col">
      {/* Image skeleton */}
      <div className="relative">
        <div className="w-full h-32 bg-gray-200 animate-pulse"></div>
        {/* Status badge skeleton */}
        <div className="absolute top-1.5 left-1.5">
          <div className="w-12 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        {/* Property type badge skeleton */}
        <div className="absolute md:top-1.5 md:right-1.5 top-7 left-1.5">
          <div className="w-16 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        {/* Heart button skeleton */}
        <div className="absolute bottom-1.5 left-1.5">
          <div className="w-7 h-7 bg-gray-300 rounded-full animate-pulse"></div>
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
        <div className="mb-1.5">
          <div className="w-full h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
          <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {/* Features grid skeleton */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-1 mb-2">
          <div className="flex md:flex-col flex-row md:space-x-0 space-x-1 justify-center items-center p-1.5 bg-blue-50 rounded-sm">
            <div className="w-3 h-3 bg-gray-300 rounded md:mb-0.5 mb-0 animate-pulse"></div>
            <div className="w-4 h-3 bg-gray-300 rounded md:mb-0.5 mb-0 animate-pulse"></div>
            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="flex md:flex-col flex-row md:space-x-0 space-x-1 justify-center items-center p-1.5 bg-green-50 rounded-sm">
            <div className="w-3 h-3 bg-gray-300 rounded md:mb-0.5 mb-0 animate-pulse"></div>
            <div className="w-4 h-3 bg-gray-300 rounded md:mb-0.5 mb-0 animate-pulse"></div>
            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="flex md:flex-col flex-row md:space-x-0 space-x-1 justify-center items-center p-1.5 bg-purple-50 rounded-sm">
            <div className="w-3 h-3 bg-gray-300 rounded md:mb-0.5 mb-0 animate-pulse"></div>
            <div className="w-8 h-3 bg-gray-300 rounded md:mb-0.5 mb-0 animate-pulse"></div>
            <div className="w-6 h-3 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
        {/* Location and date skeleton */}
        <div className="flex md:flex-row flex-col md:space-x-0 space-x-1 md:items-center items-start justify-between mb-2">
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
        <div className="w-full md:h-8 h-6 bg-gray-200 rounded-md animate-pulse"></div>
      </CardContent>
    </Card>
  );
}

function ListingPageContent() {
  const t = useTranslations('houses');
  const homepageT = useTranslations('homepage');
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const purpose = searchParams.get('purpose');

  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<House[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [price, setPrice] = useState([0, 2000000]);
  const [area, setArea] = useState([0, 10000]);
  const [bedrooms, setBedrooms] = useState<number[]>([]);
  const [bathrooms, setBathrooms] = useState<number[]>([]);
  const [propertyType, setPropertyType] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);

  // Fetch houses on component mount
  useEffect(() => {
    fetchHouses();
  }, [purpose]);

  // Fetch user's favorites if authenticated
  useEffect(() => {
    if (session?.user?.id) {
      fetchFavorites();
    }
  }, [session]);

  // Filter houses when search or filters change
  useEffect(() => {
    filterHouses(houses);
  }, [search, price, area, bedrooms, bathrooms, propertyType, status, houses]);

  const fetchHouses = async () => {
    try {
    setLoading(true);
      let url = '/api/houses';
      if (purpose === 'buy') {
        url += '?status=FOR_SALE';
      } else if (purpose === 'rent') {
        url += '?status=FOR_RENT';
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setHouses(data.data || []);
      } else {
        console.error('Failed to fetch houses:', data.error);
      }
    } catch (error) {
        console.error('Error fetching houses:', error);
    } finally {
        setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      
      if (response.ok) {
        setFavorites(data.data?.map((fav: any) => fav.houseId) || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  function filterHouses(houses: House[]) {
    let filtered = houses.filter(house => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || 
        house.streetAddress.toLowerCase().includes(searchLower) ||
        house.city.toLowerCase().includes(searchLower) ||
        house.state.toLowerCase().includes(searchLower) ||
        house.homeType.toLowerCase().includes(searchLower) ||
        house.bedrooms.toString().includes(searchLower);

      // Price filter
      const matchesPrice = house.price >= price[0] && house.price <= price[1];

      // Area filter
      const matchesArea = house.livingArea >= area[0] && house.livingArea <= area[1];

      // Bedrooms filter
      const matchesBedrooms = bedrooms.length === 0 || bedrooms.includes(house.bedrooms);

      // Bathrooms filter
      const matchesBathrooms = bathrooms.length === 0 || bathrooms.includes(house.bathrooms);

      // Property type filter
      const matchesPropertyType = propertyType.length === 0 || propertyType.includes(house.homeType);

      // Status filter
      const matchesStatus = status.length === 0 || status.includes(house.homeStatus);

      return matchesSearch && matchesPrice && matchesArea && matchesBedrooms && matchesBathrooms && matchesPropertyType && matchesStatus;
    });

    setFiltered(filtered);
  }

  function handleApplyFilters() {
    setFilterDialogOpen(false);
  }

  function handleClearFilters() {
    setPrice([0, 2000000]);
    setArea([0, 10000]);
    setBedrooms([]);
    setBathrooms([]);
    setPropertyType([]);
    setStatus([]);
    setFilterDialogOpen(false);
  }

  const getPageTitle = () => {
    if (purpose === 'buy') return 'Homes for Sale';
    if (purpose === 'rent') return 'Homes for Rent';
    return t('allProperties');
  };

  const toggleFavorite = async (houseId: string) => {
    if (!session?.user?.id) {
      // Redirect to sign in or show sign in modal
      toast.error(t('signInToSaveFavorites'), {
        icon: '🔒',
        duration: 4000,
      });
      return;
    }

    setLoadingFavorites(true);
    const isFavorited = favorites.includes(houseId);

    try {
      if (isFavorited) {
        // Remove from favorites
        await fetch(`/api/favorites?houseId=${houseId}`, {
          method: 'DELETE',
        });
        setFavorites(prev => prev.filter(id => id !== houseId));
        toast.success(t('removedFromFavorites'), {
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
          body: JSON.stringify({ houseId }),
        });
        setFavorites(prev => [...prev, houseId]);
        toast.success(t('addedToFavorites'), {
          icon: '❤️',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(t('failedToUpdateFavorites'), {
        icon: '❌',
        duration: 4000,
      });
    } finally {
      setLoadingFavorites(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto px-4 pt-8">
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[300px] max-w-2xl">
            <Input
              className="w-full h-12 px-6 md:text-base text-sm rounded-sm border-blue-500 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ boxShadow: "0 2px 8px 0 rgba(60,60,60,0.06)" }}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 focus:outline-none"
              tabIndex={-1}
              type="button"
            >
              <Search className="w-7 h-7" />
            </button>
          </div>

          {/* Filter Button and Dialog */}
          <AlertDialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button className="h-12 px-6 text-base text-blue-600 hover:text-blue-800 font-semibold border-blue-500" variant="outline">
                {t('filters')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>{t('filterProperties')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('filterDescription')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              {/* Filter options UI */}
              <div className="space-y-6 py-2">
                {/* Price Range Slider */}
                <div>
                  <label className="block text-sm font-medium mb-1">{t('priceRange')} ($)</label>
                  <Slider min={0} max={2000000} value={price as number[]} onValueChange={setPrice} className="w-full max-w-xs" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{price[0].toLocaleString()}</span>
                    <span>{price[1].toLocaleString()}+</span>
                  </div>
                </div>
                {/* Area Range Slider */}
                <div>
                  <label className="block text-sm font-medium mb-1">{t('areaRange')} (sqft)</label>
                  <Slider min={0} max={10000} value={area as number[]} onValueChange={setArea} className="w-full max-w-xs" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{area[0].toLocaleString()}</span>
                    <span>{area[1].toLocaleString()}+</span>
                  </div>
                </div>
                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t('bedrooms')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <div key={num} className="flex items-center space-x-2">
                        <Checkbox
                          id={`bedroom-${num}`}
                          checked={bedrooms.includes(num)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBedrooms([...bedrooms, num]);
                            } else {
                              setBedrooms(bedrooms.filter(b => b !== num));
                            }
                          }}
                        />
                        <label htmlFor={`bedroom-${num}`} className="text-sm">
                          {num}+
                        </label>
                      </div>
                    ))}
                </div>
                </div>
                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t('bathrooms')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={num} className="flex items-center space-x-2">
                        <Checkbox
                          id={`bathroom-${num}`}
                          checked={bathrooms.includes(num)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setBathrooms([...bathrooms, num]);
                            } else {
                              setBathrooms(bathrooms.filter(b => b !== num));
                            }
                          }}
                        />
                        <label htmlFor={`bathroom-${num}`} className="text-sm">
                          {num}+
                      </label>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t('propertyType')}</label>
                  <RadioGroup value={propertyType[0] || ""} onValueChange={(value) => setPropertyType([value])}>
                    {['Single Family', 'Condo', 'Townhouse', 'Multi-Family'].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={`type-${type}`} />
                        <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                {/* Status */}
                  <div>
                  <label className="block text-sm font-medium mb-2">{t('status')}</label>
                  <RadioGroup value={status[0] || ""} onValueChange={(value) => setStatus([value])}>
                    {['FOR_SALE', 'FOR_RENT'].map((s) => (
                      <div key={s} className="flex items-center space-x-2">
                        <RadioGroupItem value={s} id={`status-${s}`} />
                        <label htmlFor={`status-${s}`} className="text-sm">
                          {s === 'FOR_SALE' ? t('forSale') : t('forRent')}
                        </label>
                      </div>
                    ))}
                    </RadioGroup>
                  </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleClearFilters}>
                  {t('clearFilters')}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleApplyFilters}>
                  {t('applyFilters')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Map */}
          <div className="md:w-1/2 w-full md:h-[calc(100vh-120px)] h-[50vh] rounded-lg overflow-hidden border border-gray-200">
          {(() => {
              let mapCenter: [number, number] = [40.7128, -74.0060]; // Default to NYC
            if (filtered.length > 0) {
              const latSum = filtered.reduce((sum, h) => sum + h.latitude, 0);
              const lngSum = filtered.reduce((sum, h) => sum + h.longitude, 0);
              mapCenter = [latSum / filtered.length, lngSum / filtered.length];
            }
            return !loading ? (
              <StaticMap
                houses={filtered.map((house) => ({
                  id: house.id,
                  title: house.streetAddress,
                  images: house.pictures?.map(p => p.url) || ['/house.jpg'],
                  address: {
                    city: house.city,
                    state: house.state,
                  },
                  location: {
                    lat: house.latitude,
                    lng: house.longitude,
                  },
                }))}
                center={mapCenter}
                zoom={filtered.length === 1 ? 14 : 8}
              />
            ) : (
              <div className="h-full flex items-center justify-center gap-2">
                <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                  <div className="text-gray-400">{t('loadingMap')}</div>
              </div>
            );
          })()}
        </div>
        {/* Right: Grid */}
        <div className="md:w-1/2 w-full flex-1 flex flex-col md:max-h-[calc(100vh-120px)] max-h-fit overflow-y-auto p-3">
          <h2 className="text-2xl font-bold mb-4">Stickball {getPageTitle()}</h2>
          {/* Grid of Houses */}
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              // Show skeleton cards while loading
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index}>
                  <HouseSkeleton />
                </div>
              ))
            ) : (
              // Show actual house cards when loaded
              filtered.map((house) => (
                <div key={house.id} className="group relative">
                  <Card className="!pt-0 pb-0 gap-0 rounded-lg shadow-sm border-0 md:overflow-hidden overflow-visible bg-white h-full flex flex-col hover:scale-101 transition-all duration-300 group-hover:shadow-md">
                    {/* Image Section */}
                    <div className="relative">
                      <Image
                        key={house.pictures?.[0]?.url || house.id}
                        src={house.pictures?.[0]?.url || '/house.jpg'}
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
                            {house.homeStatus === 'RECENTLY_SOLD' ? homepageT('propertyCard.sold') : house.homeStatus}
                        </span>
                      </div>
                      {/* Property Type Badge */}
                      <div className="absolute md:top-1.5 md:right-1.5 top-7 left-1.5">
                        <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                          {house.homeType}
                        </span>
                      </div>
                      {/* Heart Button - Show on hover */}
                      {session?.user?.id && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(house.id);
                          }}
                          disabled={loadingFavorites || house.ownerId === session?.user?.id}
                          className={`absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-1.5 shadow-sm hover:shadow-md ${house.ownerId === session?.user?.id ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                        >
                          <Heart 
                            className={`w-4 h-4 ${favorites.includes(house.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                          />
                        </button>
                      )}
                    </div>
                    {/* Content Section */}
                    <CardContent className="p-3 pb-3">
                      {/* Price */}
                      <div className="flex items-center gap-1 mb-1.5">
                        <div className="text-base font-bold text-blue-700">{house.currency} {house.price.toLocaleString()}</div>
                          <span className="text-xs text-gray-500">/ {house.homeStatus === 'For Rent' ? homepageT('propertyCard.month') : homepageT('propertyCard.total')}</span>
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
                      <div className="grid md:grid-cols-3 grid-cols-1 gap-1 mb-2">
                        <div className="flex md:flex-col flex-row md:space-x-0 space-x-1 justify-center items-center p-1.5 bg-blue-50 rounded-sm group-hover:bg-blue-100 transition-colors">
                          <BedDouble className="w-3 h-3 text-blue-600 md:mb-0.5 mb-0" />
                          <span className="text-xs font-medium text-gray-700">{house.bedrooms}</span>
                            <span className="text-xs text-gray-500">{homepageT('propertyCard.beds')}</span>
                        </div>
                        <div className="flex md:flex-col flex-row md:space-x-0 space-x-1 justify-center items-center p-1.5 bg-green-50 rounded-sm group-hover:bg-green-100 transition-colors">
                          <Bath className="w-3 h-3 text-green-600 md:mb-0.5 mb-0" />
                          <span className="text-xs font-medium text-gray-700">{house.bathrooms}</span>
                            <span className="text-xs text-gray-500">{homepageT('propertyCard.baths')}</span>
                        </div>
                        <div className="flex md:flex-col flex-row md:space-x-0 space-x-1 justify-center items-center p-1.5 bg-purple-50 rounded-sm group-hover:bg-purple-100 transition-colors">
                          <Ruler className="w-3 h-3 text-purple-600 md:mb-0.5 mb-0" />
                          <span className="text-xs font-medium text-gray-700">{house.livingArea.toLocaleString()}</span>
                            <span className="text-xs text-gray-500">{homepageT('propertyCard.sqft')}</span>
                          </div>
                      </div>
                      {/* Location and Date */}
                      <div className="flex md:flex-row flex-col md:space-x-0 space-x-1 md:items-center items-start justify-between mb-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-red-500" />
                          <span className="truncate">{house.city}, {house.state}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-gray-400" />
                            <span>{homepageT('propertyCard.listed')} {new Date(house.datePostedString).toLocaleDateString()}</span>
                          </div>
                      </div>
                      {/* Action Button */}
                      <Button
                        onClick={() => router.push(`/houses/${house.id}`)}
                        className={`w-full text-xs md:text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold md:py-1.5 py-1 !md:h-10 !h-6 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-101 text-xs flex items-center justify-center ${house.homeStatus === 'RECENTLY_SOLD' ? 'opacity-60 cursor-not-allowed' : ''}`}
                        disabled={house.homeStatus === 'RECENTLY_SOLD'}
                      >
                        <Eye className="md:w-2.5 md:h-2.5 w-2 h-2 md:mr-1 mr-0" />
                        {house.homeStatus === 'RECENTLY_SOLD'
                            ? homepageT('propertyCard.sold')
                          : house.homeStatus === 'FOR_RENT'
                              ? homepageT('propertyCard.rentThisHouse')
                              : homepageT('propertyCard.buyThisHouse')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
            {!loading && filtered.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-12 text-lg">{t('noResults')}</div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListingPageContent />
    </Suspense>
  );
}

