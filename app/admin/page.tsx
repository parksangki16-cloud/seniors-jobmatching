"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const REGIONS = ["서울", "경기", "인천", "기타"];
const JOB_TYPES = ["경비", "청소", "조리", "돌봄", "기타"];

interface Job {
  id: string;
  title: string;
  region: string;
  job_type: string;
  required_career: number;
}

interface JobForm {
  title: string;
  region: string;
  job_type: string;
  required_career: number;
}

interface JobFormErrors {
  title?: string;
  region?: string;
  job_type?: string;
}

const EMPTY_FORM: JobForm = { title: "", region: "", job_type: "", required_career: 0 };

export default function AdminPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [form, setForm] = useState<JobForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<JobFormErrors>({});
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    const { data } = await supabase
      .from("jobs")
      .select("id, title, region, job_type, required_career")
      .order("created_at", { ascending: false });
    if (data) setJobs(data);
    setLoadingJobs(false);
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault();
    setAddSuccess(false);
    setAddError("");

    const errs: JobFormErrors = {};
    if (!form.title.trim()) errs.title = "공고명을 입력해 주세요.";
    if (!form.region) errs.region = "지역을 선택해 주세요.";
    if (!form.job_type) errs.job_type = "직종을 선택해 주세요.";
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setFormErrors({});

    setAddLoading(true);
    const { error } = await supabase.from("jobs").insert({
      title: form.title.trim(),
      region: form.region,
      job_type: form.job_type,
      required_career: form.required_career,
    });
    setAddLoading(false);

    if (error) {
      setAddError("저장 중 오류: " + error.message);
    } else {
      setAddSuccess(true);
      setForm(EMPTY_FORM);
      fetchJobs();
    }
  }

  async function handleDeleteJob(id: string) {
    setDeletingId(id);
    await supabase.from("jobs").delete().eq("id", id);
    setDeletingId(null);
    fetchJobs();
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">담당자 대시보드</h1>
        <p className="text-xl text-gray-500">일자리를 등록하고 매칭 현황을 관리합니다.</p>
      </div>

      {/* ── 일자리 관리 ── */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">
          일자리 관리
        </h2>

        {/* 추가 폼 */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">새 일자리 등록</h3>

          {addSuccess && (
            <div className="mb-6 bg-green-100 border-2 border-green-500 text-green-800 text-xl font-semibold rounded-xl px-6 py-4">
              일자리가 등록되었습니다 ✓
            </div>
          )}
          {addError && (
            <div className="mb-6 bg-red-100 border-2 border-red-500 text-red-800 text-xl rounded-xl px-6 py-4">
              {addError}
            </div>
          )}

          <form onSubmit={handleAddJob} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 공고명 */}
              <div className="md:col-span-2">
                <label className="block text-xl font-semibold text-gray-800 mb-2">
                  공고명 <span className="text-red-500">*</span>
                </label>
                {formErrors.title && (
                  <div className="mb-2 bg-red-50 border border-red-400 text-red-700 text-lg rounded-lg px-4 py-2">
                    {formErrors.title}
                  </div>
                )}
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="예: 아파트 경비원 모집"
                  className={`w-full border-2 rounded-xl px-5 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.title ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                  }`}
                />
              </div>

              {/* 지역 */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-2">
                  지역 <span className="text-red-500">*</span>
                </label>
                {formErrors.region && (
                  <div className="mb-2 bg-red-50 border border-red-400 text-red-700 text-lg rounded-lg px-4 py-2">
                    {formErrors.region}
                  </div>
                )}
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className={`w-full border-2 rounded-xl px-5 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.region ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                  }`}
                >
                  <option value="">선택</option>
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* 직종 */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-2">
                  직종 <span className="text-red-500">*</span>
                </label>
                {formErrors.job_type && (
                  <div className="mb-2 bg-red-50 border border-red-400 text-red-700 text-lg rounded-lg px-4 py-2">
                    {formErrors.job_type}
                  </div>
                )}
                <select
                  value={form.job_type}
                  onChange={(e) => setForm({ ...form, job_type: e.target.value })}
                  className={`w-full border-2 rounded-xl px-5 py-4 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.job_type ? "border-red-400 bg-red-50" : "border-gray-300 bg-white"
                  }`}
                >
                  <option value="">선택</option>
                  {JOB_TYPES.map((j) => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>

              {/* 요구 경력 */}
              <div>
                <label className="block text-xl font-semibold text-gray-800 mb-2">
                  요구 경력 (년)
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.required_career}
                  onChange={(e) => setForm({ ...form, required_career: Number(e.target.value) })}
                  className="w-full border-2 border-gray-300 rounded-xl px-5 py-4 text-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={addLoading}
              className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xl font-bold px-10 py-4 rounded-xl transition-colors"
            >
              {addLoading ? "저장 중..." : "일자리 등록"}
            </button>
          </form>
        </div>

        {/* 일자리 목록 */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-8 py-5 bg-gray-50 border-b-2 border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-700">
              등록된 일자리{" "}
              {!loadingJobs && (
                <span className="text-blue-600">({jobs.length}건)</span>
              )}
            </h3>
          </div>

          {loadingJobs ? (
            <p className="text-xl text-gray-400 text-center py-10">불러오는 중...</p>
          ) : jobs.length === 0 ? (
            <p className="text-xl text-gray-400 text-center py-10">
              등록된 일자리가 없습니다.
            </p>
          ) : (
            <table className="w-full text-xl">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">공고명</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">지역</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">직종</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">요구 경력</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, idx) => (
                  <tr
                    key={job.id}
                    className={`border-t border-gray-200 ${idx % 2 === 1 ? "bg-gray-50" : ""}`}
                  >
                    <td className="px-6 py-5 font-medium text-gray-800">{job.title}</td>
                    <td className="px-6 py-5 text-gray-600">{job.region}</td>
                    <td className="px-6 py-5 text-gray-600">{job.job_type}</td>
                    <td className="px-6 py-5 text-gray-600">{job.required_career}년</td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        disabled={deletingId === job.id}
                        className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-lg font-semibold transition-colors"
                      >
                        {deletingId === job.id ? "삭제 중..." : "삭제"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── 매칭 현황 (다음 단계에서 구현) ── */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">
          매칭 현황
        </h2>
        <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">시니어 이름</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">일자리</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">점수</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-600">상태</th>
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
      </section>
    </div>
  );
}
