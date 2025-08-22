import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { GrHome } from "react-icons/gr";
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  
  return (
    <footer className={cn("relative w-full md:px-20 px-4 bg-white border-t border-gray-200 pt-8 pb-0 flex flex-col items-center text-center z-10")}>  
      {/* Legal/Disclaimer Section */}
      <div className="text-sm max-w-5xl mx-auto px-4 text-gray-500 text-base mb-6">
        <p>
          {t('accessibilityDescription')}. {t('letUsKnow')}
        </p>
      </div>

      <div className="text-sm max-w-5xl mx-auto px-4 text-gray-500 text-base mb-6">
        <p>
          {t('brokerageInfo')}
        </p>
        <p>
          {t('newYorkProcedures')}
        </p>
        <p>
          {t('newYorkHousing')}
        </p>
        <p>
          {t('trecInfo')}
        </p>
        <p className="mb-4">{t('californiaDre')}</p>
        <p className="underline text-base">{t('contactBrokerage')}</p>
      </div>

      <div className="text-sm max-w-5xl mx-auto px-4 text-gray-500 text-base my-6">
        <p>
          {t('canadaInfo')}
        </p>
      </div>
      {/* Main Footer Row */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
        <span className="font-bold text-4xl text-blue-700 flex items-center gap-2">
          Rent&Home
        </span>
        <span className="italic text-2xl text-gray-700 ml-2">{t('followUs')}</span>
        <div className="flex gap-3 text-3xl ml-2">
          <a href="#" aria-label="Facebook" className="hover:text-blue-600"><FaFacebook /></a>
          <span className="text-gray-400">-</span>
          <a href="#" aria-label="Instagram" className="hover:text-pink-500"><FaInstagram /></a>
          <span className="text-gray-400">-</span>
          <a href="#" aria-label="Twitter" className="hover:text-blue-400"><FaTwitter /></a>
        </div>
        <span className="italic text-2xl text-gray-700 ml-2">{t('copyright')}</span>
        <span className="ml-1 text-blue-700 text-4xl"><GrHome /></span>
        {/* Optionally, add a house icon or SVG here if needed */}
      </div>
      {/* Footer SVG Decorative */}
      <div className="w-full overflow-hidden mt-2">
        <img src="/footer.svg" alt="Footer Decorative" className="w-full h-auto object-cover select-none pointer-events-none" draggable="false" />
      </div>
    </footer>
  )
}

export default Footer;
