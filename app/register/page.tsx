"use client";

import { useState } from "react";
import Link from "next/link";
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
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRegisteredId(null);
    setServerError("");

    const next: FormErrors = {};
    if (!name.trim()) next.name = "이름을 입력해 주세요.";
    if (!region) next.region = "지역을 선택해 주세요.";
    if (!desiredJob) next.desired_job = "희망 직종을 선택해 주세요.";
    if (Object.keys(next).length > 0) { setErrors(next); return; }
    setErrors({});

    setLoading(true);
    const { data: inserted, error } = await supabase
      .from("seniors")
      .insert({ name: name.trim(), region, desired_job: desiredJob, career_years: careerYears })
      .select("id")
      .single();

    if (error) {
      setServerError("저장 중 오류가 발생했습니다: " + error.message);
      setLoading(false);
      return;
    }

    const { error: rpcError } = await supabase.rpc("recalculate_matches_for_senior", {
      p_senior_id: inserted.id,
    });
    setLoading(false);

    if (rpcError) {
      setServerError(
        "등록은 완료됐지만 매칭 계산 중 오류가 발생했습니다. 잠시 후 추천 페이지를 다시 확인해 주세요."
      );
      setRegisteredId(inserted.id);
      return;
    }

    setRegisteredId(inserted.id);
    setName("");
    setRegion("");
    setDesiredJob("");
    setCareerYears(0);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">프로필 등록</h1>
      <p className="text-xl text-gray-500 mb-10">
        이름, 지역, 희망 직종, 경력을 입력하면 맞는 일자리를 찾아드립니다.
      </p>

      {registeredId && (
        <div className="mb-8 bg-green-100 border-2 border-green-500 text-green-800 rounded-xl px-6 py-5">
          <p className="text-2xl font-semibold mb-3">등록이 완료되었습니다 ✓</p>
          <Link
            href={`/recommendations?senior_id=${registeredId}`}
            className="inline-block bg-green-600 hover:bg-green-700 text-white text-xl font-bold px-6 py-3 rounded-xl transition-colors"
          >
            내 추천 일자리 보기 →
          </Link>
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
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
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
            {JOB_TYPES.map((j) => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        {/* 경력 */}
        <div>
          <label className="block text-2xl font-semibold text-gray-800 mb-2">경력 (년)</label>
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
          {loading ? "등록 중..." : "등록하기"}
        </button>
      </form>
    </div>
  );
}
