/**
 * Manual test file for DogApiService
 * Run this in the browser console to test the API service functionality
 */

import { DogApiService } from './dogApi';

export async function testDogApiService() {
  console.log('🐕 Testing Dog API Service...\n');

  try {
    // Test 1: Get random image
    console.log('1. Testing getRandomImage()...');
    const randomImage = await DogApiService.getRandomImage();
    console.log('✅ Random image:', randomImage);
    console.log('   - ID:', randomImage.id);
    console.log('   - URL:', randomImage.url);
    console.log('   - Breed:', randomImage.breed);
    console.log('   - Added at:', randomImage.addedAt);
    console.log('');

    // Test 2: Get breeds list
    console.log('2. Testing getBreedsList()...');
    const breedsList = await DogApiService.getBreedsList();
    console.log('✅ Breeds list (first 10):', breedsList.slice(0, 10));
    console.log('   - Total breeds:', breedsList.length);
    console.log('');

    // Test 3: Get breed image
    console.log('3. Testing getBreedImage()...');
    const testBreed = 'labrador';
    const breedImage = await DogApiService.getBreedImage(testBreed);
    console.log(`✅ ${testBreed} image:`, breedImage);
    console.log('   - ID:', breedImage.id);
    console.log('   - URL:', breedImage.url);
    console.log('   - Breed:', breedImage.breed);
    console.log('');

    // Test 4: Get multiple breed images
    console.log('4. Testing getMultipleBreedImages()...');
    const multipleImages = await DogApiService.getMultipleBreedImages(testBreed, 2);
    console.log(`✅ Multiple ${testBreed} images:`, multipleImages);
    console.log('   - Count:', multipleImages.length);
    console.log('');

    // Test 5: Get all breeds (DogBreed format)
    console.log('5. Testing getAllBreeds()...');
    const allBreeds = await DogApiService.getAllBreeds();
    console.log('✅ All breeds (first 5):', allBreeds.slice(0, 5));
    console.log('   - Total breeds:', allBreeds.length);
    console.log('');

    // Test 6: Check connection
    console.log('6. Testing checkConnection()...');
    const isConnected = await DogApiService.checkConnection();
    console.log('✅ Connection status:', isConnected);
    console.log('');

    console.log('🎉 All tests passed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Export for manual testing
(window as any).testDogApiService = testDogApiService;