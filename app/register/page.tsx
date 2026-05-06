"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const REGIONS = ["서울", "경기", "인천", "기타"];
const JOB_TYPES = ["경비", "청소", "조리", "돌봄", "기타"];

interface FormErrors {
  name?: string;
  region?: string;
  desired_job?: string;
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [desiredJob, setDesiredJob] = useState("");
  const [careerYears, setCareerYears] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setServerError("");

    const next: FormErrors = {};
    if (!name.trim()) next.name = "이름을 입력해 주세요.";
    if (!region) next.region = "지역을 선택해 주세요.";
    if (!desiredJob) next.desired_job = "희망 직종을 선택해 주세요.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});

    setLoading(true);
    const { error } = await supabase.from("seniors").insert({
      name: name.trim(),
      region,
      desired_job: desiredJob,
      career_years: careerYears,
    });
    setLoading(false);

    if (error) {
      setServerError("저장 중 오류가 발생했습니다: " + error.message);
    } else {
      setSuccess(true);
      setName("");
      setRegion("");
      setDesiredJob("");
      setCareerYears(0);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">프로필 등록</h1>
      <p className="text-xl text-gray-500 mb-10">
        이름, 지역, 희망 직종, 경력을 입력하면 맞는 일자리를 찾아드립니다.
      </p>

      {success && (
        <div className="mb-8 bg-green-100 border-2 border-green-500 text-green-800 text-2xl font-semibold rounded-xl px-6 py-4">
          등록이 완료되었습니다 ✓
        </div>
      )}
      {serverError && (
        <div className="mb-8 bg-red-100 border-2 border-red-500 text-red-800 text-xl rounded-xl px-6 py-4">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* 이름 */}
        <div>
          <label className="block text-2xl font-semibold text-gray-800 mb-2">
            이름 <span className="text-red-500">*</span>
          </label>
          {errors.name && (
            <div className="mb-2 bg-red-50 border border-red-400 text-red-700 text-lg rounded-lg px-4 py-2">
              {errors.name}
            </div>
          )}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className={`w-full border-2 rounded-xl px-5 py-4 text-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
            }`}
          />
        </div>

        {/* 지역 */}
        <div>
          <label className="block text-2xl font-semibold text-gray-800 mb-2">
            지역 <span className="text-red-500">*</span>
          </label>
          {errors.region && (
            <div className="mb-2 bg-red-50 border border-red-400 text-red-700 text-lg rounded-lg px-4 py-2">
              {errors.region}
            </div>
          )}
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`w-full border-2 rounded-xl px-5 py-4 text-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.region ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
            }`}
          >
            <option value="">선택해 주세요</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* 희망 직종 */}
        <div>
          <label className="block text-2xl font-semibold text-gray-800 mb-2">
            희망 직종 <span className="text-red-500">*</span>
          </label>
          {errors.desired_job && (
            <div className="mb-2 bg-red-50 border border-red-400 text-red-700 text-lg rounded-lg px-4 py-2">
              {errors.desired_job}
            </div>
          )}
          <select
            value={desiredJob}
            onChange={(e) => setDesiredJob(e.target.value)}
            className={`w-full border-2 rounded-xl px-5 py-4 text-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.desired_job ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
            }`}
          >
            <option value="">선택해 주세요</option>
            {JOB_TYPES.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>

        {/* 경력 */}
        <div>
          <label className="block text-2xl font-semibold text-gray-800 mb-2">
            경력 (년)
          </label>
          <input
            type="number"
            min={0}
            value={careerYears}
            onChange={(e) => setCareerYears(Number(e.target.value))}
            className="w-full border-2 border-gray-300 rounded-xl px-5 py-4 text-2xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-bold py-5 rounded-xl transition-colors"
        >
          {loading ? "저장 중..." : "등록하기"}
        </button>
      </form>
    </div>
  );
}
