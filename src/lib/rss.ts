import Parser from 'rss-parser';

const parser = new Parser();

export type FeedItem = {
  title: string;
  link: string;
  content: string;
  contentSnippet?: string;
  isoDate?: string;
  categories?: string[];
  creator?: string;
  source?: string;
};

export const RSS_FEED_URLS = [
  'https://tldr.tech/api/rss/tech',
  'http://feeds.feedburner.com/TechCrunch/',
  'https://techcrunch.com/feed/',
  'https://www.artificialintelligence-news.com/feed/',
  'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml',
  'https://news.mit.edu/rss/topic/artificial-intelligence-machine-learning',
  'https://news.mit.edu/rss/topic/robotics',
  'https://news.mit.edu/rss/topic/algorithms',
  'https://news.mit.edu/rss/topic/computing',
  'https://news.mit.edu/rss/topic/human-computer-interaction',
];

export const CATEGORIES = {
  'AI & ML': ['artificial-intelligence', 'machine-learning', 'ai', 'ml'],
  'Robotics': ['robotics', 'robots'],
  'Computing': ['computing', 'computer-science', 'algorithms'],
  'Tech News': ['tech', 'technology'],
  'HCI': ['human-computer-interaction', 'hci', 'ui', 'ux'],
} as const;

export async function fetchRSSFeed(url: string): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map(item => ({
      title: item.title || '',
      link: item.link || '',
      content: item.content || item.description || '',
      contentSnippet: item.contentSnippet || '',
      isoDate: item.isoDate,
      categories: item.categories,
      creator: item.creator,
      source: feed.title || url,
    }));
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}:`, error);
    return [];
  }
}

export function categorizeArticle(item: FeedItem): string {
  const content = `${item.title} ${item.content}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category;
    }
  }
  
  return 'Tech News';
}