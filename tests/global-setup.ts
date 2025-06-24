import { db } from '../db';
import { users, critters, userCritters } from '../db/schema';
import { eq } from 'drizzle-orm';

async function globalSetup() {
  console.log('--- Starting global test setup ---');

  try {
    // 1. Find the test user
    const testUserName = 'testuser';
    const userResult = await db.select({ id: users.id }).from(users).where(eq(users.username, testUserName)).limit(1);
    
    if (userResult.length === 0) {
      throw new Error(`Test user "${testUserName}" not found in the database.`);
    }
    const userId = userResult[0].id;
    console.log(`Found test user "${testUserName}" with ID: ${userId}`);

    // 2. Check if the user already has critters
    const existingUserCritters = await db.select().from(userCritters).where(eq(userCritters.userId, userId)).limit(1);
    if (existingUserCritters.length > 0) {
      console.log('Test user already has critters. Skipping seeding.');
      console.log('--- Global test setup finished ---');
      return;
    }

    // 3. Find first 3 critters from the database
    const crittersToSeed = await db.select({ id: critters.id }).from(critters).limit(3);
    if (crittersToSeed.length < 3) {
      throw new Error('Not enough critters in the database to seed. Need at least 3.');
    }
    console.log(`Found ${crittersToSeed.length} critters to seed.`);

    // 4. Assign these critters to the test user
    const newUserCritters = crittersToSeed.map(critter => ({
      userId: userId,
      critterId: critter.id,
      level: 5, // Default level
      experience: 0,
      hp: 50, // Default HP, should be based on critter base stats
      attack: 10,
      defense: 10,
    }));

    await db.insert(userCritters).values(newUserCritters);
    console.log(`Successfully seeded ${newUserCritters.length} critters for user "${testUserName}".`);

  } catch (error) {
    console.error('Error during global test setup:', error);
    process.exit(1);
  }

  console.log('--- Global test setup finished ---');
}

export default globalSetup; 