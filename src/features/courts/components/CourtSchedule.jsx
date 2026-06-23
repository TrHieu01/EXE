import { Check } from 'lucide-react';
import notCheckImg from '../../../assets/svgs/not_check.svg';

/* Nhóm khung giờ theo buổi */
const SLOT_GROUPS = [
  {
    label: 'MORNING SLOTS',
    slots: [
      { id: 's1', time: '06:00 - 07:00', price: '120,000 VND', priceNum: 120000 },
      { id: 's2', time: '07:00 - 08:00', price: '120,000 VND', priceNum: 120000 },
      { id: 's3', time: '09:00 - 10:00', price: '80,000 VND', priceNum: 80000 },
      { id: 's4', time: '10:00 - 11:00', price: '120,000 VND', priceNum: 120000 },
    ],
  },
  {
    label: 'AFTERNOON SLOTS',
    slots: [
      { id: 's5', time: '13:00 - 14:00', price: '150,000 VND', priceNum: 150000 },
      { id: 's6', time: '14:00 - 15:00', price: '150,000 VND', priceNum: 150000 },
      { id: 's7', time: '15:00 - 16:00', price: '150,000 VND', priceNum: 150000 },
      { id: 's8', time: '16:00 - 17:00', price: '150,000 VND', priceNum: 150000 },
    ],
  },
  {
    label: 'PRIME TIME (EVENING)',
    slots: [
      { id: 's9',  time: '18:00 - 19:00', price: '220,000 VND', priceNum: 220000 },
      { id: 's10', time: '19:00 - 20:00', price: '220,000 VND', priceNum: 220000 },
      { id: 's11', time: '20:00 - 21:00', price: '220,000 VND', priceNum: 220000 },
    ],
  },
];

/* Slot nào bị đặt rồi theo từng ngày */
const BOOKED_PATTERN = [
  ['s2', 's6', 's10'],
  ['s1', 's5', 's9'],
  ['s3', 's7', 's11'],
  ['s2', 's8', 's10'],
  ['s4', 's6', 's9'],
  ['s1', 's7', 's11'],
  ['s3', 's5', 's10'],
];

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

function generateDates() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      dayName: i === 0 ? 'Hôm nay' : DAY_NAMES[d.getDay()],
      day: d.getDate(),
      month: d.getMonth() + 1,
    };
  });
}

/* Trả về danh sách slot kèm trạng thái available */
function getSlotsForDate(dateIndex) {
  const booked = new Set(BOOKED_PATTERN[dateIndex % 7]);
  return SLOT_GROUPS.map((group) => ({
    ...group,
    slots: group.slots.map((s) => ({ ...s, available: !booked.has(s.id) })),
  }));
}

/* Card một khung giờ */
function SlotCard({ slot, isSelected, onSelect }) {
  /* Đã hết chỗ */
  if (!slot.available) {
    return (
      <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-bold text-gray-300 dark:text-gray-600">{slot.time}</p>
          <img src={notCheckImg} alt="Hết chỗ" className="w-5 h-5 shrink-0 mt-0.5" />
        </div>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Sold Out</p>
      </div>
    );
  }

  /* Đang được chọn */
  if (isSelected) {
    return (
      <button
        onClick={() => onSelect(null)}
        className="p-3.5 rounded-2xl bg-[#CDFF00] border-2 border-[#CDFF00] text-left w-full active:scale-95 transition-transform"
      >
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-bold text-gray-900">{slot.time}</p>
          {/* Badge SELECTED */}
          <span className="shrink-0 flex items-center gap-0.5 bg-gray-900/15 px-1.5 py-0.5 rounded-full">
            <Check className="w-3 h-3 text-gray-900" strokeWidth={3} />
            <span className="text-[9px] font-black text-gray-900 tracking-wide">SELECTED</span>
          </span>
        </div>
        <p className="text-xs font-semibold text-gray-800 mt-1">{slot.price}</p>
      </button>
    );
  }

  /* Có thể chọn */
  return (
    <button
      onClick={() => onSelect(slot)}
      className="p-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-left w-full hover:border-blue-400 dark:hover:border-blue-500 active:scale-95 transition-all"
    >
      <div className="flex items-start justify-between gap-1">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{slot.time}</p>
        {/* Vòng tròn radio */}
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 shrink-0 mt-0.5" />
      </div>
      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1">{slot.price}</p>
    </button>
  );
}

function CourtSchedule({ selectedDate, onSelectDate, selectedSlot, onSelectSlot }) {
  const dates = generateDates();
  const groups = getSlotsForDate(selectedDate);

  return (
    <div className="px-4 py-5">
      <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Chọn khung giờ</h2>

      {/* Thanh chọn ngày cuộn ngang */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {dates.map((date, i) => (
          <button
            key={i}
            onClick={() => onSelectDate(i)}
            className={`shrink-0 flex flex-col items-center px-4 py-2.5 rounded-2xl transition-colors min-w-[60px] ${
              selectedDate === i
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-[11px] font-medium">{date.dayName}</span>
            <span className="text-lg font-bold leading-tight">{date.day}</span>
            <span className={`text-[10px] ${selectedDate === i ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
              /{date.month}
            </span>
          </button>
        ))}
      </div>

      {/* Nhóm khung giờ */}
      {groups.map((group) => (
        <div key={group.label} className="mt-5">
          <p className="text-[11px] font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            {group.label}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {group.slots.map((slot) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                isSelected={selectedSlot?.id === slot.id}
                onSelect={onSelectSlot}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourtSchedule;
