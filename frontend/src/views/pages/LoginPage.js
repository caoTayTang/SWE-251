import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, MessageSquare } from 'lucide-react';
import Header from "../components/Header";

export default function LoginPage() {
  const [step, setStep] = useState('roleSelect'); // roleSelect, login, processing
  const [selectedRole, setSelectedRole] = useState('');
  const [bknetId, setBknetId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'tutor', label: 'Tutor', description: 'Dành cho sinh viên muốn dạy kèm' },
    { id: 'tutee', label: 'Tutee', description: 'Dành cho sinh viên cần học thêm' },
    { id: 'admin', label: 'Admin', description: 'Quản trị hệ thống' },
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'tutor') {
      setStep('login');
    } else {
      setStep('login');
    }
    setError('');
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await login(bknetId, password, selectedRole);
      
      // Redirect based on role
      if (result.user.role === 'tutor') {
        navigate('/tutor/courses');
      } else if (result.user.role === 'tutee') {
        navigate('/tutee/courses');
      } else if (result.user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock authentication logic
    if (!bknetId || !password) {
      setError('Vui lòng nhập đầy đủ BKNetID và mật khẩu');
      setLoading(false);
      return;
    }

    // Simulate authentication scenarios
    if (bknetId === 'wrong' || password === 'wrong') {
      setError('Sai username hoặc mật khẩu');
      setLoading(false);
      return;
    }

    // Simulate SSO not available
    if (bknetId === 'nosso') {
      setError('Dịch vụ xác thực đăng gian đoạn (SSO không khả dụng)');
      setLoading(false);
      return;
    }

    // Success - would redirect to dashboard
    setStep('processing');
    setTimeout(() => {
      alert('Đăng nhập thành công! (Sẽ chuyển đến trang chủ)');
      setLoading(false);
    }, 1000);
  };

  const handleBack = () => {
    setStep('roleSelect');
    setSelectedRole('');
    setBknetId('');
    setPassword('');
    setError('');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      // style={{
      //   backgroundImage: `url(${require('../../assets/slbk.jpg')})`,
      //   backgroundSize: "auto 100%",
      // }}
    >

      <img
        src={require('../../assets/slbk.jpg')}
        alt="background"
        className="absolute inset-0 w-full h-full object-contain -z-10"
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] -z-10" />

      <Header role="guest" />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex justify-center items-center">
        {/* phần form login ở đây */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Left Panel - Illustration */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white flex flex-col justify-center">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-4">HCMUT Tutor Support System</h1>
                  <p className="text-blue-100 text-lg">
                    Hệ thống thông minh dược thiết kế và vận hành chương trình Tutor - Mentor dành cho sinh viên Trường Đại học Bách Khoa trong môi trường học nội và nói nơi tôi và mọi hoạt động hỗ trợ học tập giữa anh chị em với nhau ở trường
                  </p>
                </div>
                <div className="space-y-4 text-sm text-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                    <div>Kết nối sinh viên cần hỗ trợ với các Tutor có kinh nghiệm</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                    <div>Quản lý buổi học và theo dõi tiến độ học tập</div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">✓</div>
                    <div>Hệ thống đánh giá và phản hồi minh bạch</div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Form */}
              <div className="p-12">
                {step === 'roleSelect' && (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Chào mừng!</h2>
                    <p className="text-gray-600 mb-8">Vui lòng chọn vai trò của bạn để tiếp tục</p>
                    
                    <div className="space-y-3">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => handleRoleSelect(role.id)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                        >
                          <div className="font-semibold text-gray-800 group-hover:text-blue-600 mb-1">
                            {role.label}
                          </div>
                          <div className="text-sm text-gray-500">{role.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 'login' && (
                  <div>
                    <button
                      onClick={handleBack}
                      className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2 text-sm font-medium"
                    >
                      ← Quay lại chọn vai trò
                    </button>

                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
                    <p className="text-gray-600 mb-6">
                      Vai trò: <span className="font-semibold text-blue-600">{selectedRole.toUpperCase()}</span>
                    </p>

                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-700">{error}</div>
                      </div>
                    )}

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          BKNetID
                        </label>
                        <input
                          type="text"
                          value={bknetId}
                          onChange={(e) => setBknetId(e.target.value)}
                          placeholder="Nhập BKNetID của bạn"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Nhập mật khẩu"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        />
                      </div>

                      <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                      >
                        {loading ? 'Đang xác thực...' : 'Đăng nhập qua HCMUT_SSO'}
                      </button>
                    </div>

                    {/* <div className="mt-6 pt-6 border-t border-gray-200">
                      <button className="w-full bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-700 font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#4285F4"/>
                          <path d="M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78l-1.71 1.71C13.78 8.76 12.94 8.5 12 8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c1.74 0 3.18-1.27 3.45-2.93h-3.45v-2.14h5.71c.07.31.11.65.11.99 0 3.87-2.59 6.58-5.82 6.58z" fill="white"/>
                        </svg>
                        Đăng nhập qua HCMUT_SSO
                      </button>
                    </div> */}

                    <p className="text-center text-sm text-gray-500 mt-6">
                      Bạn chưa có tài khoản? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Đăng ký ngay</a>
                    </p>
                  </div>
                )}

                {step === 'processing' && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Đang xác thực...</h3>
                    <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Test Credentials Info */}
          {/* <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">🧪 Demo Test Cases:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Any valid credentials (except below) → Success</li>
              <li>• BKNetID: "wrong" or Password: "wrong" → "Sai username hoặc mật khẩu"</li>
              <li>• BKNetID: "nosso" → "SSO không khả dụng"</li>
              <li>• Empty fields → "Vui lòng nhập đầy đủ..."</li>
            </ul>
          </div> */}
        </div>
      </main>
    </div>
  );
}