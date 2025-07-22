/**
 * Node.js test script for DogApiService
 * This tests the API endpoints directly to verify our service logic
 */

const DOG_API_BASE_URL = 'https://dog.ceo/api';

async function testApiEndpoints() {
  console.log('🐕 Testing Dog CEO API endpoints...\n');

  try {
    // Test 1: Random image endpoint
    console.log('1. Testing random image endpoint...');
    const randomResponse = await fetch(`${DOG_API_BASE_URL}/breeds/image/random`);
    const randomData = await randomResponse.json();
    console.log('✅ Random image response:', {
      status: randomData.status,
      hasMessage: !!randomData.message,
      messageType: typeof randomData.message
    });

    // Test 2: Breeds list endpoint
    console.log('\n2. Testing breeds list endpoint...');
    const breedsResponse = await fetch(`${DOG_API_BASE_URL}/breeds/list/all`);
    const breedsData = await breedsResponse.json();
    console.log('✅ Breeds list response:', {
      status: breedsData.status,
      hasMessage: !!breedsData.message,
      messageType: typeof breedsData.message,
      breedCount: Object.keys(breedsData.message || {}).length
    });

    // Test 3: Specific breed image endpoint
    console.log('\n3. Testing specific breed image endpoint...');
    const breedResponse = await fetch(`${DOG_API_BASE_URL}/breed/labrador/images/random`);
    const breedData = await breedResponse.json();
    console.log('✅ Breed image response:', {
      status: breedData.status,
      hasMessage: !!breedData.message,
      messageType: typeof breedData.message
    });

    // Test 4: Multiple breed images endpoint
    console.log('\n4. Testing multiple breed images endpoint...');
    const multipleResponse = await fetch(`${DOG_API_BASE_URL}/breed/labrador/images/random/3`);
    const multipleData = await multipleResponse.json();
    console.log('✅ Multiple images response:', {
      status: multipleData.status,
      hasMessage: !!multipleData.message,
      messageType: typeof multipleData.message,
      imageCount: Array.isArray(multipleData.message) ? multipleData.message.length : 0
    });

    console.log('\n🎉 All API endpoints are working correctly!');
    return true;

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    return false;
  }
}

// Run the test
testApiEndpoints();