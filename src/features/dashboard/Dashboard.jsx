import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Moon, Sun, LogIn } from 'lucide-react';
import gpsImg from '../../assets/images/gps.svg';
import arrowDownImg from '../../assets/images/arrow_down.svg';
import notificationImg from '../../assets/images/notification.svg';
import searchImg from '../../assets/images/search.svg';
import CourtCard from './components/CourtCard';
import MatchCard from './components/MatchCard';
import badmintonImg from '../../assets/images/badminton.svg';
import footballImg from '../../assets/images/football.svg';
import pickleballImg from '../../assets/images/pickleball.svg';
import tennisImg from '../../assets/images/tennis.svg';
import protonImg from '../../assets/images/ProtonBadmintonCenter.png';
import eliteImg from '../../assets/images/EliteFootballArena.png';
// import { courtService, matchService } from '../../shared/services/api';

/* ─── Mock Data (replace with API calls) ─── */

const MOCK_FLASH_DEALS = [
  {
    id: 1,
    tag: 'HAPPY HOUR',
    tagStyle: 'bg-[#CDFF00] text-gray-900',
    headline: '40% OFF Weekday Mornings',
    bgClass: 'bg-[#0D1117]',
    watermark: 'HAPPY HOUR',
  },
  {
    id: 2,
    tag: 'LIMITED TIME',
    tagStyle: 'bg-green-600 text-white',
    headline: 'Book First Go Free',
    bgClass: 'bg-[#0A2010]',
    watermark: 'LIMITED TIME',
  },
];

const MOCK_SPORTS = [
  { id: 1, name: 'Badminton', image: badmintonImg },
  { id: 2, name: 'Football', image: footballImg },
  { id: 3, name: 'Pickleball', image: pickleballImg },
  { id: 4, name: 'Tennis', image: tennisImg },
];

const MOCK_COURTS = [
  {
    id: 1,
    name: 'Proton Badminton Center',
    rating: 4.8,
    distance: '1.2 km',
    district: 'Quận 7',
    price: '120k/h',
    sport: 'badminton',
    image: protonImg,
  },
  {
    id: 2,
    name: 'Elite Football Arena',
    rating: 4.6,
    distance: '2.8 km',
    district: 'Quận 2',
    price: '450k/h',
    sport: 'football',
    image: eliteImg,
  },
];

const MOCK_MATCHES = [
  {
    id: 1,
    userName: 'Minh Tran',
    level: 'INTERMEDIATE',
    sport: 'Badminton',
    time: 'Today, 19:00',
    avatarBadge: 'B',
  },
  {
    id: 2,
    userName: 'Lan Nguyen',
    level: 'PRO',
    sport: 'Pickleball',
    time: 'Tomorrow, 07:00',
    avatarBadge: 'P',
  },
];

/* ─── Component ─── */

function Dashboard() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSport, setSelectedSport] = useState(null);
  const [currentLocation] = useState('Hồ Chí Minh');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
    // TODO: courtService.getAll({ search: keyword, sport: selectedSport })
  };

  const handleFilterSport = (sportId) => {
    const next = sportId === selectedSport ? null : sportId;
    setSelectedSport(next);
    // TODO: courtService.getAll({ sport: next })
  };

  const handleBookCourt = (courtId) => {
    // TODO: navigate(`/courts/${courtId}/book`)
    console.log('Book court:', courtId);
  };

  const handleJoinMatch = (matchId) => {
    // TODO: matchService.join(matchId).then(...)
    console.log('Join match:', matchId);
  };

  const handleCreateMatch = () => {
    // TODO: navigate('/matches/create')
    console.log('Create match');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">

      {/* ── Header ── */}
      <header className="sticky top-0 bg-white dark:bg-gray-900 z-40 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          {/* Location selector */}
          <button className="flex items-center gap-1.5">
            <img src={gpsImg} alt="location" className="w-4 h-4 shrink-0" />
            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{currentLocation}</span>
            <img src={arrowDownImg} alt="expand" className="w-3.5 h-3.5 dark:invert" />
          </button>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(d => !d)}
              className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-yellow-400" />
                : <Moon className="w-4 h-4 text-gray-600" />
              }
            </button>

            {/* Notification */}
            <button className="relative p-1">
              <img src={notificationImg} alt="notifications" className="w-5 h-5 dark:invert" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900" />
            </button>

            {/* Login button */}
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-2.5 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>

            {/* User avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold select-none">U</span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2.5">
          <img src={searchImg} alt="search" className="w-4 h-4 shrink-0 opacity-40 dark:invert" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search sports, courts or areas..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
          />
        </div>
      </header>

      <div className="px-4 pt-5 space-y-7">

        {/* ── Flash Deals ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg">Flash Deals</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">See All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {MOCK_FLASH_DEALS.map((deal) => (
              <div
                key={deal.id}
                className={`shrink-0 w-72 h-40 ${deal.bgClass} rounded-2xl p-4 flex flex-col justify-end relative overflow-hidden cursor-pointer`}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span className="text-white/[0.07] text-6xl font-black tracking-widest whitespace-nowrap">
                    {deal.watermark}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full w-fit mb-2 ${deal.tagStyle}`}>
                  {deal.tag}
                </span>
                <p className="text-white font-bold text-sm leading-snug">{deal.headline}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Sports Categories ── */}
        <section>
          <div className="flex justify-around">
            {MOCK_SPORTS.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleFilterSport(sport.id)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${selectedSport === sport.id
                    ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500'
                    : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <img src={sport.image} alt={sport.name} className="w-8 h-8 object-contain" />
                </div>
                <span className={`text-xs font-medium ${selectedSport === sport.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {sport.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Nearby Courts ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg">Nearby Courts</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">View Map</button>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_COURTS.map((court) => (
              <CourtCard key={court.id} court={court} onBook={handleBookCourt} />
            ))}
          </div>
        </section>

        {/* ── Join a Match ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg">Join a Match</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">View All</button>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_MATCHES.map((match) => (
              <MatchCard key={match.id} match={match} onJoin={handleJoinMatch} />
            ))}
          </div>
        </section>

      </div>

      {/* ── Floating Action Button ── */}
      <button
        onClick={handleCreateMatch}
        className="fixed bottom-20 right-5 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-blue-600/40 hover:bg-blue-500 active:scale-95 transition-all z-40"
        aria-label="Tạo trận mới"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}

export default Dashboard;
