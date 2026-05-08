/**
 * 실패 시나리오: 이름 누락 → 클라이언트 유효성 오류 / DB 미삽입 확인
 */

import { test, expect } from '@playwright/test';
import { resetDb, countSeniors } from './helpers/db';

test.beforeEach(async () => {
  await resetDb(); // 공고 없이 초기화
});

test('이름을 비우고 제출하면 빨간 안내 박스가 표시되고 seniors 레코드가 삽입되지 않는다', async ({ page }) => {
  await page.goto('/register');

  // 이름 입력 없이 나머지 입력
  await page.locator('select').nth(0).selectOption('서울');
  await page.locator('select').nth(1).selectOption('경비');
  await page.locator('input[type="number"]').fill('3');

  await page.locator('button[type="submit"]').click();

  // 이름 필드 위 빨간 안내 박스 확인
  const nameError = page.getByText('이름을 입력해 주세요.');
  await expect(nameError).toBeVisible();

  // 성공 메시지가 없는지 확인
  await expect(page.getByText('등록이 완료되었습니다')).not.toBeVisible();

  // DB에 시니어 레코드가 없는지 확인
  const count = await countSeniors();
  expect(count).toBe(0);
});
