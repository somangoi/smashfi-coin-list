import { Coin } from '../types/coin';

export async function getCoins(): Promise<Coin[]> {
  const response = await fetch('/api/coins');
  if (!response.ok) {
    throw new Error('Failed to fetch coins');
  }
  return response.json();
}
