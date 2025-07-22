import type { DogApiResponse, DogBreed } from '../types';

const DOG_API_BASE_URL = 'https://dog.ceo/api';

export class DogApiService {
  // 全犬種リストを取得
  static async getAllBreeds(): Promise<DogBreed[]> {
    const response = await fetch(`${DOG_API_BASE_URL}/breeds/list/all`);
    const data: DogApiResponse = await response.json();
    
    if (data.status !== 'success') {
      throw new Error('犬種データの取得に失敗しました');
    }

    const breedsData = data.message as Record<string, string[]>;
    return Object.entries(breedsData).map(([breed, subBreeds]) => ({
      id: breed,
      name: breed,
      imageUrl: '', // 後で画像を取得
      subBreeds: subBreeds.length > 0 ? subBreeds : undefined
    }));
  }

  // 特定の犬種の画像を取得
  static async getBreedImage(breed: string): Promise<string> {
    const response = await fetch(`${DOG_API_BASE_URL}/breed/${breed}/images/random`);
    const data: DogApiResponse = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(`${breed}の画像取得に失敗しました`);
    }

    return data.message as string;
  }

  // 複数の犬種画像を取得
  static async getMultipleBreedImages(breed: string, count: number = 3): Promise<string[]> {
    const response = await fetch(`${DOG_API_BASE_URL}/breed/${breed}/images/random/${count}`);
    const data: DogApiResponse = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(`${breed}の画像取得に失敗しました`);
    }

    return data.message as string[];
  }
}