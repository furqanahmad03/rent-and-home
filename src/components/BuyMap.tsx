"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from 'next-intl';

interface House {
  id: string;
  title: string;
  currency: string;
  price: number;
  address: {
    city: string;
    state: string;
  };
  location: {
    lat: number;
    lng: number;
  };
}

interface BuyMapProps {
  houses: House[];
  defaultCenter: [number, number];
  onMarkerClick: (id: string) => void;
}

export default function BuyMap({ houses, defaultCenter, onMarkerClick }: BuyMapProps) {
  const t = useTranslations('houses.detail');
  
  return (
    <MapContainer
      center={defaultCenter}
      zoom={6}
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
          eventHandlers={{
            click: () => onMarkerClick(house.id),
          }}
        >
          <Popup>
            <div className="font-semibold">{house.title}</div>
            <div>
              {house.address.city}, {house.address.state}
            </div>
            <div className="text-blue-700 font-bold mt-1">
              {house.currency} {house.price.toLocaleString()}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
