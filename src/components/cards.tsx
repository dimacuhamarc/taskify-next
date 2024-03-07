import { cn } from "@/utilities/tw-util";
import { UserCategories } from "@/types/app-types";
import formatTimeAgo from "@/utilities/date-formatter";

interface CategoryCardProps {
  className: string;
  category: UserCategories;
}

export function CategoryCard({ className, category }: CategoryCardProps) {
  return (
    <div className={cn(`btn btn-outline btn-primary animate-fade animate-once animate-ease-in flex flex-col justify-between p-6 h-auto`,className)}>
      <div>
        <h1 className="text-2xl font-bold">{category.title}</h1>
        <p className="text-base opacity-35">{category.subtitle}</p>
      </div>
      <p className="self-end font-thin text-base">{category.created_at === category.updated_at ? 'Created ' + formatTimeAgo(category.updated_at) : 'Edited ' + formatTimeAgo(category.updated_at)}</p>
    </div>
  );
}