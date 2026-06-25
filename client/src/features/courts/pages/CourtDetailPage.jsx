import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import protonImg from '../../../assets/images/ProtonBadmintonCenter.png';
import eliteImg from '../../../assets/images/EliteFootballArena.png';
import CourtHero from '../components/CourtHero';
import CourtInfo from '../components/CourtInfo';
import CourtFacilities from '../components/CourtFacilities';
import CourtSchedule from '../components/CourtSchedule';
import BookingBar from '../components/BookingBar';
import { courtService, bookingService } from '../../../shared/services/api';

function CourtDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [court, setCourt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchCourtDetails = async () => {
      try {
        setIsLoading(true);
        const data = await courtService.getById(id);
        const priceStr = `${data.price_per_hour / 1000}k`;
        const sportKey = data.sport.name === 'Cầu lông' ? 'badminton' : (data.sport.name === 'Pickleball' ? 'pickleball' : (data.sport.name === 'Bóng đá' ? 'football' : 'tennis'));
        setCourt({
          id: data.id,
          name: `${data.venue.name} - ${data.name}`,
          sport: sportKey,
          rating: 4.8,
          reviewCount: 128,
          address: data.venue.address,
          distance: '1.2 km',
          price: priceStr,
          description: data.venue.description || 'Sân chơi thể thao chất lượng cao, trang bị hiện đại.',
          image: data.venue.name.includes('Hoàng Long') ? protonImg : (data.venue.name.includes('Phú Mỹ Hưng') ? eliteImg : null),
          courtCount: 1,
          facilities: { wifi: true, parking: true, shower: true, canteen: true, rental: true },
        });
      } catch (err) {
        console.error("Lỗi lấy thông tin chi tiết sân:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourtDetails();
  }, [id]);

  /* Khi đổi ngày thì xóa khung giờ đã chọn */
  const handleSelectDate = (index) => {
    setSelectedDate(index);
    setSelectedSlot(null);
  };

  const handleBook = async () => {
    if (!selectedSlot || !court) return;
    if (!localStorage.getItem('token')) {
      alert("Vui lòng đăng nhập để thực hiện đặt sân!");
      navigate('/login');
      return;
    }

    try {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() + selectedDate);

      const [startStr, endStr] = selectedSlot.time.split(' - ');
      const [startHour, startMin] = startStr.split(':').map(Number);
      const [endHour, endMin] = endStr.split(':').map(Number);

      const startTime = new Date(dateObj);
      startTime.setHours(startHour, startMin, 0, 0);

      const endTime = new Date(dateObj);
      endTime.setHours(endHour, endMin, 0, 0);

      await bookingService.create({
        court_id: parseInt(id),
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString()
      });

      alert(`Đặt sân thành công: ${court.name} — ${selectedSlot.time}!`);
      navigate('/bookings');
    } catch (err) {
      alert(err.message || 'Đặt sân thất bại, vui lòng thử lại');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center text-gray-500">
        Đang tải thông tin chi tiết sân...
      </div>
    );
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center text-gray-500">
        Không tìm thấy thông tin sân.
      </div>
    );
  }

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
