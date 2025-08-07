import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { GrHome } from "react-icons/gr";
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('footer');
  
  return (
    <footer className={cn("relative w-full px-20 bg-white border-t border-gray-200 pt-8 pb-0 flex flex-col items-center text-center z-10")}>  
      {/* Legal/Disclaimer Section */}
      <div className="text-sm max-w-5xl mx-auto px-4 text-gray-500 text-base mb-6">
        <p>
            Stickball Group is committed to ensuring digital accessibility for individuals with disabilities. We are continuously working to improve the accessibility of our
            web experience for everyone, and we welcome feedback and accommodation requests. If you wish to report an issue or seek an accommodation, please
        </p>
        <Link href="#" className="text-blue-600 underline">
            Let us know
        </Link>
      </div>

      <div className="text-sm max-w-5xl mx-auto px-4 text-gray-500 text-base mb-6">
        <p>
        Stickball, Inc. holds real estate brokerage <Link href="#">licenses</Link> in multiple states. Stickball (Canada), Inc. holds real estate brokerage licenses in multiple provinces.
        </p>
        <Link href="#" className="text-blue-600 underline">
            § 442-H New York Standard Operating Procedures
        </Link>
        <Link href="#" className="text-blue-600 underline">
            § 442-H New York Fair Housing Notice
        </Link>
        <p>
            TREC: <Link href="#" className="text-blue-600 underline">Information about brokerage services, Consumer protection notice</Link>
        </p>
        <p className="mb-4">California DRE #1522444</p>
        <Link href="#" className="text-blue-600 underline text-base">Contact Stickball, Inc. Brokerage</Link>
      </div>


      <div className="text-sm max-w-5xl mx-auto px-4 text-gray-500 text-base my-6">
        <p>
            For listings in Canada, the trademarks REALTOR®, REALTORS®, and the REALTOR® logo are controlled by The Canadian Real Estate Association (CREA) and
            identify real estate professionals who are members of CREA. The trademarks MLS®, Multiple Listing Service® and the associated logos are owned by CREA
            and identify the quality of services provided by real estate professionals who are members of CREA. Used under license.
        </p>
      </div>
      {/* Main Footer Row */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
        <span className="font-bold text-4xl text-blue-700 flex items-center gap-2">
          Rent&Home
        </span>
        <span className="italic text-2xl text-gray-700 ml-2">Follow US:</span>
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
