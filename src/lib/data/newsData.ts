export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string;
}

export const newsData: NewsItem[] = [
  {
    slug: "framework-launch-2026",
    title: "NIRRMPT Unveils Digital Resource Management Framework",
    date: "September 10, 2026",
    category: "Gazette & Directives",
    summary: "A milestone national framework established for real-time tracking and ecological compliance.",
    content: "Full detailed release text goes here...",
  },
];