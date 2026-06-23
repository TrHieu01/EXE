import { useLocation, useNavigate } from 'react-router-dom';
import courtsImg from '../../assets/svgs/court.svg';
import matchesImg from '../../assets/svgs/match.svg';
import bookingImg from '../../assets/svgs/booking.svg';
import profileImg from '../../assets/svgs/profile.svg';

const NAV_ITEMS = [
  { id: 'courts', label: 'Courts', image: courtsImg, path: '/' },
  { id: 'matches', label: 'Matches', image: matchesImg, path: '/matches' },
  { id: 'bookings', label: 'Bookings', image: bookingImg, path: '/bookings' },
  { id: 'profile', label: 'Profile', image: profileImg, path: '/profile' },
];

function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ id, label, image, path }) => {
          const active = location.pathname === path;
          return (
            <button
              key={id}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-0.5 flex-1 py-1"
            >
              <div
                className={`px-4 py-2 rounded-2xl transition-colors ${active ? 'bg-[#CDFF00]' : ''}`}
              >
                <img
                  src={image}
                  alt={label}
                  className={`w-5 h-5 object-contain ${active ? 'brightness-0' : 'opacity-50 dark:invert'}`}
                />
              </div>
              <span
                className={`text-xs font-medium ${active ? 'text-gray-900 dark:text-gray-900' : 'text-gray-500 dark:text-gray-400'}`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNavigation;
