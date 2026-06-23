import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { sanitizePhone, validatePhone, validatePassword } from '../../../shared/utils/validators';

function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (field) => (e) => {
    let val = e.target.value;
    if (field === 'phone') val = sanitizePhone(val);
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ và tên';
    const pErr = validatePhone(form.phone);
    if (pErr) errs.phone = pErr;
    const pwErr = validatePassword(form.password);
    if (pwErr) errs.password = pwErr;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsLoading(true);
    try {
      // await authService.register(form); // TODO: gọi API đăng ký
      navigate('/');
    } catch (err) {
      setErrors({ general: err.message || 'Đăng ký thất bại, vui lòng thử lại' });
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
        <UserPlus className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-semibold text-white">Tạo tài khoản</h2>
      <p className="text-gray-400 text-sm mt-1 mb-6 text-center">
        Bắt đầu hành trình cùng Proton Sports
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col w-full">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Họ và tên</label>
          <input
            type="text"
            value={form.name}
            onChange={onChange('name')}
            placeholder="Nguyễn Văn A"
            className={inputCls('name')}
          />
          <div className="h-5 mt-1">
            {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Số điện thoại</label>
          <div
            className={`flex items-center bg-[#1E2637] rounded-xl border transition-colors ${
              errors.phone ? 'border-red-500' : 'border-[#2A3548] focus-within:border-blue-500'
            }`}
          >
            <span className="px-4 py-3.5 text-gray-300 text-sm font-medium border-r border-[#2A3548] shrink-0 select-none">
              (+84)
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={onChange('phone')}
              placeholder="Số điện thoại"
              inputMode="numeric"
              className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-gray-500 text-sm outline-none"
            />
          </div>
          <div className="h-5 mt-1">
            {errors.phone && <p className="text-red-400 text-xs">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Mật khẩu</label>
          <input
            type="password"
            value={form.password}
            onChange={onChange('password')}
            placeholder="Tối thiểu 6 ký tự"
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
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors text-sm mt-1"
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
