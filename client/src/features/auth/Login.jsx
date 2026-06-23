import { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SlidingOverlay from './components/SlidingOverlay';

function AuthPage() {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="h-screen flex bg-[#0B0F19] overflow-hidden">
      <div className="flex-1 relative overflow-hidden flex">

        {/* Panel đăng ký — nửa trái, hiện ra khi overlay trượt sang phải */}
        <div className="w-1/2 flex items-center justify-center px-10 xl:px-24">
          <div className="w-full max-w-sm">
            <RegisterForm />
          </div>
        </div>

        {/* Panel đăng nhập — nửa phải, hiển thị mặc định */}
        <div className="w-1/2 flex items-center justify-center px-10 xl:px-24">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        <SlidingOverlay
          isActive={isActive}
          onShowRegister={() => setIsActive(true)}
          onShowLogin={() => setIsActive(false)}
        />

      </div>
    </div>
  );
}

export default AuthPage;
