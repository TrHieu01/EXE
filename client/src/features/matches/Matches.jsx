import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogIn, Sparkles, LogOut, Crown, X } from 'lucide-react';
import gpsImg from '../../assets/svgs/gps.svg';
import arrowDownImg from '../../assets/svgs/arrow_down.svg';
import notificationImg from '../../assets/svgs/notification.svg';
import searchImg from '../../assets/svgs/search.svg';
import badmintonImg from '../../assets/icons/badminton.png';
import footballImg from '../../assets/icons/football.png';
import pickleballImg from '../../assets/icons/pickelball.png';
import tennisImg from '../../assets/icons/tennis.png';
import { authService, matchService, courtService } from '../../shared/services/api';

/* ─── Danh mục môn thể thao ─── */

const MOCK_SPORTS = [
  { id: 1, name: 'Badminton', image: badmintonImg, key: 'badminton' },
  { id: 2, name: 'Football', image: footballImg, key: 'football' },
  { id: 3, name: 'Pickleball', image: pickleballImg, key: 'pickleball' },
  { id: 4, name: 'Tennis', image: tennisImg, key: 'tennis' },
];

/* ─── Dữ liệu mẫu – các phòng đang mở ─── */

const LEVEL_STYLES = {
  BEGINNER: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400',
  INTERMEDIATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
  ADVANCED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400',
  PRO: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
};

const BORDER_COLORS = {
  BEGINNER: 'border-green-500',
  INTERMEDIATE: 'border-blue-500',
  ADVANCED: 'border-orange-400',
  PRO: 'border-red-500',
};

const AVATAR_COLORS = {
  B: 'bg-blue-500',
  P: 'bg-purple-500',
  M: 'bg-green-500',
  L: 'bg-pink-500',
  T: 'bg-teal-500',
  D: 'bg-amber-500',
  H: 'bg-indigo-500',
  K: 'bg-rose-500',
};

/* ─── Room Card ─── */

function RoomCard({ room, onJoin, onLeave, currentUserId }) {
  const { id, hostName, level, sportLabel, time, avatarBadge, players, participants } = room;
  const slotsLeft = players.max - players.current;

  // Kiểm tra xem người dùng hiện tại đã tham gia trận đấu chưa
  const isJoined = participants.some(p => p.user_id === currentUserId && p.status === 'APPROVED');
  const isHost = participants.some(p => p.user_id === currentUserId && p.role === 'HOST');

  return (
    <div
      className={`flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-l-4 ${BORDER_COLORS[level] ?? 'border-gray-400'}`}
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${AVATAR_COLORS[avatarBadge] ?? 'bg-gray-500'}`}
      >
        <span className="text-white font-bold text-sm select-none">{avatarBadge}</span>
      </div>

      {/* Thông tin */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-900 dark:text-white font-semibold text-sm">{hostName}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${LEVEL_STYLES[level] ?? 'bg-gray-100 text-gray-600'}`}>
            {level}
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
          {sportLabel} • {time}
        </p>
        <p className={`text-[11px] mt-0.5 ${slotsLeft <= 1 ? 'text-red-500 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
          {players.current}/{players.max} players {slotsLeft <= 1 && '• Almost full!'}
        </p>
      </div>

      {/* Nút tác vụ */}
      {isHost ? (
        <span className="shrink-0 text-xs text-blue-600 dark:text-blue-400 font-bold px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          Host
        </span>
      ) : isJoined ? (
        <button
          onClick={() => onLeave?.(id)}
          className="shrink-0 bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400 text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-200 transition-all active:scale-95"
        >
          Leave
        </button>
      ) : (
        <button
          onClick={() => onJoin?.(id)}
          disabled={slotsLeft <= 0}
          className="shrink-0 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Join
        </button>
      )}
    </div>
  );
}

/* ─── Component chính ─── */

function Matches() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSport, setSelectedSport] = useState(null);
  const [currentLocation] = useState('Hồ Chí Minh');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // States động liên kết API
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });
  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);

  // States cho modal tạo trận mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courtsList, setCourtsList] = useState([]);
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const [newMatch, setNewMatch] = useState({
    title: '',
    description: '',
    sport_id: 1,
    court_id: null,
    required_level: 'Intermediate',
    start_time: '',
    end_time: '',
    max_players: 4
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch (err) {
        console.error("Lỗi lấy thông tin cá nhân:", err);
      }
    };
    if (localStorage.getItem('token')) {
      fetchUser();
    }
  }, []);

  const loadMatches = async () => {
    setIsLoadingRooms(true);
    try {
      const data = await matchService.getAll();
      const mapped = data.map(m => {
        const hostName = m.host.profile?.full_name || m.host.email;
        const sportKey = m.sport.name === 'Cầu lông' ? 'badminton' : (m.sport.name === 'Pickleball' ? 'pickleball' : (m.sport.name === 'Bóng đá' ? 'football' : 'tennis'));
        return {
          id: m.id,
          hostName: hostName,
          level: m.required_level.toUpperCase(),
          sport: sportKey,
          sportLabel: m.sport.name,
          time: new Date(m.start_time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
          avatarBadge: hostName.charAt(0).toUpperCase(),
          players: { 
            current: m.participants.filter(p => p.status === 'APPROVED').length, 
            max: m.max_players 
          },
          participants: m.participants
        };
      });
      setRooms(mapped);
    } catch (err) {
      console.error("Lỗi lấy danh sách trận đấu:", err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const loadCourts = async () => {
    try {
      const data = await courtService.getAll();
      setCourtsList(data);
    } catch (err) {
      console.error("Lỗi tải danh sách sân:", err);
    }
  };

  useEffect(() => {
    loadMatches();
    loadCourts();
  }, []);

  const handleFilterSport = (sportId) => {
    const next = sportId === selectedSport ? null : sportId;
    setSelectedSport(next);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleJoin = async (roomId) => {
    if (!user) {
      alert("Vui lòng đăng nhập để tham gia trận đấu!");
      navigate('/login');
      return;
    }
    try {
      await matchService.join(roomId);
      alert("Tham gia trận đấu thành công!");
      loadMatches();
    } catch (err) {
      alert(err.message || "Không thể tham gia trận đấu");
    }
  };

  const handleLeave = async (roomId) => {
    if (!user) return;
    try {
      await matchService.leave(roomId);
      alert("Đã rời trận đấu thành công!");
      loadMatches();
    } catch (err) {
      alert(err.message || "Không thể rời trận đấu");
    }
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsCreatingMatch(true);
    try {
      const data = {
        title: newMatch.title,
        description: newMatch.description || null,
        sport_id: newMatch.sport_id,
        court_id: newMatch.court_id,
        required_level: newMatch.required_level,
        start_time: new Date(newMatch.start_time).toISOString(),
        end_time: new Date(newMatch.end_time).toISOString(),
        max_players: newMatch.max_players
      };
      await matchService.create(data);
      alert("Tạo trận đấu giao lưu thành công!");
      setIsModalOpen(false);
      // Reset form
      setNewMatch({
        title: '',
        description: '',
        sport_id: 1,
        court_id: null,
        required_level: 'Intermediate',
        start_time: '',
        end_time: '',
        max_players: 4
      });
      loadMatches();
    } catch (err) {
      alert(err.message || "Không thể tạo trận đấu");
    } finally {
      setIsCreatingMatch(false);
    }
  };

  /* Lọc rooms theo môn thể thao */
  const selectedSportKey = selectedSport
    ? MOCK_SPORTS.find((s) => s.id === selectedSport)?.key
    : null;

  const filteredRooms = selectedSportKey
    ? rooms.filter((r) => r.sport === selectedSportKey)
    : rooms;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-24">

      {/* ── Thanh tiêu đề — giống Home ── */}
      <header className="sticky top-0 bg-white dark:bg-gray-900 z-40 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          {/* Chọn vị trí */}
          <button className="flex items-center gap-1.5">
            <img src={gpsImg} alt="location" className="w-4 h-4 shrink-0" />
            <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{currentLocation}</span>
            <img src={arrowDownImg} alt="expand" className="w-3.5 h-3.5 dark:invert" />
          </button>

          {/* Các icon bên phải */}
          <div className="flex items-center gap-2">
            {/* Chuyển đổi giao diện sáng/tối */}
            <button
              onClick={() => setIsDark((d) => !d)}
              className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark
                ? <Sun className="w-4 h-4 text-yellow-400" />
                : <Moon className="w-4 h-4 text-gray-600" />
              }
            </button>

            {/* Thông báo */}
            <button className="relative p-1">
              <img src={notificationImg} alt="notifications" className="w-5 h-5 dark:invert" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900" />
            </button>

            {/* Nút Premium */}
            <button className="relative overflow-hidden group bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-[0_0_15px_rgba(234,179,8,0.4)] hover:scale-105 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium</span>
              <div className="absolute inset-0 w-[200%] -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer pointer-events-none"></div>
            </button>

            {/* Nút đăng nhập hoặc avatar */}
            {!user ? (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-2.5 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 hover:ring-2 hover:ring-blue-500 transition-all"
                >
                  <span className="text-white text-xs font-bold select-none">
                    {(user.profile?.full_name || user.email).charAt(0).toUpperCase()}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 text-white text-lg font-bold">
                          {(user.profile?.full_name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white leading-tight">
                            {user.profile?.full_name || 'Người dùng'}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]">{user.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Sport Levels</h5>
                        
                        {user.sports && user.sports.length > 0 ? (
                          user.sports.map(us => (
                            <div key={us.id} className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                {us.sport.icon_url ? (
                                  <img src={us.sport.icon_url} alt={us.sport.name} className="w-5 h-5 rounded-md object-contain" />
                                ) : (
                                  <span className="text-sm">🏸</span>
                                )}
                                {us.sport.name}
                              </span>
                              <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md text-xs">
                                {us.skill_level}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-400 dark:text-gray-500 italic">
                            Chưa cập nhật trình độ thể thao
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-500 font-bold py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2.5">
          <img src={searchImg} alt="search" className="w-4 h-4 shrink-0 opacity-40 dark:invert" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Search rooms, players or sports..."
            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
          />
        </div>
      </header>

      <div className="px-4 pt-5 space-y-7">

        {/* ── Danh mục môn thể thao ── */}
        <section>
          <div className="flex justify-around">
            {MOCK_SPORTS.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleFilterSport(sport.id)}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`relative w-14 h-14 rounded-full overflow-hidden transition-all flex items-center justify-center ${
                    selectedSport === sport.id ? 'scale-105' : 'hover:scale-105'
                  }`}
                >
                  <img src={sport.image} alt={sport.name} className="w-full h-full object-cover" />
                  {selectedSport === sport.id && (
                    <div className="absolute inset-0 rounded-full border-[3px] border-blue-500 pointer-events-none"></div>
                  )}
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

        {/* ── Open Rooms ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 dark:text-white font-bold text-lg">Open Rooms</h2>
            {user && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
              >
                + Tạo trận mới
              </button>
            )}
          </div>
          {isLoadingRooms ? (
            <div className="text-center py-10 text-gray-500">Đang tải danh sách phòng giao lưu...</div>
          ) : filteredRooms.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredRooms.map((room) => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onJoin={handleJoin} 
                  onLeave={handleLeave} 
                  currentUserId={user?.id}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No open rooms for this sport</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Be the first to create one!</p>
            </div>
          )}
        </section>

      </div>

      {/* Create Match Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200 my-8">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tạo Trận Giao Lưu Mới</h3>
            
            <form onSubmit={handleCreateMatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Tiêu đề</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Giao lưu cầu lông tối thứ 5"
                  value={newMatch.title}
                  onChange={e => setNewMatch({...newMatch, title: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Mô tả</label>
                <textarea 
                  placeholder="Mô tả chi tiết trình độ, nước nôi, chia tiền sân..."
                  value={newMatch.description}
                  onChange={e => setNewMatch({...newMatch, description: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Môn thể thao</label>
                  <select 
                    value={newMatch.sport_id}
                    onChange={e => setNewMatch({...newMatch, sport_id: parseInt(e.target.value)})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Cầu lông</option>
                    <option value={2}>Pickleball</option>
                    <option value={3}>Bóng đá</option>
                    <option value={4}>Tennis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Trình độ yêu cầu</label>
                  <select 
                    value={newMatch.required_level}
                    onChange={e => setNewMatch({...newMatch, required_level: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Chọn Sân</label>
                <select 
                  value={newMatch.court_id || ''}
                  onChange={e => setNewMatch({...newMatch, court_id: e.target.value ? parseInt(e.target.value) : null})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Không chọn / Tự do --</option>
                  {courtsList.map(c => (
                    <option key={c.id} value={c.id}>{c.venue.name} - {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Giờ bắt đầu</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={newMatch.start_time}
                    onChange={e => setNewMatch({...newMatch, start_time: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Giờ kết thúc</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={newMatch.end_time}
                    onChange={e => setNewMatch({...newMatch, end_time: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Số lượng tối đa</label>
                <input 
                  type="number" 
                  min={2}
                  required
                  value={newMatch.max_players}
                  onChange={e => setNewMatch({...newMatch, max_players: parseInt(e.target.value)})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingMatch}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors mt-2"
              >
                {isCreatingMatch ? 'Đang tạo...' : 'Tạo Trận Đấu'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Matches;
