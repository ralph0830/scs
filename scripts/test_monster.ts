import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true }); // headless 모드로 변경
  const page = await browser.newPage();
  
  try {
    console.log('페이지 로딩 중...');
    await page.goto('https://idleguildmaster.info/map', { waitUntil: 'networkidle' });
    
    console.log('던전 선택 중...');
    await page.selectOption('select.selectbox', '1'); // D1. 마법의 숲
    await page.waitForTimeout(5000); // 5초 대기
    await page.waitForLoadState('networkidle');
    
    console.log('페이지 상태 확인...');
    const pageInfo = await page.evaluate(() => {
      const tables = document.querySelectorAll('table');
      const images = document.querySelectorAll('img');
      
      return {
        tableCount: tables.length,
        imageCount: images.length,
        bodyText: document.body.textContent?.substring(0, 1000) || '',
        tables: Array.from(tables).map((table, index) => ({
          index,
          rows: table.querySelectorAll('tr').length,
          cells: table.querySelectorAll('td').length,
          className: table.className,
          firstRowText: table.querySelector('tr')?.textContent?.substring(0, 200) || ''
        })),
        images: Array.from(images).slice(0, 20).map((img, index) => ({
          index,
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt'),
          className: img.className
        }))
      };
    });
    
    console.log('=== 페이지 정보 ===');
    console.log('테이블 수:', pageInfo.tableCount);
    console.log('이미지 수:', pageInfo.imageCount);
    console.log('페이지 텍스트:', pageInfo.bodyText);
    
    console.log('\n=== 테이블 정보 ===');
    pageInfo.tables.forEach(table => {
      console.log(`테이블 ${table.index}: 행=${table.rows}, 셀=${table.cells}, 클래스=${table.className}`);
      console.log(`  첫 번째 행 텍스트: ${table.firstRowText}`);
    });
    
    console.log('\n=== 이미지 정보 (상위 20개) ===');
    pageInfo.images.forEach(img => {
      console.log(`이미지 ${img.index}: src=${img.src}, alt=${img.alt}, 클래스=${img.className}`);
    });
    
  } catch (error) {
    console.error('오류:', error);
  }
  
  await browser.close();
}

main(); 