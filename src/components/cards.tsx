'use client';

import { cn } from '@/utilities/tw-util';
import { UserCategories, UserTasks } from '@/types/app-types';
import formatTimeAgo from '@/utilities/date-formatter';
import { useRouter } from 'next/navigation';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { API_URL } from '@/utilities/services';

interface CategoryCardProps {
  className: string;
  category: UserCategories;
}

export function CategoryCard({ className, category }: CategoryCardProps) {
  const [thisCategoryTasks, setThisCategoryTasks] = useState<UserTasks[]>([]);
  const router = useRouter();


  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/tasks`, {
        headers: {
          authorization: sessionStorage.getItem('token'),
          Accept: 'application/json',
        },
      });
      if (response.data) {
        const tasks = response.data.filter(
          (task: any) => task.category_id === category.id
        );
        setThisCategoryTasks(tasks);
        console.log('got the tasks!');
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // fetch every 5 seconds
    fetchTasks();
  }, [thisCategoryTasks.length]);

  const clickHandler = () => {
    router.push('/categories/' + category.title);
  };
  return (
    <div
      className={cn(
        `btn btn-outline btn-primary animate-fade animate-once animate-ease-in flex flex-col justify-between p-6 h-auto group`,
        className
      )}
      onClick={clickHandler}
    >
      <div>
        <h1 className="text-2xl font-bold">{category.title}</h1>
        <p className="text-base opacity-35">{category.subtitle}</p>
      </div>
      <div className={`flex flex-col gap-4 ${thisCategoryTasks.length > 0 ? 'self-start' : ''}`}>
        {thisCategoryTasks.length > 0 ? (
          <>
            <div className="flex flex-col items-start justify-start">
              <span className="font-bold">{thisCategoryTasks.length} Tasks</span>
              <p className="text-base font-light">
                In This Category
              </p>
            </div>
            <div className="flex flex-col items-start justify-start">
              <span className="font-bold">{thisCategoryTasks.length} Tasks</span>
              <p className="text-base font-light">
                Started/Ongoing
              </p>
            </div>
          </>
        ) : (
          <p className="text-base font-bold">
            This category has no tasks yet! :{'('}
          </p>
        )}
      </div>
      <p className="self-end font-thin text-base">
        {category.created_at === category.updated_at
          ? 'Created ' + formatTimeAgo(category.updated_at)
          : 'Edited ' + formatTimeAgo(category.updated_at)}
      </p>
    </div>
  );
}
