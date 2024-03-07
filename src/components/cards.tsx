'use client'

import { cn } from "@/utilities/tw-util";
import { UserCategories } from "@/types/app-types";
import formatTimeAgo from "@/utilities/date-formatter";
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  className: string;
  category: UserCategories;
}

export function CategoryCard({ className, category }: CategoryCardProps) {
  const router = useRouter();

  const clickHandler = () => {
    router.push('/categories/'+category.title);
  }
  return (
    <div className={cn(`btn btn-outline btn-primary animate-fade animate-once animate-ease-in flex flex-col justify-between p-6 h-auto`,className)} onClick={clickHandler}>
      <div>
        <h1 className="text-2xl font-bold">{category.title}</h1>
        <p className="text-base opacity-35">{category.subtitle}</p>
      </div>
      <p className="self-end font-thin text-base">{category.created_at === category.updated_at ? 'Created ' + formatTimeAgo(category.updated_at) : 'Edited ' + formatTimeAgo(category.updated_at)}</p>
    </div>
  );
}