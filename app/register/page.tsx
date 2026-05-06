export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">프로필 등록</h1>
      <p className="text-xl text-gray-500 mb-10">
        이름, 지역, 희망 직종, 경력을 입력하면 맞는 일자리를 찾아드립니다.
      </p>

      <form className="space-y-8">
        {/* 이름 */}
        <div>
          <label className="block text-2xl font-semibold text-gray-800 mb-2">
            이름
          </label>
          <input
            type="text"
            placeholder="홍길동"
            disabled
            className="w-full border-2 border-gray-300 rounded-xl px-5 py-4 text-2xl text-gray-400 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* 지역 */}
        <div>
          <label className="block text-2xl font-semibold text-gray-800 mb-2">
            지역
          </label>
          <input
            type="text"
            placeholder="서울 강남구"
            disabled
            className="w-full border-2 border-gray-300 rounded-xl px-5 py-4 text-2xl text-gray-400 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* 희망 직종 */}
        <div>
          <label className="block text-2xl font-semibold text-gray-800 mb-2">
            희망 직종
          </label>
          <input
            type="text"
            placeholder="경비, 청소, 판매 등"
            disabled
            className="w-full border-2 border-gray-300 rounded-xl px-5 py-4 text-2xl text-gray-400 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* 경력 */}
        <div>
          <label className="block text-2xl font-semibold text-gray-800 mb-2">
            경력 (년)
          </label>
          <input
            type="number"
            placeholder="5"
            disabled
            className="w-full border-2 border-gray-300 rounded-xl px-5 py-4 text-2xl text-gray-400 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* 제출 버튼 — 기능 구현 예정 */}
        <button
          type="button"
          disabled
          className="w-full bg-blue-600 text-white text-2xl font-bold py-5 rounded-xl opacity-40 cursor-not-allowed"
        >
          등록하기 (준비 중)
        </button>
      </form>
    </div>
  );
}
