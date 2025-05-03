import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import AuthButtons from '../components/AuthButtons';
import { useAuth } from '../context/AuthContext'; // ✅ AuthContext 사용

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({ mode: 'onChange' });

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ login 함수 context에서 사용

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      console.log('로그인 요청 바디', data);
      await login(data); // ✅ 로그인 처리 및 이동까지 내부에서 수행됨
    } catch (error: any) {
      console.error('로그인 실패', error);
      alert(
        '로그인 실패: ' +
          (error.response?.data?.message || '알 수 없는 오류')
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 relative">
      {/* 🔒 로그인/회원가입 버튼 */}
      <div className="absolute top-4 right-4">
        <AuthButtons />
      </div>

      {/* ⬅️ 뒤로가기 버튼 */}
      <button
        className="absolute top-4 left-4 text-3xl"
        onClick={() => navigate(-1)}
      >
        &lt;
      </button>

      <h1 className="text-2xl font-bold mb-6">로그인</h1>

      {/* 구글 로그인 버튼 */}
      <button className="flex items-center gap-3 border rounded-md px-4 py-2 mb-4 w-full max-w-sm justify-center hover:bg-white/10 transition">
        <FcGoogle size={24} />
        <span>구글 로그인</span>
      </button>

      {/* 구분선 */}
      <div className="flex items-center gap-3 mb-4 w-full max-w-sm">
        <hr className="flex-grow border-gray-600" />
        <span className="text-gray-400 text-sm">OR</span>
        <hr className="flex-grow border-gray-600" />
      </div>

      {/* 로그인 폼 */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        {/* 이메일 입력 */}
        <div>
          <input
            type="email"
            placeholder="이메일을 입력해주세요!"
            className="w-full px-4 py-2 rounded-md bg-zinc-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            {...register('email', {
              required: '이메일을 입력해주세요',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '올바른 이메일 형식을 입력해주세요.',
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요!"
            className="w-full px-4 py-2 rounded-md bg-zinc-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            {...register('password', {
              required: '비밀번호를 입력해주세요.',
              minLength: {
                value: 8,
                message: '비밀번호는 8자 이상이어야 합니다.',
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-2 rounded-md font-semibold transition ${
            isValid
              ? 'bg-pink-500 hover:bg-pink-600 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          로그인
        </button>
      </form>
    </div>
  );
}
