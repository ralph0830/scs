// 몬스터 영문 이름을 한글 이름으로 매핑
export const monsterKoreanNames: Record<string, string> = {
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
  
  // R9. [E]무서운 하강
  // 추가 몬스터들...
};

// 몬스터 타입 한글화
export const monsterTypeKorean: Record<string, string> = {
  "normal": "노말",
  "fire": "불꽃",
  "water": "물",
  "grass": "풀",
  "electric": "전기",
  "ice": "얼음",
  "fighting": "격투",
  "poison": "독",
  "ground": "땅",
  "flying": "비행",
  "psychic": "에스퍼",
  "bug": "벌레",
  "rock": "바위",
  "ghost": "고스트",
  "dragon": "드래곤",
  "steel": "강철",
  "dark": "악",
  "fairy": "페어리"
};

// 몬스터 희귀도 한글화
export const monsterRarityKorean: Record<string, string> = {
  "common": "일반",
  "uncommon": "고급",
  "rare": "희귀",
  "epic": "에픽",
  "legendary": "전설"
}; 