/**
 * 정상 시나리오: 시니어 등록 → 6점 금색 배지 매칭 확인
 *
 * 사전 조건: 서울/경비/요구경력 3년 공고 1건
 * 시니어: 서울/경비/경력 5년
 * 예상 점수: region(3) + job_type(2) + career(1) = 6점
 */

import { test, expect } from '@playwright/test';
import { resetDb } from './helpers/db';

test.beforeEach(async () => {
  await resetDb([
    {
      title: '서울 아파트 경비원 모집',
      region: '서울',
      job_type: '경비',
      required_career: 3,
    },
  ]);
});

test('시니어 등록 후 추천 페이지에서 6점 금색 배지가 첫 번째 카드에 노출된다', async ({ page }) => {
  await page.goto('/register');

  // 폼 입력
  await page.locator('input[placeholder="홍길동"]').fill('테스트시니어');
  await page.locator('select').nth(0).selectOption('서울');
  await page.locator('select').nth(1).selectOption('경비');
  await page.locator('input[type="number"]').fill('5');

  await page.locator('button[type="submit"]').click();

  // 성공 메시지 확인 (RPC 완료까지 대기)
  await expect(page.getByText('등록이 완료되었습니다')).toBeVisible({ timeout: 30_000 });

  // 추천 페이지로 이동
  await page.getByText('내 추천 일자리 보기').click();
  await page.waitForURL(/\/recommendations\?senior_id=/, { timeout: 15_000 });

  // 로딩 완료 대기
  await expect(page.getByText('불러오는 중...')).not.toBeVisible({ timeout: 15_000 });

  // 첫 번째 카드가 6점 금색 배지인지 확인
  const firstCard = page.locator('ul > li').first();
  await expect(firstCard).toBeVisible({ timeout: 15_000 });
  await expect(firstCard.locator('.bg-yellow-400')).toBeVisible();
  await expect(firstCard.locator('.bg-yellow-400')).toContainText('6점');
});
