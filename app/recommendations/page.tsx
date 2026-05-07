"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface MatchRow {
  id: string;
  score: number;
  status: string;
  jobs: { title: string; region: string; job_type: string } | null;
}

interface Senior {
  name: string;
  region: string;
  desired_job: string;
}

function ScoreBadge({ score }: { score: number }) {
  if (score === 6)
    return (
      <span className="inline-block bg-yellow-400 text-yellow-900 font-bold text-xl px-5 py-1.5 rounded-full whitespace-nowrap">
        ⭐ {score}점
      </span>
    );
  if (score >= 4)
    return (
      <span className="inline-block bg-green-500 text-white font-bold text-xl px-5 py-1.5 rounded-full whitespace-nowrap">
        ✓ {score}점
      </span>
    );
  return (
    <span className="inline-block bg-gray-300 text-gray-700 font-bold text-xl px-5 py-1.5 rounded-full whitespace-nowrap">
      {score}점
    </span>
  );
}

function RecommendationsContent() {
  const searchParams = useSearchParams();
  const seniorId = searchParams.get("senior_id");

  const [senior, setSenior] = useState<Senior | null>(null);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seniorId) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      const [{ data: seniorData }, { data: matchData }] = await Promise.all([
        supabase
          .from("seniors")
          .select("name, region, desired_job")
          .eq("id", seniorId!)
          .single(),
        supabase
          .from("matches")
          .select("id, score, status, jobs(title, region, job_type)")
          .eq("senior_id", seniorId!)
          .gt("score", 0)
          .order("score", { ascending: false }),
      ]);
      if (seniorData) setSenior(seniorData);
      if (matchData) setMatches(matchData as unknown as MatchRow[]);
      setLoading(false);
    }

    fetchData();
  }, [seniorId]);

  if (!seniorId) {
    return (
      <>
        <div className="bg-yellow-50 border-2 border-yellow-400 text-yellow-800 text-xl rounded-xl px-6 py-5">
          시니어 ID가 없습니다.{" "}
          <code className="bg-yellow-100 px-2 py-0.5 rounded text-lg">
            /recommendations?senior_id=...
          </code>{" "}
          형태로 접근해 주세요.
        </div>
        <div className="mt-6">
          <Link href="/register" className="text-xl text-blue-600 underline underline-offset-4">
            ← 프로필 등록하러 가기
          </Link>
        </div>
      </>
    );
  }

  if (loading) {
    return <p className="text-xl text-gray-400 mt-10">불러오는 중...</p>;
  }

  return (
    <>
      {senior ? (
        <p className="text-xl text-gray-500 mb-10">
          <span className="font-semibold text-gray-800">{senior.name}</span>님 (
          {senior.region} · {senior.desired_job})의 매칭 결과입니다.
        </p>
      ) : (
        <p className="text-xl text-red-500 mb-10">시니어 정보를 찾을 수 없습니다.</p>
      )}

      {matches.length === 0 ? (
        <div className="bg-yellow-50 border-2 border-yellow-400 text-yellow-800 text-2xl font-semibold rounded-xl px-6 py-6">
          현재 매칭되는 일자리가 없습니다.
        </div>
      ) : (
        <ul className="space-y-4">
          {matches.map((match) => (
            <li
              key={match.id}
              className="bg-white border-2 border-gray-200 rounded-2xl px-8 py-6 flex items-center justify-between gap-6"
            >
              <div>
                <p className="text-2xl font-bold text-gray-800 mb-1">
                  {match.jobs?.title ?? "—"}
                </p>
                <p className="text-lg text-gray-500">
                  {match.jobs?.region} · {match.jobs?.job_type}
                </p>
              </div>
              <ScoreBadge score={match.score} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <Link
          href="/register"
          className="text-xl text-blue-600 underline underline-offset-4 hover:text-blue-800"
        >
          ← 프로필 수정하러 가기
        </Link>
      </div>
    </>
  );
}

export default function RecommendationsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">추천 일자리</h1>
      <Suspense fallback={<p className="text-xl text-gray-400 mt-10">불러오는 중...</p>}>
        <RecommendationsContent />
      </Suspense>
    </div>
  );
}
