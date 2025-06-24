import { db } from '../db';
import { critters } from '../db/schema';

async function updateCritterImages() {
  console.log('Updating all critter images to default...');
  
  try {
    const result = await db
      .update(critters)
      .set({ imageUrl: '/critters/no-image.png' });
    
    console.log(`Successfully updated images for all critters.`);
    console.log('Result:', result);
    
  } catch (error) {
    console.error('Error updating critter images:', error);
  }
}

updateCritterImages(); 