import { writeFileSync } from 'fs';
import path from 'path';
import { monsterKoreanNames, monsterTypeKorean, monsterRarityKorean } from './monster_korean_mapping';
import monsterData from './monster_seed.json';

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

async function koreanizeMonsters() {
  console.log('몬스터 한글화 시작...');
  
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
    console.log(`${monsterTypeKorean[type] || type}: ${count}개`);
  });
  
  console.log('\n희귀도별 분포:');
  Object.entries(rarityStats).forEach(([rarity, count]) => {
    console.log(`${monsterRarityKorean[rarity] || rarity}: ${count}개`);
  });
}

koreanizeMonsters(); 