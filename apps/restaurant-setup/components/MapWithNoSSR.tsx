import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default icon issue in leaflet with Next.js
// This is a workaround since leaflet-defaulticon-compatibility is not available
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Set default icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;

interface MapWithNoSSRProps {
  center: [number, number];
  zoom: number;
  address: string;
  mapContainerId?: string;
}

const MapWithNoSSR = ({
  center = [37.7749, -122.4194] as [number, number],
  zoom = 13,
  address = "Default Address",
  mapContainerId = "map",
}: MapWithNoSSRProps) => {
  const mapRef = useRef(null);

  return (
    <div id={mapContainerId} className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
        key={`${center[0]}-${center[1]}-${zoom}`}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={center}>
          <Popup>
            <div>
              <h4 className="font-semibold">Your Restaurant</h4>
              <p className="text-sm">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapWithNoSSR;
