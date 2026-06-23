import { Heart, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CourtHero({ image, name, isFavorite, onToggleFavorite }) {
  const navigate = useNavigate();

  return (
    <div className="relative h-80 bg-gray-900 overflow-hidden">
      {image && (
        <img src={image} alt={name} className="w-full h-full object-cover object-center brightness-110 contrast-105" />
      )}

      {/* Gradient nhẹ phía trên để các nút nổi bật, không che ảnh */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all"
        aria-label="Quay lại"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      {/* Nút yêu thích */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all"
        aria-label="Thêm vào yêu thích"
      >
        <Heart
          className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
        />
      </button>
    </div>
  );
}

export default CourtHero;
