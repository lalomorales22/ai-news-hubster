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
  // AI & ML Specific Feeds
  'https://blogs.nvidia.com/feed/',
  'https://theaisummer.com/feed.xml',
  'https://www.kdnuggets.com/feed',
  'https://www.marktechpost.com/feed/',
  'https://machinelearningmastery.com/feed/',
  'https://blog.paperspace.com/rss/',
  'https://www.aiweirdness.com/rss/',
  'https://huggingface.co/blog/feed.xml',
  'https://openai.com/blog/rss/',
  'https://deepmind.com/blog/feed/basic/',
  'https://www.artificialintelligence-news.com/feed/',
  'https://stability.ai/blog?format=rss',
  'https://blog.eleuther.ai/index.xml',
  'https://www.together.xyz/blog?format=rss',
  'https://neptune.ai/blog/feed',
  
  // Academic & Research
  'https://arxiv.org/rss/cs.CL',
  'https://arxiv.org/rss/cs.CV',
  'https://arxiv.org/rss/cs.LG',
  'https://arxiv.org/rss/stat.ML',
  'https://bair.berkeley.edu/blog/feed.xml',
  'https://crfm.stanford.edu/feed',
  'https://blog.ml.cmu.edu/feed',
  'https://www.nature.com/subjects/machine-learning.rss',
  
  // Tech News & Analysis
  'https://techmeme.com/feed.xml',
  'https://feeds.arstechnica.com/arstechnica/index',
  'https://www.engadget.com/rss.xml',
  'https://theverge.com/rss/index.xml',
  'https://www.wired.com/feed/category/business/latest/rss',
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
  'https://www.technologyreview.com/feed/',
  'https://www.zdnet.com/topic/artificial-intelligence/rss.xml',
  'https://venturebeat.com/category/ai/feed/',
  'https://www.theguardian.com/technology/artificialintelligenceai/rss',
  'https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml',
  
  // Industry & Applications
  'https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss',
  'https://insidebigdata.com/feed',
  'https://www.datanami.com/feed/',
  'https://blog.langchain.dev/rss/',
  'https://www.assemblyai.com/blog/rss/',
  'https://developer.nvidia.com/blog/feed',
  
  // MIT Feeds
  'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml',
  'https://news.mit.edu/rss/topic/artificial-intelligence-machine-learning',
  'https://news.mit.edu/rss/topic/robotics',
  'https://news.mit.edu/rss/topic/algorithms',
  'https://news.mit.edu/rss/topic/computing',
  'https://news.mit.edu/rss/topic/human-computer-interaction',
  'https://news.mit.edu/topic/mitmachine-learning-rss.xml'
];

export const CATEGORIES = {
  'AI & ML': ['artificial-intelligence', 'machine-learning', 'ai', 'ml', 'deep-learning', 'neural-networks'],
  'Robotics': ['robotics', 'robots', 'automation'],
  'Computing': ['computing', 'computer-science', 'algorithms', 'programming'],
  'Tech News': ['tech', 'technology', 'innovation'],
  'HCI': ['human-computer-interaction', 'hci', 'ui', 'ux'],
  'Research': ['research', 'academic', 'paper', 'arxiv']
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
