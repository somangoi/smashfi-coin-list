import { Coin } from "../types/coin";

export interface GetCoinsParams {
  query?: string;
  sort?: string;
  page?: number;
  limit?: number;
  ids?: string;
}

export interface GetCoinsResponse {
  data: Coin[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function getCoins(params?: GetCoinsParams): Promise<GetCoinsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.query) searchParams.set("q", params.query);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.page) searchParams.set("page", params.page.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.ids) searchParams.set("ids", params.ids);

  const url = `/api/coins${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch coins");
  }

  const result: GetCoinsResponse = await response.json();
  return result;
}
