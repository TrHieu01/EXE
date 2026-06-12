import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, CheckCircle2 } from 'lucide-react';
// import { authService } from '../../shared/services/api';

const VALID_VN_PREFIXES = [
  '086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039',
  '089', '090', '093', '070', '079', '077', '076', '078',
  '088', '091', '094', '083', '084', '085', '081', '082',
  '056', '058', '092',
  '059', '099',
];

const SOCIAL_BUTTONS = [
  {
    key: 'google',
    label: 'Google',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
  {
    key: 'apple',
    label: 'Apple',
    icon: (
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: (
      <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateVietnamesePhone = (phone) => {
    const clean = phone.replace(/\s/g, '');
    if (!/^\d{10}$/.test(clean)) return 'Số điện thoại phải có đúng 10 chữ số';
    if (!VALID_VN_PREFIXES.includes(clean.substring(0, 3)))
      return 'Đầu số điện thoại không hợp lệ';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateVietnamesePhone(phoneNumber);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      // await authService.login(phoneNumber);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl flex items-center gap-16">

          {/* Left — Branding */}
          <div className="hidden lg:flex flex-col gap-6 flex-1">
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Nền tảng quản lý
              </h1>
              <h1 className="text-4xl font-bold text-[#CDFF00] leading-tight">
                Thể Thao Proton
              </h1>
            </div>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              Nâng tầm hiệu suất thi đấu và tối ưu hóa vận hành sân bãi với công
              nghệ quản lý hiện đại nhất tại Việt Nam.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              {['Đặt sân nhanh', 'Giải đấu trực tiếp'].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckCircle2 className="text-[#22C55E] w-5 h-5 shrink-0" />
                  <span className="text-white text-sm border border-gray-600 rounded-full px-4 py-1.5">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Login Card */}
          <div className="w-full max-w-md bg-[#151B2B] rounded-2xl p-8 shadow-2xl border border-[#1E2D45]">
            {/* Logo */}
            <div className="flex flex-col items-center mb-7">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
                <Zap className="w-8 h-8 text-white fill-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Đăng nhập</h2>
              <p className="text-gray-400 text-sm mt-1 text-center">
                Chào mừng trở lại với Proton Sports
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Số điện thoại
                </label>
                <div
                  className={`flex items-center bg-[#1E2637] rounded-xl border transition-colors ${error
                      ? 'border-red-500'
                      : 'border-[#2A3548] focus-within:border-blue-500'
                    }`}
                >
                  <span className="px-4 py-3.5 text-gray-300 text-sm font-medium border-r border-[#2A3548] shrink-0 select-none">
                    (+84)
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Nhập số điện thoại"
                    inputMode="numeric"
                    className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-gray-500 text-sm outline-none"
                  />
                </div>
                {error && (
                  <p className="text-red-400 text-xs mt-1.5">{error}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 text-sm mt-1"
              >
                {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-[#2A3548]" />
                <span className="text-gray-500 text-xs font-medium tracking-wider whitespace-nowrap">
                  HOẶC ĐĂNG NHẬP QUA
                </span>
                <div className="flex-1 h-px bg-[#2A3548]" />
              </div>
              <div className="flex justify-center gap-4">
                {SOCIAL_BUTTONS.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    type="button"
                    aria-label={`Đăng nhập bằng ${label}`}
                    className="w-12 h-12 bg-[#1E2637] border border-[#2A3548] rounded-xl flex items-center justify-center hover:border-gray-500 hover:bg-[#252D40] transition-colors"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms */}
            <p className="text-center text-gray-500 text-xs mt-6 leading-relaxed">
              Bằng việc tiếp tục, bạn đồng ý với{' '}
              <button type="button" className="text-gray-300 hover:text-white underline-offset-2 hover:underline">
                Điều khoản
              </button>
              {' & '}
              <button type="button" className="text-gray-300 hover:text-white underline-offset-2 hover:underline">
                Chính sách bảo mật
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-8 py-4 text-gray-600 text-xs">
        <span>© 2024 Proton Sports. High Performance Booking.</span>
        <div className="flex gap-4">
          <button className="hover:text-gray-300 transition-colors">Trợ giúp</button>
          <button className="hover:text-gray-300 transition-colors">Điều khoản</button>
        </div>
      </footer>
    </div>
  );
}

export default Login;
