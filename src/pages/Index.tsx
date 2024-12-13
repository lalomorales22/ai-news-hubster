import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NewsCard } from "@/components/NewsCard";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { RSS_FEED_URLS, fetchRSSFeed, categorizeArticle, type FeedItem } from "@/lib/rss";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: articles = [], refetch, isLoading } = useQuery({
    queryKey: ["rss-feeds"],
    queryFn: async () => {
      const allArticles = await Promise.all(
        RSS_FEED_URLS.map((url) => fetchRSSFeed(url))
      );
      return allArticles.flat();
    },
  });

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchTerm === "" ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());

    const category = categorizeArticle(article);
    const matchesCategory = !selectedCategory || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Feeds refreshed",
      description: "Your news feed has been updated with the latest articles.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">AI Tech News</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest in AI and technology
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_200px]">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[300px] rounded-lg bg-white/80 animate-pulse"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredArticles.map((article, index) => (
                <NewsCard key={article.link + index} item={article} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;