import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://idleguildmaster.info/map', { waitUntil: 'networkidle' });
    
    // 페이지 구조 분석
    const pageInfo = await page.evaluate(() => {
      const title = document.title;
      const url = window.location.href;
      const bodyText = document.body.textContent?.substring(0, 1000) || '';
      
      // 모든 요소의 클래스명 수집
      const allClasses = Array.from(document.querySelectorAll('*'))
        .map(el => el.className)
        .filter(className => className && className.length > 0)
        .slice(0, 50);
      
      // 테이블 요소 찾기
      const tables = document.querySelectorAll('table');
      const tableInfo = Array.from(tables).map((table, index) => ({
        index,
        className: table.className,
        rows: table.querySelectorAll('tr').length,
        cells: table.querySelectorAll('td').length
      }));
      
      // 이미지 요소 찾기
      const images = document.querySelectorAll('img');
      const imageInfo = Array.from(images).map((img, index) => ({
        index,
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        className: img.className
      }));
      
      // 셀렉트 박스 정보
      const selectBoxes = document.querySelectorAll('select');
      const selectInfo = Array.from(selectBoxes).map((select, index) => ({
        index,
        className: select.className,
        options: Array.from(select.querySelectorAll('option')).map(opt => ({
          value: opt.getAttribute('value'),
          text: opt.textContent
        }))
      }));
      
      return {
        title,
        url,
        bodyText,
        allClasses,
        tableInfo,
        imageInfo,
        selectInfo
      };
    });
    
    console.log('=== 페이지 정보 ===');
    console.log('제목:', pageInfo.title);
    console.log('URL:', pageInfo.url);
    console.log('\n=== 클래스명 (상위 50개) ===');
    pageInfo.allClasses.forEach((className, index) => {
      console.log(`${index + 1}. ${className}`);
    });
    
    console.log('\n=== 테이블 정보 ===');
    pageInfo.tableInfo.forEach(table => {
      console.log(`테이블 ${table.index}: 클래스=${table.className}, 행=${table.rows}, 셀=${table.cells}`);
    });
    
    console.log('\n=== 이미지 정보 ===');
    pageInfo.imageInfo.forEach(img => {
      console.log(`이미지 ${img.index}: src=${img.src}, alt=${img.alt}, 클래스=${img.className}`);
    });
    
    console.log('\n=== 셀렉트 박스 정보 ===');
    pageInfo.selectInfo.forEach(select => {
      console.log(`셀렉트 ${select.index}: 클래스=${select.className}`);
      select.options.forEach(opt => {
        console.log(`  - ${opt.value}: ${opt.text}`);
      });
    });
    
    console.log('\n=== 페이지 텍스트 (처음 1000자) ===');
    console.log(pageInfo.bodyText);
    
  } catch (error) {
    console.error('오류:', error);
  }
  
  await browser.close();
}

main(); 