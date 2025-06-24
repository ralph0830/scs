const { chromium } = require('playwright');

async function debugLogin() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('1. 로그인 페이지로 이동...');
    await page.goto('http://localhost:3000/sign-in');
    
    console.log('2. 로그인 정보 입력...');
    await page.getByLabel('아이디').fill('testuser');
    await page.getByLabel('비밀번호').fill('password123');
    
    console.log('3. 로그인 버튼 클릭...');
    await page.getByRole('button', { name: '로그인' }).click();
    
    console.log('4. 현재 URL 확인...');
    await page.waitForTimeout(3000);
    const currentUrl = page.url();
    console.log('현재 URL:', currentUrl);
    
    console.log('5. 페이지 제목 확인...');
    const title = await page.title();
    console.log('페이지 제목:', title);
    
    console.log('6. 페이지 내용 확인...');
    const content = await page.content();
    console.log('페이지 내용 길이:', content.length);
    console.log('페이지 내용 일부:', content.substring(0, 1000));
    
    console.log('7. 스크린샷 저장...');
    await page.screenshot({ path: 'debug-login-result.png', fullPage: true });
    
    console.log('8. 모든 헤딩 요소 확인...');
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log('헤딩 개수:', headings.length);
    for (let i = 0; i < headings.length; i++) {
      const text = await headings[i].textContent();
      console.log(`헤딩 ${i + 1}:`, text);
    }
    
    console.log('9. 모든 텍스트 요소 확인...');
    const allText = await page.locator('body').textContent();
    console.log('모든 텍스트:', allText.substring(0, 500));
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await browser.close();
  }
}

debugLogin(); 