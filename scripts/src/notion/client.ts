import axios, { AxiosInstance } from 'axios';

const DEFAULT_NOTION_VERSION = '2022-06-28';

export class NotionClient {
  private readonly http: AxiosInstance;

  constructor(apiKey: string, version?: string) {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('NOTION_API_KEY is required to fetch Notion data.');
    }

    this.http = axios.create({
      baseURL: 'https://api.notion.com/v1',
      timeout: 20000,
      maxRedirects: 5,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': version && version.trim().length > 0 ? version : DEFAULT_NOTION_VERSION,
      },
    });
  }

  async queryDatabase<T = unknown>(databaseId: string, pageSize = 100): Promise<T[]> {
    if (!databaseId || databaseId.trim().length === 0) {
      throw new Error('A valid Notion database ID is required.');
    }

    const results: T[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const payload: Record<string, unknown> = { page_size: pageSize };
      if (startCursor) payload.start_cursor = startCursor;

      const response = await this.http.post<{ results: T[]; has_more: boolean; next_cursor?: string }>(
        `/databases/${databaseId}/query`,
        payload,
        {
          responseType: 'json',
        },
      );

      if (Array.isArray(response.data?.results)) {
        results.push(...response.data.results);
      }

      hasMore = Boolean(response.data?.has_more);
      startCursor = response.data?.next_cursor ?? undefined;
    }

    return results;
  }
}

