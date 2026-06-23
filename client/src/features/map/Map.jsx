import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Sửa lỗi icon của leaflet mặc định bị mất khi deploy bằng Webpack/Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Dữ liệu mock các sân thể thao (HCM)
const MOCK_COURTS = [
  { id: 1, name: 'Proton Badminton Center', lat: 10.772622, lng: 106.670172, sport: 'Badminton', address: 'Quận 10, TP.HCM' },
  { id: 2, name: 'Elite Football Arena', lat: 10.752622, lng: 106.650172, sport: 'Football', address: 'Quận 5, TP.HCM' },
  { id: 3, name: 'Tennis Masters Court', lat: 10.768622, lng: 106.640172, sport: 'Tennis', address: 'Quận 11, TP.HCM' },
  { id: 4, name: 'Pickleball Central', lat: 10.782622, lng: 106.680172, sport: 'Pickleball', address: 'Quận 3, TP.HCM' },
];

const HCM_CENTER = [10.762622, 106.660172];

// Component dùng để di chuyển map tới vị trí người dùng
function LocationMarker({ userPos }) {
  const map = useMap();
  useEffect(() => {
    if (userPos) {
      map.flyTo(userPos, 14);
    }
  }, [userPos, map]);

  return userPos === null ? null : (
    <Marker position={userPos}>
      <Popup>Bạn đang ở đây</Popup>
    </Marker>
  );
}

function MapPage() {
  const [userPosition, setUserPosition] = useState(HCM_CENTER);
  
  useEffect(() => {
    // Xin quyền vị trí khi vào trang Map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location: ", error);
          // Mặc định vẫn ở HCM_CENTER nếu user từ chối
        }
      );
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 pb-16">
      <header className="px-4 py-4 bg-white dark:bg-gray-900 shadow-sm z-20">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bản đồ địa điểm</h1>
        <p className="text-sm text-gray-500">Tìm kiếm sân thể thao gần bạn nhất</p>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative z-10">
        <MapContainer 
          center={userPosition} 
          zoom={13} 
          scrollWheelZoom={true} 
          className="h-full w-full"
        >
          {/* Layer bản đồ miễn phí từ OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Vị trí người dùng */}
          <LocationMarker userPos={userPosition} />

          {/* Cắm cờ các sân thể thao */}
          {MOCK_COURTS.map((court) => (
            <Marker key={court.id} position={[court.lat, court.lng]}>
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-sm mb-1">{court.name}</h3>
                  <p className="text-xs text-gray-600 mb-1">Môn: {court.sport}</p>
                  <p className="text-xs text-gray-500">{court.address}</p>
                  <button className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 w-full">
                    Xem chi tiết
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapPage;
