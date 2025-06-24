import { test, expect } from '@playwright/test';

const testUserId = `testuser_${Date.now()}`;
const testPassword = 'password123';

test.describe('Authentication API', () => {
  test('should allow user to sign up', async ({ request }) => {
    test.setTimeout(10000);
    
    const response = await request.post(`/api/auth/sign-up`, {
      data: {
        userId: testUserId,
        password: testPassword
      }
    });
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.message).toBe('회원가입이 완료되었습니다.');
  });

  test('should show error for missing userId', async ({ request }) => {
    test.setTimeout(10000);
    
    const response = await request.post(`/api/auth/sign-up`, {
      data: {
        password: testPassword
      }
    });
    expect(response.status()).toBe(400);
  });
  
  test('should show error for missing password', async ({ request }) => {
    test.setTimeout(10000);
    
    const response = await request.post(`/api/auth/sign-up`, {
      data: {
        userId: testUserId
      }
    });
    expect(response.status()).toBe(400);
  });

  test('should show error for short password', async ({ request }) => {
    test.setTimeout(10000);
    
    const response = await request.post(`/api/auth/sign-up`, {
      data: {
        userId: testUserId,
        password: '123'
      }
    });
    expect(response.status()).toBe(400);
  });

  test('should show error for duplicate userId', async ({ request }) => {
    // First sign up
    await request.post(`/api/auth/sign-up`, {
      data: {
        userId: testUserId,
        password: testPassword
      }
    });

    // Try to sign up again with the same userId
    const response = await request.post(`/api/auth/sign-up`, {
      data: {
        userId: testUserId,
        password: testPassword
      }
    });
    expect(response.status()).toBe(409);
  });

  test.describe('Sign In and Out', () => {
    const signInUserId = `signin_test_${Date.now()}`;

    test.beforeAll(async ({ request }) => {
      // Create a user to be used for sign-in tests
      await request.post(`/api/auth/sign-up`, {
        data: {
          userId: signInUserId,
          password: testPassword
        }
      });
    });

    test('should allow user to sign in', async ({ request }) => {
      test.setTimeout(10000);

      const response = await request.post(`/api/auth/sign-in`, {
        data: {
          userId: signInUserId,
          password: testPassword
        }
      });
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('로그인 성공');
    });

    test('should show error for invalid credentials', async ({ request }) => {
      test.setTimeout(10000);
      
      const response = await request.post(`/api/auth/sign-in`, {
        data: {
          userId: 'nonexistent',
          password: testPassword
        }
      });
      expect(response.status()).toBe(401);
    });

    test('should allow user to sign out', async ({ request }) => {
      test.setTimeout(10000);
      
      const response = await request.post(`/api/auth/sign-out`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.message).toBe('로그아웃 성공');
    });
  });
}); 