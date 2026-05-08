import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export interface JobInput {
  title: string;
  region: string;
  job_type: string;
  required_career: number;
}

function getClient() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\s/g, '');
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').replace(/\s/g, '');
  return createClient(url, key);
}

/** matches → seniors → jobs 순서로 전체 삭제 후 jobs 시드 삽입 */
export async function resetDb(jobs: JobInput[] = []): Promise<void> {
  const db = getClient();

  // score >= 0 은 matches 테이블의 모든 행을 커버 (RPC 는 score > 0 만 삽입하므로 1~6)
  const r1 = await db.from('matches').delete().gte('score', 0);
  if (r1.error) throw new Error(`matches 삭제 실패: ${r1.error.message}`);

  const r2 = await db.from('seniors').delete().gte('career_years', 0);
  if (r2.error) throw new Error(`seniors 삭제 실패: ${r2.error.message}`);

  const r3 = await db.from('jobs').delete().gte('required_career', 0);
  if (r3.error) throw new Error(`jobs 삭제 실패: ${r3.error.message}`);

  if (jobs.length > 0) {
    const { error } = await db.from('jobs').insert(jobs);
    if (error) throw new Error(`jobs 삽입 실패: ${error.message}`);
  }
}

/** seniors 테이블 현재 행 수 반환 */
export async function countSeniors(): Promise<number> {
  const db = getClient();
  const { count, error } = await db
    .from('seniors')
    .select('*', { count: 'exact', head: true });
  if (error) throw new Error(`countSeniors 실패: ${error.message}`);
  return count ?? 0;
}
