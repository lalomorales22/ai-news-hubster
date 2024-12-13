import { CATEGORIES } from "@/lib/rss";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (category: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(null)}
        className="backdrop-blur-sm bg-white/80"
      >
        All
      </Button>
      {Object.keys(CATEGORIES).map((category) => (
        <Button
          key={category}
          variant={selected === category ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(category)}
          className={cn(
            "backdrop-blur-sm bg-white/80",
            selected === category && "bg-primary text-primary-foreground"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}