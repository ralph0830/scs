const http = require('http');

const baseURL = 'http://localhost:3000';
const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'testpassword123';

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 API 테스트 시작...\n');

  try {
    // 1. 회원가입 테스트
    console.log('1. 회원가입 테스트');
    const signUpResult = await makeRequest('/api/auth/sign-up', 'POST', {
      email: testEmail,
      password: testPassword
    });
    console.log(`   상태: ${signUpResult.status}`);
    console.log(`   응답: ${JSON.stringify(signUpResult.data)}`);
    console.log(`   결과: ${signUpResult.status === 201 ? '✅ 성공' : '❌ 실패'}\n`);

    // 2. 중복 이메일 테스트
    console.log('2. 중복 이메일 테스트');
    const duplicateResult = await makeRequest('/api/auth/sign-up', 'POST', {
      email: testEmail,
      password: testPassword
    });
    console.log(`   상태: ${duplicateResult.status}`);
    console.log(`   응답: ${JSON.stringify(duplicateResult.data)}`);
    console.log(`   결과: ${duplicateResult.status === 409 ? '✅ 성공' : '❌ 실패'}\n`);

    // 3. 로그인 테스트
    console.log('3. 로그인 테스트');
    const signInResult = await makeRequest('/api/auth/sign-in', 'POST', {
      email: testEmail,
      password: testPassword
    });
    console.log(`   상태: ${signInResult.status}`);
    console.log(`   응답: ${JSON.stringify(signInResult.data)}`);
    console.log(`   결과: ${signInResult.status === 200 ? '✅ 성공' : '❌ 실패'}\n`);

    // 4. 잘못된 비밀번호 테스트
    console.log('4. 잘못된 비밀번호 테스트');
    const wrongPasswordResult = await makeRequest('/api/auth/sign-in', 'POST', {
      email: testEmail,
      password: 'wrongpassword'
    });
    console.log(`   상태: ${wrongPasswordResult.status}`);
    console.log(`   응답: ${JSON.stringify(wrongPasswordResult.data)}`);
    console.log(`   결과: ${wrongPasswordResult.status === 401 ? '✅ 성공' : '❌ 실패'}\n`);

    // 5. 로그아웃 테스트
    console.log('5. 로그아웃 테스트');
    const signOutResult = await makeRequest('/api/auth/sign-out', 'POST');
    console.log(`   상태: ${signOutResult.status}`);
    console.log(`   응답: ${JSON.stringify(signOutResult.data)}`);
    console.log(`   결과: ${signOutResult.status === 200 ? '✅ 성공' : '❌ 실패'}\n`);

    // 6. 짧은 비밀번호 테스트
    console.log('6. 짧은 비밀번호 테스트');
    const shortPasswordResult = await makeRequest('/api/auth/sign-up', 'POST', {
      email: 'test2@example.com',
      password: '123'
    });
    console.log(`   상태: ${shortPasswordResult.status}`);
    console.log(`   응답: ${JSON.stringify(shortPasswordResult.data)}`);
    console.log(`   결과: ${shortPasswordResult.status === 400 ? '✅ 성공' : '❌ 실패'}\n`);

    console.log('🎉 모든 테스트 완료!');

  } catch (error) {
    console.error('❌ 테스트 실행 중 오류 발생:', error.message);
  }
}

runTests(); 