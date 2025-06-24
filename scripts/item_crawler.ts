import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const BASE_URL = 'https://idleguildmaster.info/item';
const IMG_BASE = 'https://idleguildmaster.info';
const SAVE_DIR = path.join(process.cwd(), 'public', 'items');

async function downloadImage(url: string, filename: string) {
  const res = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(path.join(SAVE_DIR, filename), res.data);
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });

  const allItems: any[] = [];
  let pageNumber = 1;
  let hasNextPage = true;

  console.log('아이템 크롤링 시작...');

  while (hasNextPage) {
    console.log(`페이지 ${pageNumber} 처리 중...`);
    
    // 현재 페이지의 아이템 정보 추출
    const pageItems = await page.evaluate(() => {
      const table = document.querySelector('table.mgT10');
      if (!table) return [];

      const rows = Array.from(table.querySelectorAll('tbody tr'));
      const arr: any[] = [];

      rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 8) {
          const imgEl = cells[1].querySelector('img.item.cursor');
          const imageFile = imgEl ? imgEl.getAttribute('src')?.split('/').pop() : '';
          
          arr.push({
            id: index + 1,
            name: cells[2]?.textContent?.trim() || '',
            type: cells[3]?.textContent?.trim() || '',
            stats: cells[4]?.textContent?.trim() || '',
            howGet: cells[5]?.textContent?.trim() || '',
            sellPrice: cells[6]?.textContent?.trim() || '',
            price: Number(cells[7]?.textContent?.replace(/[^0-9]/g, '')) || null,
            feedPower: cells[8]?.textContent?.trim() || '',
            combine: cells[9]?.textContent?.trim() || '',
            dropMonsters: cells[10]?.textContent?.trim() || '',
            imageUrl: imgEl ? imgEl.getAttribute('src') : '',
            imageFile,
          });
        }
      });

      return arr;
    });

    // 중복 제거를 위해 이름으로 체크
    for (const item of pageItems) {
      const existingItem = allItems.find(existing => existing.name === item.name);
      if (!existingItem) {
        allItems.push(item);
      }
    }

    console.log(`페이지 ${pageNumber}에서 ${pageItems.length}개 아이템 발견, 총 ${allItems.length}개 누적`);

    // 페이지네이션 버튼들 찾기
    const paginationInfo = await page.evaluate(() => {
      // 모든 버튼과 링크 찾기
      const buttons = Array.from(document.querySelectorAll('a, button')).map(el => ({
        tag: el.tagName,
        text: el.textContent?.trim(),
        className: el.className,
        href: el.getAttribute('href'),
        id: el.id
      }));

      // 페이지네이션 관련 요소들 찾기
      const paginationElements = buttons.filter(btn => 
        btn.text?.includes('다음') || 
        btn.text?.includes('Next') ||
        btn.text?.includes('>') ||
        btn.className?.includes('next') ||
        btn.className?.includes('btn')
      );

      return { buttons, paginationElements };
    });

    console.log('페이지네이션 요소들:', paginationInfo.paginationElements);

    // 다음 페이지 버튼 찾기 및 클릭 (여러 방법 시도)
    let nextButtonFound = false;
    
    // 방법 1: "다음" 텍스트가 포함된 버튼
    const nextButton = await page.$('a:has-text("다음"), button:has-text("다음")');
    if (nextButton) {
      const buttonText = await nextButton.textContent();
      console.log('다음 버튼 발견:', buttonText);
      await nextButton.click();
      nextButtonFound = true;
    } else {
      // 방법 2: btn 클래스가 있는 링크들 중에서
      const btnLinks = await page.$$('a.btn');
      for (const link of btnLinks) {
        const text = await link.textContent();
        if (text?.includes('다음') || text?.includes('>')) {
          console.log('btn 클래스 다음 버튼 발견:', text);
          await link.click();
          nextButtonFound = true;
          break;
        }
      }
    }

    if (nextButtonFound) {
      await page.waitForTimeout(3000); // 페이지 로딩 대기
      await page.waitForLoadState('networkidle');
      pageNumber++;
    } else {
      console.log('다음 페이지 버튼을 찾을 수 없습니다. 크롤링 종료.');
      hasNextPage = false;
    }

    // 안전장치: 너무 많은 페이지를 처리하지 않도록
    if (pageNumber > 50) {
      console.log('50페이지 이상 처리됨. 안전을 위해 종료합니다.');
      hasNextPage = false;
    }
  }

  console.log(`총 ${allItems.length}개 고유 아이템 발견`);

  // 이미지 다운로드
  console.log('이미지 다운로드 시작...');
  for (const item of allItems) {
    if (item.imageUrl && item.imageFile) {
      try {
        const url = item.imageUrl.startsWith('http') ? item.imageUrl : IMG_BASE + item.imageUrl;
        await downloadImage(url, item.imageFile);
        console.log('이미지 저장:', item.imageFile);
      } catch (e) {
        console.log('이미지 저장 실패:', item.imageFile);
      }
    }
  }

  // DB 시드용 JSON 저장 (한글 이름/설명으로 변환)
  const seedData = allItems.map(({ name, type, stats, howGet, sellPrice, price, feedPower, combine, dropMonsters, imageFile }) => ({
    name: name || '알 수 없는 아이템',
    description: `${type} 타입의 아이템. ${stats ? `효과: ${stats}` : ''}`,
    type: type || 'material',
    rarity: 'common', // 기본값, 필요시 수정
    effect: stats || '',
    price: price,
    imageUrl: imageFile ? `/items/${imageFile}` : null,
    // 추가 정보는 제거 (스키마에 없는 필드들)
  }));

  writeFileSync(path.join(process.cwd(), 'scripts', 'item_seed.json'), JSON.stringify(seedData, null, 2), 'utf-8');
  console.log('시드 데이터 저장 완료');

  await browser.close();
}

main(); 