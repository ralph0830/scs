import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const BASE_URL = 'https://idleguildmaster.info/map';
const IMG_BASE = 'https://idleguildmaster.info';
const SAVE_DIR = path.join(process.cwd(), 'public', 'monsters');

// 몬스터 영문 이름을 한글 이름으로 매핑
const monsterKoreanNames: Record<string, string> = {
  // D1. 마법의 숲
  "Wolf": "늑대",
  "Boar": "멧돼지",
  "Treant": "트렌트",
  "Centaur": "켄타우로스",
  "Ent": "엔트",
  "Golden Rabbit": "황금 토끼",
  "Forest Spirit": "숲의 정령",
  
  // D2. 사막
  "Wurm": "웜",
  "Sand Vulture": "모래 독수리",
  "Shahuri Warrior": "샤후리 전사",
  "Shahuri Archer": "샤후리 궁수",
  "Shahuri Mage": "샤후리 마법사",
  "Djinn": "진",
  "Sand Statue": "모래 석상",
  
  // D3. 영원한 전장
  "Undead": "언데드",
  "Undead Archer": "언데드 궁수",
  "Undead Warlord": "언데드 장군",
  "Death Hound": "죽음의 사냥개",
  "Ghoul": "구울",
  "Will o Wisp": "도깨비불",
  "Abomination": "괴물",
  
  // D4. 황금 도시
  "Insane Citizen": "광기 시민",
  "Insane Merchant": "광기 상인",
  "Insane Priest": "광기 사제",
  "City Warden": "도시 관리자",
  "Imperial Guard": "제국 경비병",
  "Imperial Mage": "제국 마법사",
  "Arcane Assassin": "비밀 암살자",
  
  // D5. 블랙워터 항구
  "Deckhand": "갑판원",
  "Pirate": "해적",
  "Pirate Lieutenant": "해적 중위",
  "Pirate Captain": "해적 선장",
  "Mysterious Tentacle": "신비한 촉수",
  "Mimic": "미믹",
  
  // D6. 얼어붙는 봉우리
  "Troll Whelp": "트롤 새끼",
  "Troll": "트롤",
  "Troll Warrior": "트롤 전사",
  "Troll Shaman": "트롤 주술사",
  "Ice Elemental": "얼음 정령",
  "Snow Wyvern": "눈 뷔른",
  
  // D7. 흑요석 광산
  "Vampire Bat": "흡혈 박쥐",
  "Giant Spider": "거대 거미",
  "Obsidian Golem": "흑요석 골렘",
  "Beholder": "비홀더",
  "Lost Miner": "길 잃은 광부",
  "Pale Hermit": "창백한 은둔자",
  
  // D8. 남부 숲
  "Giant Tortoise": "거대 거북",
  "Giant Moth": "거대 나방",
  "Green Spitfang": "녹색 독니",
  "Dryad": "드라이어드",
  "Ancient Ent": "고대 엔트",
  "Primeval Wurm": "원시 웜",
  
  // D9. 메마른 황무지
  "Iconoclast": "파괴자",
  "Oculus": "오큘러스",
  "Celestial Lancer": "천상의 창병",
  "Celestial Destroyer": "천상의 파괴자",
  "Banshee": "밴시",
  "Imp": "임프",
  
  // D10. 숨겨진 도시, 라록스
  "Magic Armor": "마법 갑옷",
  "Nexus Researcher": "넥서스 연구원",
  "Wizard of Larox": "라록스의 마법사",
  "Archmage of Larox": "라록스의 대마법사",
  "Wicked Tribute": "사악한 공물",
  
  // D11. 잊혀진 대지
  "Amanita Obscura": "암나이타 오브스쿠라",
  "Berserker": "광전사",
  "Terrorsaurus": "테러사우루스",
  "Pterodactyl": "프테로닥틸",
  "Stone Shaman": "돌 주술사",
  "Smoldering Titan": "잿빛 타이탄",
  
  // R1. 슬라임 연못
  "Slime": "슬라임",
  "Fire Slime": "불꽃 슬라임",
  "Electric Slime": "전기 슬라임",
  "Frozen Slime": "얼음 슬라임",
  "Void Slime": "공허 슬라임",
  "Slime King": "슬라임 왕",
  
  // R2. [E]신성한 고고학
  "Sand Demon": "모래 악마",
  "Sha Kire First Swordsman": "샤 키레 첫 번째 검사",
  "Sha The Hidden God": "숨겨진 신 샤",
  
  // R3. 고대 무덤 발굴
  "Undead General": "언데드 장군",
  "Kabar The Rotten": "썩은 카바르",
  "Necrolith": "네크로리스",
  
  // R4. [E]제국 구조
  "Emperor Clovis XXVIII": "황제 클로비스 28세",
  
  // R5. 광신도의 반란
  "Crusader": "십자군",
  "Lesser Titan": "하급 타이탄",
  "Claris": "클라리스",
  "Thorvus": "토르부스",
  "Primordial Titan": "원시 타이탄",
  
  // R6. [E]끔찍한 상승
  "Ethereal Soul": "에테르 영혼",
  "Kasimir The Seer": "예언자 카시미르",
  "Herald Kali": "전령 칼리",
  
  // R7. 실종된 탐험대
  "Bleak Disciple": "절망의 제자",
  "Eldritch Hound": "고대의 사냥개",
  "Bleak Deacon": "절망의 부제",
  "Tekeli Li First Apostle": "첫 번째 사도 테켈리 리",
  "Avatar of The Ancient": "고대의 화신",
  
  // R8. [E]천상의 모선
  "GCSS": "GCSS",
  "Reinforced Door": "강화된 문",
  "Legate Hadrian": "사절 하드리안",
  "Herald Xavi": "전령 자비",
  "Herald Maya": "전령 마야",
  "Herald Shoran": "전령 쇼란",
};

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

// 몬스터 타입 추정 함수
function estimateMonsterType(monsterName: string, description: string): string {
  const name = monsterName.toLowerCase();
  const desc = description.toLowerCase();
  
  // 불꽃 관련
  if (name.includes('fire') || name.includes('burning') || desc.includes('fire') || desc.includes('flame')) {
    return 'fire';
  }
  
  // 물 관련
  if (name.includes('water') || name.includes('sea') || name.includes('ocean') || desc.includes('water')) {
    return 'water';
  }
  
  // 풀/자연 관련
  if (name.includes('forest') || name.includes('tree') || name.includes('plant') || name.includes('nature') || 
      name.includes('treant') || name.includes('ent') || name.includes('dryad') || desc.includes('forest')) {
    return 'grass';
  }
  
  // 전기 관련
  if (name.includes('electric') || name.includes('lightning') || name.includes('thunder') || desc.includes('electric')) {
    return 'electric';
  }
  
  // 얼음 관련
  if (name.includes('ice') || name.includes('frozen') || name.includes('snow') || desc.includes('ice') || desc.includes('frozen')) {
    return 'ice';
  }
  
  // 격투 관련
  if (name.includes('warrior') || name.includes('fighter') || name.includes('berserker') || name.includes('crusader')) {
    return 'fighting';
  }
  
  // 독 관련
  if (name.includes('poison') || name.includes('toxic') || name.includes('venom') || desc.includes('poison')) {
    return 'poison';
  }
  
  // 땅 관련
  if (name.includes('ground') || name.includes('earth') || name.includes('stone') || name.includes('rock') || desc.includes('ground')) {
    return 'ground';
  }
  
  // 비행 관련
  if (name.includes('bird') || name.includes('eagle') || name.includes('hawk') || name.includes('vulture') || 
      name.includes('wyvern') || name.includes('dragon') || name.includes('flying') || desc.includes('flying')) {
    return 'flying';
  }
  
  // 에스퍼 관련
  if (name.includes('psychic') || name.includes('mind') || name.includes('spirit') || name.includes('soul') || 
      name.includes('ethereal') || desc.includes('psychic')) {
    return 'psychic';
  }
  
  // 벌레 관련
  if (name.includes('spider') || name.includes('moth') || name.includes('insect') || name.includes('bug') || desc.includes('spider')) {
    return 'bug';
  }
  
  // 바위 관련
  if (name.includes('golem') || name.includes('crystal') || name.includes('obsidian') || desc.includes('stone')) {
    return 'rock';
  }
  
  // 고스트 관련
  if (name.includes('ghost') || name.includes('specter') || name.includes('phantom') || name.includes('wraith') || 
      name.includes('banshee') || name.includes('undead') || desc.includes('ghost') || desc.includes('undead')) {
    return 'ghost';
  }
  
  // 드래곤 관련
  if (name.includes('dragon') || name.includes('wyrm') || name.includes('wyvern') || desc.includes('dragon')) {
    return 'dragon';
  }
  
  // 강철 관련
  if (name.includes('steel') || name.includes('iron') || name.includes('metal') || name.includes('armor') || desc.includes('steel')) {
    return 'steel';
  }
  
  // 악 관련
  if (name.includes('dark') || name.includes('shadow') || name.includes('evil') || name.includes('demon') || 
      name.includes('devil') || name.includes('corrupt') || desc.includes('dark') || desc.includes('evil')) {
    return 'dark';
  }
  
  // 페어리 관련
  if (name.includes('fairy') || name.includes('fae') || name.includes('sprite') || name.includes('pixie') || desc.includes('fairy')) {
    return 'fairy';
  }
  
  return 'normal';
}

// 몬스터 희귀도 추정 함수
function estimateMonsterRarity(monsterName: string, description: string): string {
  const name = monsterName.toLowerCase();
  const desc = description.toLowerCase();
  
  // 전설급
  if (name.includes('emperor') || name.includes('primordial') || name.includes('ancient') || 
      name.includes('avatar') || name.includes('god') || desc.includes('emperor')) {
    return 'legendary';
  }
  
  // 에픽급
  if (name.includes('archmage') || name.includes('titan') || name.includes('celestial') || 
      name.includes('herald') || name.includes('legate') || desc.includes('archmage')) {
    return 'epic';
  }
  
  // 희귀급
  if (name.includes('wizard') || name.includes('general') || name.includes('captain') || 
      name.includes('warrior') || name.includes('mage') || desc.includes('wizard')) {
    return 'rare';
  }
  
  // 고급급
  if (name.includes('archer') || name.includes('guard') || name.includes('assassin') || 
      name.includes('shaman') || name.includes('researcher') || desc.includes('archer')) {
    return 'uncommon';
  }
  
  return 'common';
}

// 몬스터 능력치 조정 함수
function adjustMonsterStats(monster: any, rarity: string): any {
  const rarityMultipliers = {
    common: { hp: 1.0, attack: 1.0, defense: 1.0 },
    uncommon: { hp: 1.2, attack: 1.2, defense: 1.2 },
    rare: { hp: 1.5, attack: 1.5, defense: 1.5 },
    epic: { hp: 2.0, attack: 2.0, defense: 2.0 },
    legendary: { hp: 3.0, attack: 3.0, defense: 3.0 }
  };
  
  const multiplier = rarityMultipliers[rarity as keyof typeof rarityMultipliers];
  
  return {
    ...monster,
    baseHp: Math.round(monster.baseHp * multiplier.hp),
    baseAttack: Math.round(monster.baseAttack * multiplier.attack),
    baseDefense: Math.round(monster.baseDefense * multiplier.defense),
    experienceReward: Math.round(monster.experienceReward * multiplier.hp),
    goldReward: Math.round(monster.goldReward * multiplier.attack)
  };
}

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

  console.log('몬스터 크롤링 시작...');

  // 각 던전별로 몬스터 크롤링
  for (const dungeon of dungeons) {
    console.log(`\n${dungeon.name} 크롤링 중...`);
    
    try {
      // 페이지 로드
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      
      // 던전 선택
      await page.selectOption('select.selectbox', dungeon.value);
      
      // 페이지 로딩 대기 (더 정교한 방법)
      await page.waitForTimeout(2000);
      await page.waitForLoadState('networkidle');
      
      // 테이블이 나타날 때까지 대기
      await page.waitForSelector('table', { timeout: 15000 });
      
      // 추가 대기 (동적 콘텐츠 로딩)
      await page.waitForTimeout(3000);

      // 몬스터 정보 추출 (여러 방법 시도)
      const monsters = await page.evaluate((dungeonName) => {
        const arr: any[] = [];
        
        // 방법 1: 첫 번째 테이블에서 몬스터 추출
        const tables = document.querySelectorAll('table');
        if (tables.length > 0) {
          const table = tables[0]; // 첫 번째 테이블
          const rows = Array.from(table.querySelectorAll('tr'));
          
          console.log(`테이블 행 수: ${rows.length}`);
          
          // 헤더 행을 제외하고 데이터 행만 처리
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.querySelectorAll('td');
            
            if (cells.length >= 8) {
              // 몬스터 이미지 찾기
              const imgEl = cells[0].querySelector('img');
              const nameEl = cells[1];
              
              if (imgEl && nameEl) {
                const imageUrl = imgEl.getAttribute('src');
                const imageFile = imageUrl ? imageUrl.split('/').pop() : '';
                const name = nameEl.textContent?.trim() || '';
                
                console.log(`이미지: ${imageFile}, 이름: ${name}`);
                
                // unit_ 접두사가 있는 이미지만 몬스터로 간주
                if (imageFile && imageFile.startsWith('unit_') && name) {
                  const hpEl = cells[2];
                  const dfEl = cells[3];
                  const dfmEl = cells[4];
                  const dmgEl = cells[5];
                  const expEl = cells[6];
                  const atkTypeEl = cells[7];
                  
                  const hp = hpEl ? parseInt(hpEl.textContent?.replace(/[^0-9]/g, '') || '10') : 10;
                  const df = dfEl ? parseInt(dfEl.textContent?.replace(/[^0-9]/g, '') || '5') : 5;
                  const dfm = dfmEl ? parseInt(dfmEl.textContent?.replace(/[^0-9]/g, '') || '5') : 5;
                  const dmg = dmgEl ? parseInt(dmgEl.textContent?.replace(/[^0-9]/g, '') || '5') : 5;
                  const exp = expEl ? parseInt(expEl.textContent?.replace(/[^0-9]/g, '') || '10') : 10;
                  const atkType = atkTypeEl?.textContent?.trim() || '근접, 물리';
                  
                  // 드롭 아이템 정보 추출
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
        
        // 방법 2: 모든 unit_ 이미지 찾기
        if (arr.length === 0) {
          const unitImages = document.querySelectorAll('img[src*="unit_"]');
          console.log(`unit_ 이미지 수: ${unitImages.length}`);
          
          unitImages.forEach((img, index) => {
            const imageUrl = img.getAttribute('src');
            const imageFile = imageUrl ? imageUrl.split('/').pop() : '';
            const name = img.getAttribute('alt') || `Monster ${index + 1}`;
            
            if (imageFile && name) {
              arr.push({
                name,
                hp: 10,
                df: 5,
                dfm: 5,
                dmg: 5,
                exp: 10,
                atkType: '근접, 물리',
                imageUrl,
                imageFile,
                dropItems: [],
                dungeonName
              });
            }
          });
        }
        
        return arr;
      }, dungeon.name);

      // 중복 제거 및 데이터 정리 (한글화 포함)
      for (const monster of monsters) {
        const existingMonster = allMonsters.find(m => m.name === monster.name);
        if (!existingMonster) {
          // 한글 이름 가져오기
          const koreanName = monsterKoreanNames[monster.name] || monster.name;
          
          // 몬스터 타입 추정
          const estimatedType = estimateMonsterType(monster.name, monster.description || '');
          
          // 몬스터 희귀도 추정
          const estimatedRarity = estimateMonsterRarity(monster.name, monster.description || '');
          
          // 능력치 조정
          const adjustedMonster = adjustMonsterStats({
            name: koreanName,
            description: `${koreanName} - ${monster.dungeonName}의 몬스터`,
            emoji: '👹',
            imageUrl: monster.imageFile ? `/monsters/${monster.imageFile}` : null,
            type: estimatedType,
            baseHp: monster.hp,
            baseAttack: monster.df,
            baseDefense: monster.dfm,
            hpGrowth: 1.1,
            attackGrowth: 1.1,
            defenseGrowth: 1.1,
            rarity: estimatedRarity,
            minLevel: Math.floor((dungeon.id - 1) * 5) + 1,
            maxLevel: dungeon.id * 10,
            experienceReward: monster.exp,
            goldReward: 5,
            dropRate: 0.15,
            imageFile: monster.imageFile
          }, estimatedRarity);
          
          allMonsters.push(adjustedMonster);
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
        const url = `${IMG_BASE}/images/${monster.imageFile}`;
        await downloadImage(url, monster.imageFile);
      } catch (e) {
        console.log('이미지 다운로드 실패:', monster.imageFile);
      }
    }
  }

  // 몬스터 시드 데이터 저장 (한글화된 데이터)
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
    dropRate: monster.dropRate
  }));

  writeFileSync(
    path.join(process.cwd(), 'scripts', 'monster_seed_korean_crawled.json'), 
    JSON.stringify(monsterSeedData, null, 2), 
    'utf-8'
  );

  console.log('시드 데이터 저장 완료');
  console.log(`몬스터: ${allMonsters.length}개`);
  
  // 통계 출력
  const typeStats: Record<string, number> = {};
  const rarityStats: Record<string, number> = {};
  
  allMonsters.forEach(monster => {
    typeStats[monster.type] = (typeStats[monster.type] || 0) + 1;
    rarityStats[monster.rarity] = (rarityStats[monster.rarity] || 0) + 1;
  });
  
  console.log('\n타입별 분포:');
  Object.entries(typeStats).forEach(([type, count]) => {
    const typeLabels: Record<string, string> = {
      normal: '노말', fire: '불꽃', water: '물', grass: '풀', electric: '전기', ice: '얼음', 
      fighting: '격투', poison: '독', ground: '땅', flying: '비행', psychic: '에스퍼', 
      bug: '벌레', rock: '바위', ghost: '고스트', dragon: '드래곤', steel: '강철', 
      dark: '악', fairy: '페어리'
    };
    console.log(`${typeLabels[type] || type}: ${count}개`);
  });
  
  console.log('\n희귀도별 분포:');
  Object.entries(rarityStats).forEach(([rarity, count]) => {
    const rarityLabels: Record<string, string> = {
      common: '일반', uncommon: '고급', rare: '희귀', epic: '에픽', legendary: '전설'
    };
    console.log(`${rarityLabels[rarity] || rarity}: ${count}개`);
  });

  await browser.close();
}

main(); 