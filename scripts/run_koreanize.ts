import { writeFileSync } from 'fs';
import path from 'path';

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

async function main() {
  console.log('몬스터 한글화 시작...');
  
  // 기존 몬스터 데이터 읽기
  const fs = require('fs');
  const monsterData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'scripts', 'monster_seed.json'), 'utf-8'));
  
  const koreanizedMonsters = monsterData.map((monster: any) => {
    // 한글 이름 가져오기
    const koreanName = monsterKoreanNames[monster.name] || monster.name;
    
    // 몬스터 타입 추정
    const estimatedType = estimateMonsterType(monster.name, monster.description);
    
    // 몬스터 희귀도 추정
    const estimatedRarity = estimateMonsterRarity(monster.name, monster.description);
    
    // 능력치 조정
    const adjustedMonster = adjustMonsterStats(monster, estimatedRarity);
    
    return {
      ...adjustedMonster,
      name: koreanName,
      description: `${koreanName} - ${monster.description.split(' - ')[1] || '던전의 몬스터'}`,
      type: estimatedType,
      rarity: estimatedRarity
    };
  });
  
  // 한글화된 몬스터 데이터 저장
  writeFileSync(
    path.join(process.cwd(), 'scripts', 'monster_seed_korean.json'), 
    JSON.stringify(koreanizedMonsters, null, 2), 
    'utf-8'
  );
  
  console.log(`몬스터 한글화 완료: ${koreanizedMonsters.length}개`);
  
  // 통계 출력
  const typeStats: Record<string, number> = {};
  const rarityStats: Record<string, number> = {};
  
  koreanizedMonsters.forEach(monster => {
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
}

main(); 