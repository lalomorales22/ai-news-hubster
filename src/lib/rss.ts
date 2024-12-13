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
  // Existing feeds
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
  
  // New RSS feeds
  'https://venturebeat.com/feed/',
  'https://www.wired.com/category/gear/feed/',
  'https://www.zdnet.com/topic/ai/feed/',
  'https://analyticsindiamag.com/feed/',
  'https://www.technologyreview.com/feed/',
  'https://www.theverge.com/rss/ai/index.xml'
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
    // Use a CORS proxy to fetch RSS feeds
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const response = await fetch(corsProxy + encodeURIComponent(url));
    if (!response.ok) throw new Error('Network response was not ok');
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const items = Array.from(xmlDoc.querySelectorAll('item'));
    const feedTitle = xmlDoc.querySelector('channel > title')?.textContent || url;
    
    return items.map(item => ({
      title: item.querySelector('title')?.textContent || '',
      link: item.querySelector('link')?.textContent || '',
      content: item.querySelector('description')?.textContent || '',
      contentSnippet: item.querySelector('description')?.textContent?.slice(0, 200) || '',
      isoDate: item.querySelector('pubDate')?.textContent || '',
      categories: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent || ''),
      creator: item.querySelector('dc\\:creator, creator')?.textContent || '',
      source: feedTitle,
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
