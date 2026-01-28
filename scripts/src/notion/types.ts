export type NotionRichText = {
  plain_text: string;
  href?: string | null;
};

export type NotionPropertyValue =
  | {
      id: string;
      type: 'title';
      title: NotionRichText[];
    }
  | {
      id: string;
      type: 'rich_text';
      rich_text: NotionRichText[];
    }
  | {
      id: string;
      type: string;
      [key: string]: unknown;
    };

export type NotionPage = {
  id: string;
  properties: Record<string, NotionPropertyValue>;
};

