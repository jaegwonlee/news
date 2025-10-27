"use client"; // 클라이언트 컴포넌트로 선언 (useState, useEffect 등 사용)

import FormField from "@/app/components/auth/FormField";
import RingLayout from "@/app/components/auth/RingLayout";
import { signUpUser } from "@/lib/api"; // 회원가입 API 함수 import
import { useRouter } from "next/navigation"; // 페이지 이동을 위한 hook
import { useState } from "react"; // 상태 관리를 위한 hook

// 각 입력 필드의 유효성 검사 규칙 정의
const VALIDATION_RULES: Record<string, { validate: (value: string, password?: string) => boolean; message: string }> = {
  name: {
    validate: (value) => value.trim().length >= 2 && /^[a-zA-Z가-힣]+$/.test(value),
    message: "이름은 2자 이상, 한글 또는 영문만 가능합니다.",
  },
  nickname: {
    validate: (value) => value.length >= 3 && value.length <= 10 && !/[^a-zA-Z0-9가-힣]/.test(value),
    message: "닉네임은 3~10자, 특수문자 없이 입력해주세요.",
  },
  email: {
    validate: (value) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
    message: "올바른 이메일 형식을 입력해주세요.",
  },
  password: {
    validate: (value) => /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])(?=.{8,20}$).*$/.test(value),
    message: "영문/숫자/특수문자 조합해주세요. (8~20자)", // 글자 수 조정
  },
  passwordConfirm: {
    validate: (value, password) => value === password && value.length > 0,
    message: "비밀번호가 일치하지 않습니다.",
  },
  phone: {
    validate: (value) => /^\d{10,11}$/.test(value),
    message: "휴대폰 번호는 숫자만 입력해주세요.",
  },
};

export default function RegisterPage() {
  const router = useRouter();
  // 폼 입력 값 상태
  const [formState, setFormState] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  });
  // 필드별 에러 메시지 상태
  const [errors, setErrors] = useState<Record<string, string>>({});
  // 필드 터치(blur) 여부 상태
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  // 서버 에러 메시지 상태
  const [serverError, setServerError] = useState<string | null>(null);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 입력 값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    // 입력 중에는 해당 필드 에러 메시지 초기화
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 포커스 아웃(blur) 시 유효성 검사 핸들러
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true })); // 터치 상태 업데이트

    const rule = VALIDATION_RULES[name];
    if (rule) {
      const isValid = rule.validate(value, formState.password); // 비밀번호 확인 시 password 값 전달
      if (!isValid) {
        setErrors((prev) => ({ ...prev, [name]: rule.message }));
      } else {
        // 유효하면 에러 메시지 제거
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 방지
    setServerError(null); // 이전 서버 에러 초기화

    // 모든 필드 최종 유효성 검사
    const newErrors: Record<string, string> = {};
    let formIsValid = true;
    for (const key in formState) {
      const fieldName = key as keyof typeof formState;
      const rule = VALIDATION_RULES[fieldName];
      if (rule) {
        const isValid = rule.validate(formState[fieldName], formState.password);
        if (!isValid) {
          newErrors[fieldName] = rule.message;
          formIsValid = false;
        }
      }
    }
    setErrors(newErrors);
    // 모든 필드를 터치한 것으로 간주하여 에러 메시지 표시
    setTouched({
      name: true,
      nickname: true,
      email: true,
      password: true,
      passwordConfirm: true,
      phone: true,
    });

    // 유효성 검사 실패 시 중단
    if (!formIsValid) {
      return;
    }

    setIsLoading(true); // 로딩 시작

    try {
      // API 요청 본문 생성 (API 스키마에 맞게 필드 이름 조정 필요 시 수정)
      const apiRequestBody = {
        name: formState.name,
        nickname: formState.nickname,
        email: formState.email,
        password: formState.password,
        password_confirmation: formState.passwordConfirm, // API에서 요구하는 필드명으로 변경
        phone: formState.phone,
      };

      await signUpUser(apiRequestBody); // 회원가입 API 호출

      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      router.push("/login"); // 성공 시 로그인 페이지로 이동
    } catch (error) {
      // API 에러 처리
      if (error instanceof Error) {
        setServerError(error.message); // API에서 받은 에러 메시지 표시
      } else {
        setServerError("알 수 없는 에러가 발생했습니다.");
      }
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    // RingLayout으로 전체 구조 감싸기
    <RingLayout title="회원가입">
      {/* 폼 요소 */}
      <form className="space-y-3" onSubmit={handleSubmit} noValidate>
        {/* 이름, 닉네임 필드 (가로 배치) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormField
              id="name"
              label="이름"
              type="text"
              value={formState.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
            />
            {/* 에러 메시지 표시 */}
            {touched.name && errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <FormField
              id="nickname"
              label="닉네임"
              type="text"
              value={formState.nickname}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
            />
            {touched.nickname && errors.nickname && <p className="text-red-400 text-xs mt-1">{errors.nickname}</p>}
          </div>
        </div>

        {/* 이메일 필드 */}
        <div>
          <FormField
            id="email"
            label="이메일 (ID)"
            type="email"
            value={formState.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoComplete="email"
            required
          />
          {touched.email && errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* 비밀번호 필드 */}
        <div>
          <FormField
            id="password"
            label="비밀번호"
            type="password"
            value={formState.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            required
          />
          {touched.password && errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* 비밀번호 확인 필드 */}
        <div>
          <FormField
            id="passwordConfirm"
            label="비밀번호 확인"
            type="password"
            value={formState.passwordConfirm}
            onChange={handleInputChange}
            onBlur={handleBlur}
            autoComplete="new-password"
            required
          />
          {touched.passwordConfirm && errors.passwordConfirm && (
            <p className="text-red-400 text-xs mt-1">{errors.passwordConfirm}</p>
          )}
        </div>

        {/* 휴대폰 번호 필드 */}
        <div>
          <FormField
            id="phone"
            label="휴대폰 번호"
            type="tel"
            value={formState.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
          />
          {touched.phone && errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* 서버 에러 메시지 표시 영역 */}
        {serverError && (
          <div className="text-red-400 text-sm text-center p-2 bg-red-900/50 rounded-md">{serverError}</div>
        )}

        {/* 가입하기 버튼 */}
        <div>
          <button
            type="submit"
            disabled={isLoading} // 로딩 중 비활성화
            // 버튼 스타일 (빨간색 배경, hover 효과 등)
            className="w-full mt-2 px-4 py-3 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-neutral-600 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? "가입하는 중..." : "가입하기"}
          </button>
        </div>

        {/* 로그인 페이지 링크 */}
        <div className="text-center text-sm text-neutral-400 pt-2">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="font-medium text-red-500 hover:underline">
            로그인
          </a>
        </div>
      </form>
    </RingLayout>
  );
}
