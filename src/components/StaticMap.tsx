"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

interface House {
  id: string;
  title: string;
  images: string[];
  address: {
    city: string;
    state: string;
  };
  location: {
    lat: number;
    lng: number;
  };
}

interface StaticMapProps {
  houses: House[];
  center?: [number, number];
  zoom?: number;
}

const pinSvgString = encodeURIComponent(
  renderToStaticMarkup(
    <MapPin color="#2563eb" fill="#60a5fa" width={36} height={36} />
  )
);
const pinIcon = new L.Icon({
  iconUrl: `data:image/svg+xml,${pinSvgString}`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

export default function StaticMap({ houses, center, zoom }: StaticMapProps) {
  const mapCenter = center || [39.8283, -98.5795];
  const mapZoom = zoom || 4;
  const router = useRouter();
  const t = useTranslations('houses.detail');
  
  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {houses.map((house) => (
        <Marker
          key={house.id}
          position={[house.location.lat, house.location.lng]}
          icon={pinIcon}
        >
          <Popup>
            <div>
              <img
                src={house.images[0] || "/house.jpg"}
                alt={house.title}
                style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8 }}
              />
              <div className="font-semibold mt-2">{house.title}</div>
              <div>
                {house.address.city}, {house.address.state}
              </div>
              <button
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => router.push(`/houses/${house.id}`)}
              >
                {t('viewDetails')}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 