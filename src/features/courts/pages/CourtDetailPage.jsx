import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import protonImg from '../../../assets/images/ProtonBadmintonCenter.png';
import eliteImg from '../../../assets/images/EliteFootballArena.png';
import CourtHero from '../components/CourtHero';
import CourtInfo from '../components/CourtInfo';
import CourtFacilities from '../components/CourtFacilities';
import CourtSchedule from '../components/CourtSchedule';
import BookingBar from '../components/BookingBar';

/* Dữ liệu mẫu — thay bằng API thực tế */
const MOCK_COURTS = {
  1: {
    id: 1,
    name: 'Proton Badminton Center',
    sport: 'badminton',
    rating: 4.8,
    reviewCount: 128,
    address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    distance: '1.2 km',
    price: '120k',
    description:
      'Sân cầu lông chuyên nghiệp với 8 sân tiêu chuẩn BWF, hệ thống đèn chiếu sáng hiện đại và bề mặt sàn gỗ chất lượng cao.',
    image: protonImg,
    courtCount: 8,
    facilities: { wifi: true, parking: true, shower: true, canteen: true, rental: true },
  },
  2: {
    id: 2,
    name: 'Elite Football Arena',
    sport: 'football',
    rating: 4.6,
    reviewCount: 94,
    address: '456 Mai Chí Thọ, Quận 2, TP.HCM',
    distance: '2.8 km',
    price: '450k',
    description:
      'Sân bóng đá nhân tạo 7 người với cỏ FIFA Quality Pro, hệ thống tưới nước tự động và phòng thay đồ hiện đại.',
    image: eliteImg,
    courtCount: 4,
    facilities: { wifi: true, parking: true, shower: true, canteen: false, rental: false },
  },
};

function CourtDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const court = MOCK_COURTS[id] ?? MOCK_COURTS[1];

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  /* Khi đổi ngày thì xóa khung giờ đã chọn */
  const handleSelectDate = (index) => {
    setSelectedDate(index);
    setSelectedSlot(null);
  };

  const handleBook = () => {
    if (!selectedSlot) return;
    // TODO: navigate(`/bookings/confirm?court=${court.id}&slot=${selectedSlot.id}`) — chuyển tới xác nhận đặt sân
    alert(`Đặt sân ${court.name} — ${selectedSlot.time} (${selectedSlot.price})`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-44">
      {/* Ảnh bìa + nút quay lại / yêu thích */}
      <CourtHero
        image={court.image}
        name={court.name}
        isFavorite={isFavorite}
        onToggleFavorite={() => setIsFavorite((f) => !f)}
      />

      {/* Tên sân, rating, địa chỉ, giá */}
      <CourtInfo court={court} />

      {/* Tiện ích */}
      <CourtFacilities facilities={court.facilities} />

      {/* Chọn ngày và khung giờ */}
      <CourtSchedule
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        selectedSlot={selectedSlot}
        onSelectSlot={setSelectedSlot}
      />

      {/* Thanh đặt sân cố định dưới cùng */}
      <BookingBar basePrice={court.price} selectedSlot={selectedSlot} onBook={handleBook} />
    </div>
  );
}

export default CourtDetailPage;
