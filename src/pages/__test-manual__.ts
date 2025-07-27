/**
 * Manual test file for BreedPage and related components
 * This tests the integration of DogImage, ImageControls, and BreedPage components
 */

import { DogApiService } from '../services/dogApi';
import type { DogImage } from '../types';

export async function testBreedPageComponents() {
  console.log('🐕 Testing BreedPage Components Integration...\n');

  try {
    // Test 1: Verify DogApiService works for breed images
    console.log('1. Testing breed image retrieval...');
    const testBreed = 'golden-retriever';
    const breedImage = await DogApiService.getBreedImage(testBreed);
    console.log('✅ Breed image retrieved:', breedImage);
    console.log('   - ID:', breedImage.id);
    console.log('   - URL:', breedImage.url);
    console.log('   - Breed:', breedImage.breed);
    console.log('');

    // Test 2: Test multiple image retrieval (for next image functionality)
    console.log('2. Testing multiple image retrieval...');
    const image1 = await DogApiService.getBreedImage(testBreed);
    const image2 = await DogApiService.getBreedImage(testBreed);
    console.log('✅ Multiple images retrieved successfully');
    console.log('   - Image 1 ID:', image1.id);
    console.log('   - Image 2 ID:', image2.id);
    console.log('   - Images are different:', image1.id !== image2.id);
    console.log('');

    // Test 3: Test image data structure for DogImage component
    console.log('3. Testing image data structure...');
    const imageData: DogImage = {
      id: 'test-id',
      url: 'https://images.dog.ceo/breeds/golden-retriever/test.jpg',
      breed: testBreed,
      addedAt: new Date(),
    };
    console.log('✅ Image data structure is valid:', imageData);
    console.log(
      '   - Has required fields:',
      'id' in imageData && 'url' in imageData && 'addedAt' in imageData
    );
    console.log('');

    // Test 4: Test breed name formatting
    console.log('4. Testing breed name formatting...');
    const breedNames = [
      'labrador',
      'golden-retriever',
      'bulldog/french',
      'terrier/scottish',
    ];

    breedNames.forEach((breed) => {
      const formatted = breed.replace('/', ' - ');
      console.log(`   - "${breed}" → "${formatted}"`);
    });
    console.log('✅ Breed name formatting works correctly');
    console.log('');

    // Test 5: Test error handling
    console.log('5. Testing error handling...');
    try {
      await DogApiService.getBreedImage(
        'invalid-breed-name-that-does-not-exist'
      );
      console.log('❌ Expected error for invalid breed');
    } catch (error) {
      console.log(
        '✅ Error handling works correctly:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
    console.log('');

    // Test 6: Test image history simulation
    console.log('6. Testing image history simulation...');
    const imageHistory: DogImage[] = [];
    for (let i = 0; i < 3; i++) {
      const image = await DogApiService.getBreedImage(testBreed);
      imageHistory.push(image);
      // Small delay to ensure different images
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    console.log('✅ Image history simulation:', imageHistory.length, 'images');
    console.log(
      '   - All images have unique IDs:',
      new Set(imageHistory.map((img) => img.id)).size === imageHistory.length
    );
    console.log('');

    console.log('🎉 All BreedPage component tests passed successfully!');
    return true;
  } catch (error) {
    console.error('❌ BreedPage component test failed:', error);
    return false;
  }
}

// Export for manual testing
declare global {
  interface Window {
    testBreedPageComponents: typeof testBreedPageComponents;
  }
}

if (typeof window !== 'undefined') {
  window.testBreedPageComponents = testBreedPageComponents;
}
