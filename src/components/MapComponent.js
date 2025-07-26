import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: '/images/my-pin.png', 
  iconSize: [40, 40], 
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const MapComponent = () => {
  const position = [19.059470, 72.849351]; // Set your coordinates

  return (
    <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={customIcon}>
          <Popup>Rajvog📍</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;



