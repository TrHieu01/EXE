import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { validateEmail } from '../../../shared/utils/validators';

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

function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (!form.password)
      errs.password = 'Vui lòng nhập mật khẩu';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    try {
      // await authService.login(form); // TODO: gọi API đăng nhập
      navigate('/');
    } catch (err) {
      setErrors({ general: err.message || 'Đăng nhập thất bại, vui lòng thử lại' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full bg-[#1E2637] border rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-500 outline-none transition-colors ${
      errors[field] ? 'border-red-500' : 'border-[#2A3548] focus:border-blue-500'
    }`;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-600/30">
        <Zap className="w-8 h-8 text-white fill-white" />
      </div>
      <h2 className="text-xl font-semibold text-white">Đăng nhập</h2>
      <p className="text-gray-400 text-sm mt-1 mb-7 text-center">
        Chào mừng trở lại với Proton Sports
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={onChange('email')}
            placeholder="your@email.com"
            className={inputCls('email')}
          />
          <div className="h-5 mt-1">
            {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu</label>
          <input
            type="password"
            value={form.password}
            onChange={onChange('password')}
            placeholder="Nhập mật khẩu"
            className={inputCls('password')}
          />
          <div className="h-5 mt-1">
            {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
          </div>
        </div>

        {errors.general && (
          <p className="text-red-400 text-sm text-center mb-2">{errors.general}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 text-sm mt-1"
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      <div className="mt-6 w-full">
        <div className="flex items-center gap-3 mb-4">
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

      <p className="text-center text-gray-500 text-xs mt-5 leading-relaxed">
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
  );
}

export default LoginForm;
