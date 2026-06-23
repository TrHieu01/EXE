import { Star, MapPin } from 'lucide-react';

const SPORT_BADGE = {
  badminton: { label: 'Cầu lông', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
  football: { label: 'Bóng đá', className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  tennis: { label: 'Tennis', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' },
  pickleball: { label: 'Pickleball', className: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400' },
};

function CourtInfo({ court }) {
  const { name, sport, rating, reviewCount, address, distance, price, description, courtCount } = court;
  const badge = SPORT_BADGE[sport] ?? { label: sport, className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };

  return (
    <div className="px-4 pt-4 pb-5">
      {/* Tên sân và huy hiệu môn thể thao */}
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight flex-1">{name}</h1>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full mt-0.5 ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      {/* Đánh giá */}
      <div className="flex items-center gap-1.5 mt-2.5">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-bold text-gray-900 dark:text-white">{rating}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">({reviewCount} đánh giá)</span>
        {courtCount && (
          <>
            <span className="text-gray-300 dark:text-gray-600 mx-1">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{courtCount} sân</span>
          </>
        )}
      </div>

      {/* Địa chỉ */}
      <div className="flex items-start gap-1.5 mt-2">
        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <span className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{address}</span>
        {distance && (
          <span className="shrink-0 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full ml-auto">
            {distance}
          </span>
        )}
      </div>

      {/* Giá */}
      <div className="flex items-baseline gap-1 mt-3">
        <span className="text-sm text-gray-500 dark:text-gray-400">Từ</span>
        <span className="text-2xl font-bold text-blue-500">{price}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">/giờ</span>
      </div>

      {/* Mô tả */}
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-3">{description}</p>
      )}
    </div>
  );
}

export default CourtInfo;
