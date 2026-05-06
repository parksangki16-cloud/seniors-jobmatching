const STATUS_TABS = [
  { label: "미매칭", key: "unmatched", color: "bg-red-100 text-red-700" },
  { label: "매칭 대기", key: "pending", color: "bg-yellow-100 text-yellow-700" },
  { label: "배정 완료", key: "assigned", color: "bg-green-100 text-green-700" },
];

export default function AdminPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        담당자 대시보드
      </h1>
      <p className="text-xl text-gray-500 mb-10">
        매칭 현황을 단계별로 확인하고 관리합니다.
      </p>

      {/* 상태 탭 — 기능 구현 예정 */}
      <div className="flex gap-4 mb-8">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            disabled
            className={`${tab.color} text-xl font-semibold px-8 py-3 rounded-xl border-2 border-transparent opacity-50 cursor-not-allowed`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 테이블 자리 — 기능 구현 예정 */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full text-xl">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                시니어 이름
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                일자리
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                점수
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                상태
              </th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="opacity-40">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-t border-gray-200">
                <td className="px-6 py-5 text-gray-500">이름 (준비 중)</td>
                <td className="px-6 py-5 text-gray-500">일자리 (준비 중)</td>
                <td className="px-6 py-5 text-gray-500">-</td>
                <td className="px-6 py-5">
                  <span className="bg-gray-200 text-gray-500 px-4 py-1 rounded-full text-lg">
                    대기
                  </span>
                </td>
                <td className="px-6 py-5">
                  <button
                    disabled
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg text-lg cursor-not-allowed"
                  >
                    배정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
