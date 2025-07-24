import type { DogApiResponse, BreedListResponse, DogImage, DogBreed, ApiError } from '../types';

const DOG_API_BASE_URL = 'https://dog.ceo/api';

/**
 * Dog CEO API クライアント
 * 犬の画像と犬種情報を取得するためのサービス層
 */
export class DogApiService {
    /**
     * ランダムな犬の画像を取得
     */
    static async getRandomImage(): Promise<DogImage> {
        try {
            const response = await fetch(`${DOG_API_BASE_URL}/breeds/image/random`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: DogApiResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error('ランダム画像の取得に失敗しました');
            }

            const imageUrl = data.message as string;
            const breed = this.extractBreedFromUrl(imageUrl);

            return {
                id: this.generateImageId(imageUrl),
                url: imageUrl,
                breed,
                addedAt: new Date()
            };
        } catch (error) {
            throw this.handleApiError(error, 'ランダム画像の取得に失敗しました');
        }
    }

    /**
     * 特定の犬種の画像を取得
     */
    static async getBreedImage(breed: string): Promise<DogImage> {
        try {
            const response = await fetch(`${DOG_API_BASE_URL}/breed/${breed}/images/random`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: DogApiResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error(`${breed}の画像取得に失敗しました`);
            }

            const imageUrl = data.message as string;

            return {
                id: this.generateImageId(imageUrl),
                url: imageUrl,
                breed,
                addedAt: new Date()
            };
        } catch (error) {
            throw this.handleApiError(error, `${breed}の画像取得に失敗しました`);
        }
    }

    /**
     * 利用可能な犬種のリストを取得
     */
    static async getBreedsList(): Promise<string[]> {
        try {
            const response = await fetch(`${DOG_API_BASE_URL}/breeds/list/all`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: BreedListResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error('犬種リストの取得に失敗しました');
            }

            const breedsData = data.message;
            const breeds: string[] = [];

            // メイン犬種とサブ犬種を展開
            Object.entries(breedsData).forEach(([mainBreed, subBreeds]) => {
                breeds.push(mainBreed);

                // サブ犬種がある場合は "mainbreed/subbreed" 形式で追加
                if (subBreeds.length > 0) {
                    subBreeds.forEach(subBreed => {
                        breeds.push(`${mainBreed}/${subBreed}`);
                    });
                }
            });

            return breeds.sort();
        } catch (error) {
            throw this.handleApiError(error, '犬種リストの取得に失敗しました');
        }
    }

    /**
     * 複数の犬種画像を取得（将来の拡張用）
     */
    static async getMultipleBreedImages(breed: string, count: number = 3): Promise<DogImage[]> {
        try {
            const response = await fetch(`${DOG_API_BASE_URL}/breed/${breed}/images/random/${count}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: DogApiResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error(`${breed}の画像取得に失敗しました`);
            }

            const imageUrls = data.message as string[];

            return imageUrls.map(url => ({
                id: this.generateImageId(url),
                url,
                breed,
                addedAt: new Date()
            }));
        } catch (error) {
            throw this.handleApiError(error, `${breed}の画像取得に失敗しました`);
        }
    }

    /**
     * 画像URLから犬種名を抽出
     */
    private static extractBreedFromUrl(url: string): string | undefined {
        try {
            const match = url.match(/breeds\/([^/]+)/);
            return match ? match[1] : undefined;
        } catch {
            return undefined;
        }
    }

    /**
     * 画像URLからユニークなIDを生成
     */
    private static generateImageId(url: string): string {
        // URLは既に一意であることが保証されているため、URLをそのままIDとして使用
        return url;
    }

    /**
     * APIエラーを統一的に処理
     */
    private static handleApiError(error: unknown, defaultMessage: string): ApiError {
        if (error instanceof Error) {
            return {
                message: error.message,
                code: 'API_ERROR'
            };
        }

        return {
            message: defaultMessage,
            code: 'UNKNOWN_ERROR'
        };
    }

    /**
     * 全犬種リストを取得（DogBreed型で返す - 既存コンポーネント用）
     */
    static async getAllBreeds(): Promise<DogBreed[]> {
        try {
            const response = await fetch(`${DOG_API_BASE_URL}/breeds/list/all`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: BreedListResponse = await response.json();

            if (data.status !== 'success') {
                throw new Error('犬種リストの取得に失敗しました');
            }

            const breedsData = data.message;
            const breeds: DogBreed[] = [];

            // メイン犬種とサブ犬種を展開
            Object.entries(breedsData).forEach(([mainBreed, subBreeds]) => {
                breeds.push({
                    id: mainBreed,
                    name: mainBreed,
                    subBreeds: subBreeds
                });

                // サブ犬種がある場合は個別のエントリとして追加
                if (subBreeds.length > 0) {
                    subBreeds.forEach(subBreed => {
                        breeds.push({
                            id: `${mainBreed}/${subBreed}`,
                            name: `${mainBreed} (${subBreed})`,
                            subBreeds: []
                        });
                    });
                }
            });

            return breeds.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            throw this.handleApiError(error, '犬種リストの取得に失敗しました');
        }
    }

    /**
     * ネットワーク接続状態をチェック
     */
    static async checkConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${DOG_API_BASE_URL}/breeds/image/random`, {
                method: 'HEAD',
                cache: 'no-cache'
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}