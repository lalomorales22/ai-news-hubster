import { FeedItem } from "@/lib/rss";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function NewsCard({ item }: { item: FeedItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm bg-white/80">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {item.source}
            </Badge>
            {item.categories?.[0] && (
              <Badge variant="outline" className="text-xs">
                {item.categories[0]}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg font-medium line-clamp-2">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-200"
            >
              {item.title}
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.contentSnippet}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{item.creator}</span>
            {item.isoDate && (
              <span>{new Date(item.isoDate).toLocaleDateString()}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}