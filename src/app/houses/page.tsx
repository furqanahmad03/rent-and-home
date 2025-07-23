"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, BedDouble, Bath, Ruler, Search, MapPin, Calendar, Eye, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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

const StaticMap = dynamic(() => import("@/components/StaticMap"), { ssr: false });

interface House {
  _id: string;
  zpid?: number;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipcode: string;
    neighborhood?: string | null;
    community?: string | null;
    subdivision?: string | null;
  };
  photos: string[];
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
  daysOnZillow?: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

function formatAddress(address: House["address"]): string {
  return `${address.streetAddress}, ${address.city}, ${address.state}, ${address.zipcode}`;
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

export default function ListingPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Filter dialog state
  const [price, setPrice] = useState<number[]>([0, 2000000]);
  const [area, setArea] = useState<number[]>([0, 10000]);
  const [bedrooms, setBedrooms] = useState<string>("any");
  const [bathrooms, setBathrooms] = useState<string>("any");
  const [homeTypes, setHomeTypes] = useState<string[]>([]);
  const [propertyStatus, setPropertyStatus] = useState<string>("any");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/homes")
      .then((res) => res.json())
      .then((apiData) => {
        const listings = (apiData.data || []).map((item: any) => ({
          _id: item._id || item.zpid || item.id,
          zpid: item.zpid,
          address: {
            streetAddress: item.address?.streetAddress || "",
            city: item.address?.city || "",
            state: item.address?.state || "",
            zipcode: item.address?.zipcode || "",
            neighborhood: item.address?.neighborhood || null,
            community: item.address?.community || null,
            subdivision: item.address?.subdivision || null,
          },
          photos: item.photos || [],
          bedrooms: item.bedrooms || 0,
          bathrooms: item.bathrooms || 0,
          price: item.price || 0,
          yearBuilt: item.yearBuilt || 0,
          longitude: item.longitude || 0,
          latitude: item.latitude || 0,
          homeStatus: item.homeStatus || "",
          description: item.description || "",
          livingArea: item.livingArea || 0,
          currency: item.currency || "USD",
          homeType: item.homeType || "",
          datePostedString: item.datePostedString || item.createdAt || new Date().toISOString(),
          daysOnZillow: item.daysOnZillow,
          url: item.url || "",
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
          __v: item.__v,
        }));
        setHouses(apiData.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching houses:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    let filteredList = houses.filter((h) => {
      return (
        h.address.state.toLowerCase().includes(q) ||
        h.address.city.toLowerCase().includes(q) ||
        h.homeType.toLowerCase().includes(q) ||
        h.price.toString().includes(q) ||
        h.bedrooms.toString().includes(q) ||
        h.bathrooms.toString().includes(q) ||
        h.livingArea.toString().includes(q) ||
        h.address.streetAddress.toLowerCase().includes(q) ||
        h.address.zipcode.toLowerCase().includes(q)
      );
    });
    setFiltered(filteredList);
  }, [search, houses]);

  // Helper: filter houses based on filter state
  function filterHouses(houses: House[]) {
    return houses.filter((h) => {
      // Price
      if (!Array.isArray(price) || price.length !== 2) return true;
      if (h.price < price[0] || h.price > price[1]) return false;
      // Area
      if (!Array.isArray(area) || area.length !== 2) return true;
      if (h.livingArea < area[0] || h.livingArea > area[1]) return false;
      // Bedrooms
      if (bedrooms !== "any" && h.bedrooms < parseInt(bedrooms)) return false;
      // Bathrooms
      if (bathrooms !== "any" && h.bathrooms < parseInt(bathrooms)) return false;
      // Home Type
      if (homeTypes.length > 0 && !homeTypes.includes(h.homeType)) return false;
      // Property Status
      if (propertyStatus !== "any") {
        if (propertyStatus === "for-sale" && h.homeStatus !== "For Sale") return false;
        if (propertyStatus === "for-rent" && h.homeStatus !== "For Rent") return false;
        if (propertyStatus === "sold" && h.homeStatus !== "RECENTLY_SOLD") return false;
      }
      return true;
    });
  }

  // Handle Apply Filters
  function handleApplyFilters() {
    setFiltered(filterHouses(houses));
    setFilterDialogOpen(false);
  }

  // Handle Clear Filters
  function handleClearFilters() {
    setPrice([0, 2000000]);
    setArea([0, 10000]);
    setBedrooms("any");
    setBathrooms("any");
    setHomeTypes([]);
    setPropertyStatus("any");
    setFiltered(houses);
  }

  const getPageTitle = () => {
    // if (purpose === 'rent') return 'Rent properties';
    // if (purpose === 'buy') return 'Buy properties';
    return 'All properties';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mx-auto px-4 pt-8">
        <div className="flex flex-wrap gap-4 items-center mb-6">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[300px] max-w-2xl">
            <Input
              className="w-full h-12 px-6 text-base rounded-sm border-blue-500 shadow-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              placeholder="Search by city, state, property type, bedrooms..."
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
                Filters
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>Filter Properties</AlertDialogTitle>
                <AlertDialogDescription>
                  Select filters to narrow down your property search. (All filter options will be here)
                </AlertDialogDescription>
              </AlertDialogHeader>
              {/* Filter options UI */}
              <div className="space-y-6 py-2">
                {/* Price Range Slider */}
                <div>
                  <label className="block text-sm font-medium mb-1">Price Range ($)</label>
                  <Slider min={0} max={2000000} value={price as number[]} onValueChange={setPrice} className="w-full max-w-xs" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{price[0].toLocaleString()}</span>
                    <span>{price[1].toLocaleString()}+</span>
                  </div>
                </div>
                {/* Area Range Slider */}
                <div>
                  <label className="block text-sm font-medium mb-1">Living Area (sqft)</label>
                  <Slider min={0} max={10000} value={area as number[]} onValueChange={setArea} className="w-full max-w-xs" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{area[0]}</span>
                    <span>{area[1]}+</span>
                  </div>
                </div>
                {/* Bedrooms RadioGroup */}
                <div>
                  <label className="block text-sm font-medium mb-1">Bedrooms</label>
                  <RadioGroup value={bedrooms} onValueChange={setBedrooms} className="flex gap-4">
                    <RadioGroupItem value="any" id="bedrooms-any" />
                    <label htmlFor="bedrooms-any" className="text-sm">Any</label>
                    <RadioGroupItem value="1" id="bedrooms-1" />
                    <label htmlFor="bedrooms-1" className="text-sm">1+</label>
                    <RadioGroupItem value="2" id="bedrooms-2" />
                    <label htmlFor="bedrooms-2" className="text-sm">2+</label>
                    <RadioGroupItem value="3" id="bedrooms-3" />
                    <label htmlFor="bedrooms-3" className="text-sm">3+</label>
                    <RadioGroupItem value="4" id="bedrooms-4" />
                    <label htmlFor="bedrooms-4" className="text-sm">4+</label>
                  </RadioGroup>
                </div>
                {/* Bathrooms RadioGroup */}
                <div>
                  <label className="block text-sm font-medium mb-1">Bathrooms</label>
                  <RadioGroup value={bathrooms} onValueChange={setBathrooms} className="flex gap-4">
                    <RadioGroupItem value="any" id="bathrooms-any" />
                    <label htmlFor="bathrooms-any" className="text-sm">Any</label>
                    <RadioGroupItem value="1" id="bathrooms-1" />
                    <label htmlFor="bathrooms-1" className="text-sm">1+</label>
                    <RadioGroupItem value="2" id="bathrooms-2" />
                    <label htmlFor="bathrooms-2" className="text-sm">2+</label>
                    <RadioGroupItem value="3" id="bathrooms-3" />
                    <label htmlFor="bathrooms-3" className="text-sm">3+</label>
                    <RadioGroupItem value="4" id="bathrooms-4" />
                    <label htmlFor="bathrooms-4" className="text-sm">4+</label>
                  </RadioGroup>
                </div>
                {/* Home Type Checkboxes */}
                <div>
                  <label className="block text-sm font-medium mb-1">Home Type</label>
                  <div className="flex gap-4 flex-wrap">
                    {['House', 'Apartment', 'Condo', 'Townhome', 'Land'].map(type => (
                      <label key={type} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={homeTypes.includes(type)}
                          onCheckedChange={checked => {
                            setHomeTypes(prev => checked ? [...prev, type] : prev.filter(t => t !== type));
                          }}
                        /> {type}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Property Status RadioGroup */}
                <div>
                  <label className="block text-sm font-medium mb-1">Property Status</label>
                  <RadioGroup value={propertyStatus} onValueChange={setPropertyStatus} className="flex gap-4">
                    <RadioGroupItem value="any" id="status-any" />
                    <label htmlFor="status-any" className="text-sm">Any</label>
                    <RadioGroupItem value="for-sale" id="status-for-sale" />
                    <label htmlFor="status-for-sale" className="text-sm">For Sale</label>
                    <RadioGroupItem value="for-rent" id="status-for-rent" />
                    <label htmlFor="status-for-rent" className="text-sm">For Rent</label>
                    <RadioGroupItem value="sold" id="status-sold" />
                    <label htmlFor="status-sold" className="text-sm">Sold</label>
                  </RadioGroup>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <Button variant="secondary" type="button" onClick={handleClearFilters}>Clear Filters</Button>
                <AlertDialogAction asChild>
                  <Button type="button" onClick={handleApplyFilters}>Apply Filters</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 max-w-[1600px] mx-auto px-4 py-8">
        {/* Left: Map */}
        <div className="md:w-[45%] w-full h-[150px] md:h-[calc(100vh-120px)] bg-gray-100 rounded-2xl shadow relative flex items-center justify-center overflow-hidden md:sticky md:top-8 md:self-start">
          {/* Calculate the centroid of filtered houses for map center */}
          {(() => {
            let mapCenter: [number, number] = [39.8283, -98.5795];
            if (filtered.length > 0) {
              const latSum = filtered.reduce((sum, h) => sum + h.latitude, 0);
              const lngSum = filtered.reduce((sum, h) => sum + h.longitude, 0);
              mapCenter = [latSum / filtered.length, lngSum / filtered.length];
            }
            return !loading ? (
              <StaticMap
                houses={filtered.map((house) => ({
                  id: house._id,
                  title: house.address.streetAddress,
                  images: house.photos,
                  address: {
                    city: house.address.city,
                    state: house.address.state,
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
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <div className="text-gray-400">Loading map...</div>
              </div>
            );
          })()}
        </div>
        {/* Right: Grid */}
        <div className="flex-1 flex flex-col max-h-[calc(100vh-120px)] overflow-y-auto p-3">
          <h2 className="text-2xl font-bold mb-4">Stickball {getPageTitle()}</h2>
          {/* Grid of Houses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Link key={house._id} href={`/houses/${house._id}`} className="block group">
                  <Card className="min-w-[300px] !pt-0 pb-0 gap-0 rounded-lg shadow-sm border-0 overflow-hidden bg-white h-full flex flex-col hover:scale-101 transition-all duration-300 group-hover:shadow-md">
                    {/* Image Section */}
                    <div className="relative">
                      <img
                        src={house.photos[0]}
                        alt={house.address.streetAddress}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => (e.currentTarget.src = "/house.jpg")}
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
                          {house.address.streetAddress}
                        </div>
                        <div className="text-xs text-gray-700">
                          {house.address.city}, {house.address.state} {house.address.zipcode}
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
                          <span className="truncate">{house.address.city}, {house.address.state}</span>
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
                          : house.homeStatus === 'For Rent'
                            ? 'Rent this house'
                            : 'Buy this house'}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12 text-lg">No properties found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

