import 'dotenv/config'
import { db } from '../db'
import { items } from '../db/schema'
import { readFileSync } from 'fs'
import path from 'path'

async function seedItems() {
  console.log('🌱 Seeding items...');

  try {
    // 기존 아이템 데이터 삭제
    await db.delete(items);
    console.log('Cleared existing items');

    // 아이템 시드 데이터 읽기
    const itemSeedPath = path.join(process.cwd(), 'scripts', 'item_seed.json');
    const itemData = JSON.parse(readFileSync(itemSeedPath, 'utf-8'));
    
    // 데이터 검증 및 정리
    const validatedItemData = itemData.map((item: any) => ({
      name: item.name || '알 수 없는 아이템',
      description: item.description || '',
      type: item.type || 'material',
      rarity: item.rarity || 'common',
      effect: item.effect || '',
      price: item.price || null,
      imageUrl: item.imageUrl || null
    }));
    
    // 아이템 데이터 삽입
    await db.insert(items).values(validatedItemData);
    console.log(`✅ Added ${validatedItemData.length} items successfully!`);
    
  } catch (error) {
    console.error('❌ Error seeding items:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedItems(); 