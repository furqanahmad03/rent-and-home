"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('hero');
  const { data: session } = useSession();
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push(`/houses?search=${encodeURIComponent(searchText.trim())}`);
    } else {
      router.push("/houses");
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              {t('title')}
            </h1>
            <p className="text-2xl text-slate-800 leading-relaxed max-w-lg">
              {t('subtitle')}
            </p>
          </div>
          {/* Right Side - Image with Overlay */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* House image */}
              <div className="w-full h-[500px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl relative">
                <Image
                  src="/hero-section-image.jpg"
                  alt="Modern house"
                  fill
                  className="object-cover object-top rounded-3xl"
                  priority
                />
                {/* Dark overlay to make text more readable */}
                <div className="absolute inset-0 bg-black/10 rounded-3xl"></div>
              </div>
              {/* Information Overlay */}
              <div className="absolute top-8 right-8 bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 max-w-56 shadow-xl">
                <h3 className="text-white font-bold text-lg mb-3">{t('featuredHouse.title')}</h3>
                <div className="flex items-center text-white text-base">
                  <div className="w-5 h-5 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="font-medium">{t('featuredHouse.address')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Simple Search Bar */}
        <div className="mt-2 max-w-xl">
          <div className="bg-white rounded-md shadow-xl px-6 py-3 flex items-center relative">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none border-none text-lg px-2 py-2"
              disabled={!session}
              placeholder={session ? t('search.placeholder') : t('search.signInRequired')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
            />
            <button
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
              aria-label="Search"
              type="button"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 