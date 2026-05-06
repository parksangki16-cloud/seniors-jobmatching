export default function RecommendationsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">추천 일자리</h1>
      <p className="text-xl text-gray-500 mb-10">
        내 프로필과 가장 잘 맞는 일자리를 점수 순으로 보여줍니다.
      </p>

      {/* 필터 영역 — 기능 구현 예정 */}
      <div className="flex gap-4 mb-8">
        <select
          disabled
          className="border-2 border-gray-300 rounded-xl px-5 py-3 text-xl text-gray-400 bg-gray-100 cursor-not-allowed"
        >
          <option>지역 선택</option>
        </select>
        <select
          disabled
          className="border-2 border-gray-300 rounded-xl px-5 py-3 text-xl text-gray-400 bg-gray-100 cursor-not-allowed"
        >
          <option>직종 선택</option>
        </select>
      </div>

      {/* 카드 목록 자리 — 기능 구현 예정 */}
      <ul className="space-y-4">
        {[1, 2, 3].map((i) => (
          <li
            key={i}
            className="bg-white border-2 border-gray-200 rounded-2xl px-8 py-6 flex justify-between items-center opacity-40"
          >
            <div>
              <p className="text-2xl font-semibold text-gray-700">
                일자리 제목 (준비 중)
              </p>
              <p className="text-lg text-gray-400 mt-1">지역 · 직종</p>
            </div>
            <span className="text-3xl font-bold text-blue-600">점수 -</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
