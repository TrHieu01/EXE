import wifiImg from '../../../assets/svgs/wifi.svg';
import parkingImg from '../../../assets/svgs/parking.svg';
import showerImg from '../../../assets/svgs/shower.svg';
import canteenImg from '../../../assets/svgs/canteen.svg';
import rentalImg from '../../../assets/svgs/rental.svg';

const FACILITY_LIST = [
  { key: 'wifi', label: 'WiFi', icon: wifiImg },
  { key: 'parking', label: 'Bãi đỗ xe', icon: parkingImg },
  { key: 'shower', label: 'Phòng tắm', icon: showerImg },
  { key: 'canteen', label: 'Căng-tin', icon: canteenImg },
  { key: 'rental', label: 'Thiết bị', icon: rentalImg },
];

function CourtFacilities({ facilities }) {
  return (
    <div className="px-4 py-5">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Tiện ích</h2>

      <div className="flex justify-between gap-2">
        {FACILITY_LIST.map(({ key, label, icon }) => {
          const available = facilities?.[key] ?? false;
          return (
            <div key={key} className={`flex flex-col items-center gap-2 ${!available ? 'opacity-35' : ''}`}>
              {/* Hộp icon dạng vuông bo tròn */}
              <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <img src={icon} alt={label} className="w-7 h-7 object-contain" />
              </div>
              <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 text-center leading-tight">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CourtFacilities;
