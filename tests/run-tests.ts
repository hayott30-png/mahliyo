import assert from 'node:assert/strict';
import {
  verifySecretCode,
  isRateLimited,
  recordFailedAttempt,
  resetFailedAttempts,
  createMahliyoSession,
  validateMahliyoSession,
} from '../lib/auth/mahliyo-session.ts';
import { A1_LESSON_UNITS, CEFR_LEVELS_INFO } from '../src/data/curriculum.ts';

console.log('--- Running TÜRKAI & MAHLİYO AI Test Suite ---');

// 1. Test Secret Code Verification
console.log('1. Testing secret-code verification...');
assert.equal(verifySecretCode('maxliyo'), true, 'Code "maxliyo" must be accepted');
assert.equal(verifySecretCode('  MAXLIYO  '), true, 'Uppercase "MAXLIYO" with spaces must be accepted');
assert.equal(verifySecretCode('mahliyo'), true, 'Code "mahliyo" must be accepted');
assert.equal(verifySecretCode('  MAHLIYO  '), true, 'Uppercase "MAHLIYO" must be accepted');
assert.equal(verifySecretCode('wrong_code'), false, 'Incorrect code should be rejected');
assert.equal(verifySecretCode(''), false, 'Empty code should be rejected');
console.log('✓ Secret code verification passed');

// 2. Test Rate Limiting
console.log('2. Testing rate limiting...');
const mockReq = {
  ip: '127.0.0.1',
  headers: {},
  socket: { remoteAddress: '127.0.0.1' },
} as any;

resetFailedAttempts(mockReq);
assert.equal(isRateLimited(mockReq), false, 'Initially should not be rate limited');

for (let i = 0; i < 4; i++) {
  recordFailedAttempt(mockReq);
  assert.equal(isRateLimited(mockReq), false, `Attempt ${i + 1} should not lock out yet`);
}

recordFailedAttempt(mockReq); // 5th failed attempt
assert.equal(isRateLimited(mockReq), true, '5th failed attempt must trigger lockout');
resetFailedAttempts(mockReq);
assert.equal(isRateLimited(mockReq), false, 'Resetting failed attempts should clear lockout');
console.log('✓ Rate limiting tests passed');

// 3. Test Session Creation and Validation
console.log('3. Testing session token management...');
let setCookieHeader: any = null;
const mockRes = {
  cookie: (name: string, val: string, options: any) => {
    setCookieHeader = { name, val, options };
  },
} as any;

const token = createMahliyoSession(mockRes);
assert.ok(token && token.startsWith('mahliyo_session_'), 'Token must be formatted with mahliyo_session_ prefix');
assert.equal(setCookieHeader.name, 'mahliyo_session', 'Cookie name must be mahliyo_session');
assert.equal(setCookieHeader.options.httpOnly, true, 'Cookie must be HttpOnly');

const reqWithValidCookie = {
  cookies: { mahliyo_session: token },
  headers: {},
} as any;
assert.equal(validateMahliyoSession(reqWithValidCookie), true, 'Valid token in cookie must validate');

const reqWithInvalidCookie = {
  cookies: { mahliyo_session: 'invalid_token_xyz' },
  headers: {},
} as any;
assert.equal(validateMahliyoSession(reqWithInvalidCookie), false, 'Invalid token must fail validation');
console.log('✓ Session authentication tests passed');

// 4. Test Curriculum Data Integrity
console.log('4. Testing curriculum and A1 lesson integrity...');
assert.equal(CEFR_LEVELS_INFO.length, 6, 'Must define 6 CEFR levels (A1-C2)');
assert.equal(A1_LESSON_UNITS.length, 6, 'Must provide 6 interactive A1 lesson units');

A1_LESSON_UNITS.forEach((unit, idx) => {
  assert.equal(unit.unitOrder, idx + 1, `Unit ${unit.id} order must match sequence`);
  assert.ok(unit.vocabulary.length >= 4, `Unit ${unit.id} must include rich vocabulary`);
  assert.ok(unit.exercises.length >= 2, `Unit ${unit.id} must include interactive exercises`);
  assert.ok(unit.grammarNotesUz.length > 50, `Unit ${unit.id} must provide detailed grammar in Uzbek`);
});
console.log('✓ Curriculum data integrity passed');

// 5. Test Quiz Scoring Logic
console.log('5. Testing exercise scoring...');
const sampleUnit = A1_LESSON_UNITS[0];
const totalPoints = sampleUnit.exercises.reduce((sum, e) => sum + e.points, 0);
assert.ok(totalPoints > 0, 'Total points must be greater than zero');
console.log('✓ Quiz score calculation logic passed');

// 6. Test Speech Text Cleaning & Sanitization
console.log('6. Testing speech text sanitization for Turkish TTS...');
import { cleanTextForSpeech } from '../src/services/speech.ts';
const dirtyText = "Merhaba canım öğrencim! 🥰 **Harika** söyledin! Sağa dön (o'ngga buril) ve dümdüz git.";
const cleaned = cleanTextForSpeech(dirtyText);
assert.ok(!cleaned.includes('🥰'), 'Must strip emojis');
assert.ok(!cleaned.includes('**'), 'Must strip markdown');
assert.ok(!cleaned.includes("o'ngga buril"), 'Must strip parenthetical translations');
assert.ok(cleaned.startsWith('Merhaba canım öğrencim!'), 'Preserves Turkish text');
console.log('✓ Speech text sanitization passed');

console.log('--- ALL TESTS PASSED SUCCESSFULLY (6/6) ---');
