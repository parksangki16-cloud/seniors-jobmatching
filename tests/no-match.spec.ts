/**
 * 엣지 시나리오: 매칭 조건이 전혀 맞지 않는 공고만 있을 때 안내 박스 확인
 *
 * 매칭 점수 공식: region(3) + job_type(2) + career(1) = 최대 6
 * 공고: 기타/기타/required_career=99
 * 시니어: 서울/경비/career_years=3
 *
 * 점수 = 0(region) + 0(job_type) + 0(career: 3 < 99) = 0
 * → RPC 는 score > 0 인 경우만 matches 삽입 → 행 없음 → 안내 박스 노출
 *
 * 주의: required_career=0 으로 설정하면 career 조건(3 >= 0)이 충족되어 score=1이 되므로
 *       절대 매칭 안 되게 하려면 required_career > senior.career_years 이어야 함
 */

import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/db';

test.beforeEach(async () => {
  await resetDb([
    {
      title: '매칭없는공고',
      region: '기타',
      job_type: '기타',
      required_career: 99,
    },
  ]);
});

test('매칭 조건이 없으면 추천 페이지에서 "현재 매칭되는 일자리가 없습니다" 안내 박스가 표시된다', async ({ page }) => {
  await page.goto('/register');

  await page.locator('input[placeholder="홍길동"]').fill('매칭없는시니어');
  await page.locator('select').nth(0).selectOption('서울');
  await page.locator('select').nth(1).selectOption('경비');
  await page.locator('input[type="number"]').fill('3');

  await page.locator('button[type="submit"]').click();

  // 등록 완료 대기
  await expect(page.getByText('등록이 완료되었습니다')).toBeVisible({ timeout: 30_000 });

  // 추천 페이지로 이동
  await page.getByText('내 추천 일자리 보기').click();
  await page.waitForURL(/\/recommendations\?senior_id=/, { timeout: 15_000 });

  // 로딩 완료 대기
  await expect(page.getByText('불러오는 중...')).not.toBeVisible({ timeout: 15_000 });

  // 매칭 없음 안내 박스 확인
  await expect(page.getByText('현재 매칭되는 일자리가 없습니다')).toBeVisible({ timeout: 15_000 });
});
