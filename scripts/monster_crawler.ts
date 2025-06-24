import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const BASE_URL = 'https://idleguildmaster.info/map';
const IMG_BASE = 'https://idleguildmaster.info';
const SAVE_DIR = path.join(process.cwd(), 'public', 'monsters');

// 던전 정보
const dungeons = [
  { id: 1, name: 'D1. 마법의 숲', value: '1' },
  { id: 2, name: 'D2. 사막', value: '2' },
  { id: 3, name: 'D3. 영원한 전장', value: '3' },
  { id: 4, name: 'D4. 황금 도시', value: '4' },
  { id: 5, name: 'D5. 블랙워터 항구', value: '5' },
  { id: 6, name: 'D6. 얼어붙는 봉우리', value: '6' },
  { id: 7, name: 'D7. 흑요석 광산', value: '7' },
  { id: 8, name: 'D8. 남부 숲', value: '8' },
  { id: 9, name: 'D9. 메마른 황무지', value: '9' },
  { id: 10, name: 'D10. 숨겨진 도시, 라록스', value: '16' },
  { id: 11, name: 'D11. 잊혀진 대지', value: '18' },
  { id: 12, name: 'R1. 슬라임 연못', value: '10' },
  { id: 13, name: 'R2. [E]신성한 고고학', value: '11' },
  { id: 14, name: 'R3. 고대 무덤 발굴', value: '12' },
  { id: 15, name: 'R4. [E]제국 구조', value: '13' },
  { id: 16, name: 'R5. 광신도의 반란', value: '14' },
  { id: 17, name: 'R6. [E]끔찍한 상승', value: '15' },
  { id: 18, name: 'R7. 실종된 탐험대', value: '17' },
  { id: 19, name: 'R8. [E]천상의 모선', value: '19' },
  { id: 20, name: 'R9. [E]무서운 하강', value: '20' }
];

async function downloadImage(url: string, filename: string) {
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(path.join(SAVE_DIR, filename), res.data);
    console.log('이미지 저장:', filename);
  } catch (e) {
    console.log('이미지 저장 실패:', filename, e);
  }
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // monsters 폴더 생성
  if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR, { recursive: true });
  }

  const allMonsters: any[] = [];
  const allDungeons: any[] = [];

  console.log('몬스터 및 던전 크롤링 시작...');

  // 던전 데이터 생성
  for (const dungeon of dungeons) {
    allDungeons.push({
      id: dungeon.id,
      name: dungeon.name,
      description: `${dungeon.name} 던전`,
      minLevel: Math.floor((dungeon.id - 1) * 5) + 1,
      maxLevel: dungeon.id * 10,
      difficulty: dungeon.id <= 5 ? 'easy' : dungeon.id <= 10 ? 'medium' : dungeon.id <= 15 ? 'hard' : 'expert',
      unlockRequirement: dungeon.id === 1 ? null : `${dungeons[dungeon.id - 2]?.name} 완료`,
      backgroundImage: null
    });
  }

  // 각 던전별로 몬스터 크롤링
  for (const dungeon of dungeons.slice(0, 1)) { // 첫 번째 던전만 테스트
    console.log(`\n${dungeon.name} 크롤링 중...`);
    
    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      
      // 던전 선택
      await page.selectOption('select.selectbox', dungeon.value);
      await page.waitForTimeout(3000); // 더 오래 기다리기
      await page.waitForLoadState('networkidle');
      
      // 테이블이 나타날 때까지 대기
      await page.waitForSelector('table', { timeout: 10000 });

      // 몬스터 정보 추출
      const monsters = await page.evaluate((dungeonName) => {
        const arr: any[] = [];
        
        // 첫 번째 테이블에서 몬스터 정보 추출 (두 번째 테이블은 아이템)
        const table = document.querySelector('table');
        if (table) {
          const rows = Array.from(table.querySelectorAll('tr'));
          console.log(`테이블 행 수: ${rows.length}`);
          
          // 헤더 행을 제외하고 데이터 행만 처리
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.querySelectorAll('td');
            console.log(`행 ${i}: 셀 ${cells.length}개`);
            
            if (cells.length >= 8) {
              // 몬스터 이미지 찾기
              const imgEl = cells[0].querySelector('img');
              const nameEl = cells[1];
              const hpEl = cells[2];
              const dfEl = cells[3];
              const dfmEl = cells[4];
              const dmgEl = cells[5];
              const expEl = cells[6];
              const atkTypeEl = cells[7];
              
              if (imgEl && nameEl) {
                const imageUrl = imgEl.getAttribute('src');
                const imageFile = imageUrl ? imageUrl.split('/').pop() : '';
                const name = nameEl.textContent?.trim() || '';
                
                console.log(`이미지: ${imageFile}, 이름: ${name}`);
                
                // unit_ 접두사가 있는 이미지만 몬스터로 간주
                if (imageFile && imageFile.startsWith('unit_') && name) {
                  const hp = hpEl ? parseInt(hpEl.textContent?.replace(/[^0-9]/g, '') || '10') : 10;
                  const df = dfEl ? parseInt(dfEl.textContent?.replace(/[^0-9]/g, '') || '5') : 5;
                  const dfm = dfmEl ? parseInt(dfmEl.textContent?.replace(/[^0-9]/g, '') || '5') : 5;
                  const dmg = dmgEl ? parseInt(dmgEl.textContent?.replace(/[^0-9]/g, '') || '5') : 5;
                  const exp = expEl ? parseInt(expEl.textContent?.replace(/[^0-9]/g, '') || '10') : 10;
                  const atkType = atkTypeEl?.textContent?.trim() || '근접, 물리';
                  
                  // 드롭 아이템 정보 추출 (나머지 셀들)
                  const dropItems = [];
                  for (let j = 8; j < cells.length; j++) {
                    const dropImg = cells[j].querySelector('img');
                    if (dropImg) {
                      const dropImageUrl = dropImg.getAttribute('src');
                      const dropImageFile = dropImageUrl ? dropImageUrl.split('/').pop() : '';
                      const dropText = cells[j].textContent?.trim() || '';
                      if (dropImageFile && dropText) {
                        dropItems.push({
                          imageFile: dropImageFile,
                          text: dropText
                        });
                      }
                    }
                  }
                  
                  arr.push({
                    name,
                    hp,
                    df,
                    dfm,
                    dmg,
                    exp,
                    atkType,
                    imageUrl,
                    imageFile,
                    dropItems,
                    dungeonName
                  });
                }
              }
            }
          }
        }
        
        return arr;
      }, dungeon.name);

      // 중복 제거 및 데이터 정리
      for (const monster of monsters) {
        const existingMonster = allMonsters.find(m => m.name === monster.name);
        if (!existingMonster) {
          allMonsters.push({
            name: monster.name,
            description: `${monster.name} - ${monster.dungeonName}의 몬스터`,
            emoji: '👹',
            imageUrl: monster.imageFile ? `/monsters/${monster.imageFile}` : null,
            type: 'normal', // 기본값
            baseHp: monster.hp,
            baseAttack: monster.df,
            baseDefense: monster.dfm,
            hpGrowth: 1.1,
            attackGrowth: 1.1,
            defenseGrowth: 1.1,
            rarity: 'common',
            minLevel: Math.floor((dungeon.id - 1) * 5) + 1,
            maxLevel: dungeon.id * 10,
            experienceReward: monster.exp,
            goldReward: 5,
            dropRate: 0.15,
            dungeonId: dungeon.id,
            imageFile: monster.imageFile
          });
        }
      }

      console.log(`${dungeon.name}에서 ${monsters.length}개 몬스터 발견`);

    } catch (error) {
      console.error(`${dungeon.name} 크롤링 실패:`, error);
    }
  }

  console.log(`\n총 ${allMonsters.length}개 고유 몬스터 발견`);

  // 이미지 다운로드
  console.log('\n이미지 다운로드 시작...');
  for (const monster of allMonsters) {
    if (monster.imageFile) {
      try {
        const url = `${IMG_BASE}/images/monsters/${monster.imageFile}`;
        await downloadImage(url, monster.imageFile);
      } catch (e) {
        console.log('이미지 다운로드 실패:', monster.imageFile);
      }
    }
  }

  // 던전 시드 데이터 저장
  const dungeonSeedData = allDungeons.map(dungeon => ({
    name: dungeon.name,
    description: dungeon.description,
    minLevel: dungeon.minLevel,
    maxLevel: dungeon.maxLevel,
    difficulty: dungeon.difficulty,
    unlockRequirement: dungeon.unlockRequirement,
    backgroundImage: dungeon.backgroundImage
  }));

  writeFileSync(
    path.join(process.cwd(), 'scripts', 'dungeon_seed.json'), 
    JSON.stringify(dungeonSeedData, null, 2), 
    'utf-8'
  );

  // 몬스터 시드 데이터 저장
  const monsterSeedData = allMonsters.map(monster => ({
    name: monster.name,
    description: monster.description,
    emoji: monster.emoji,
    imageUrl: monster.imageUrl,
    type: monster.type,
    baseHp: monster.baseHp,
    baseAttack: monster.baseAttack,
    baseDefense: monster.baseDefense,
    hpGrowth: monster.hpGrowth,
    attackGrowth: monster.attackGrowth,
    defenseGrowth: monster.defenseGrowth,
    rarity: monster.rarity,
    minLevel: monster.minLevel,
    maxLevel: monster.maxLevel,
    experienceReward: monster.experienceReward,
    goldReward: monster.goldReward,
    dropRate: monster.dropRate,
    dungeonId: monster.dungeonId
  }));

  writeFileSync(
    path.join(process.cwd(), 'scripts', 'monster_seed.json'), 
    JSON.stringify(monsterSeedData, null, 2), 
    'utf-8'
  );

  console.log('시드 데이터 저장 완료');
  console.log(`던전: ${allDungeons.length}개`);
  console.log(`몬스터: ${allMonsters.length}개`);

  await browser.close();
}

main(); 