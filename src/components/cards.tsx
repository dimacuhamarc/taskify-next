'use client';

import { cn } from '@/utilities/tw-util';
import { UserCategories, UserTasks } from '@/types/app-types';
import formatTimeAgo from '@/utilities/date-formatter';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';

import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { API_URL } from '@/utilities/services';

interface CategoryCardProps {
  className: string;
  category: UserCategories;
}

export function CategoryCard({ className, category }: CategoryCardProps) {
  const [thisCategoryTasks, setThisCategoryTasks] = useState<UserTasks[]>([]);

  const doneTasks = thisCategoryTasks.filter(task => task.status.toUpperCase() === 'DONE');
  const router = useRouter();

  useEffect(() => {
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
      <div
        className={`flex flex-col gap-4 ${
          thisCategoryTasks.length > 0 ? 'self-start' : ''
        }`}
      >
        {thisCategoryTasks.length > 0 ? (
          <>
            <div className="flex flex-col items-start justify-start">
              <span className="font-bold">
                {thisCategoryTasks.length} Tasks
              </span>
              <p className="text-base font-light">In This Category</p>
            </div>
            <div className="flex flex-col items-start justify-start">
              <span className="font-bold">
                {doneTasks.length} {doneTasks.length === 1 ? 'Task' : 'Tasks'}
              </span>
              <p className="text-base font-light">Done</p>
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

interface TaskCardProps {
  className: string;
  task: UserTasks;
}

type TaskStatus = 'DONE' | 'IN PROGRESS';
type IconStatus = 'checkbox-fill' | 'checkbox-blank-fill';
type Color = 'text-success-content' | 'text-primary';
type ColorStatus = 'btn-success' | 'btn-primary';
type BGColorStatus = 'bg-success' | 'bg-primary';

type taskCardStatus = {
  status: TaskStatus;
  text: Color;
  color: ColorStatus;
  bg: BGColorStatus;
  icon: IconStatus
}

export function TaskCard({ className, task }: TaskCardProps) {
  const [isToggled, setIsToggled] = useState(false);
  const [TaskStatus, setTaskStatus] = useState<taskCardStatus>();
  const router = useRouter();

  useEffect(() => {
    if (task.status.toUpperCase() === 'DONE') {
      setTaskStatus({status: 'DONE', color: 'btn-success', text:'text-success-content', bg: 'bg-success', icon: 'checkbox-fill'});
    } else {
      setTaskStatus({status: 'IN PROGRESS', color: 'btn-primary', text:'text-primary', bg:'bg-primary', icon: 'checkbox-blank-fill'});
    }
    console.log('render');
  }, [1]);

  const toggleHandler = () => {
    setIsToggled(!isToggled);
  }

  const toggleStatus = () => {
    if (TaskStatus?.status === 'DONE') {
      setTaskStatus({status: 'IN PROGRESS', color: 'btn-primary', text:'text-primary', bg:'bg-primary', icon: 'checkbox-blank-fill'});
    } else {
      setTaskStatus({status: 'DONE', color: 'btn-success', text:'text-success-content', bg: 'bg-success', icon: 'checkbox-fill'});
    }
  }

  return (
    <>
      <div className='w-full flex flex-row gap-2 justify-center'>
        <button
          className={`btn btn-square ${TaskStatus?.color} hover:text-primary-content`}
          onClick={() => toggleStatus()}
        >
          <Icon iconName={TaskStatus?.icon} className={`${TaskStatus?.text} text-2xl`} />
        </button>
        <div
          className={`flex-grow btn ${TaskStatus?.color} flex flex-col justify-center items-center gap-4 mb-2`} onClick={toggleHandler}>
          <div className="flex flex-row items-center gap-4">
            <h3 className="text-lg">{task.title}</h3>
          </div>
          <div className="flex flex-row items-center gap-4">
            <h3 className="text-md opacity-55">
              {formatTimeAgo(task.updated_at)}
            </h3>
          </div>
        </div>
        <button
          className="btn btn-square btn-primary bg-opacity-25 text-neutral hover:text-primary-content"
          onClick={() => router.push('/tasks/' + task.id)}
        >
          <Icon iconName="edit-fill" />
        </button>
        <button
          className="btn btn-square btn-error bg-opacity-25 text-neutral hover:text-error-content"
          onClick={() => router.push('/tasks/' + task.id)}
        >
          <Icon iconName="delete-bin-6-fill" />
        </button>
      </div>
      {isToggled && 
        <div className="flex flex-col items-center justify-center gap-4">
          <div key="isToggled" className={`w-full flex flex-col gap-4 ${TaskStatus?.bg} bg-opacity-55 text-primary-content p-6 mb-2 animate-fade animate-once animate-ease-out rounded-lg`}>
            <div>
              <h1 className='text-xl'>Task Description</h1>
              <p className="text-lg font-light">{task.description}</p>
            </div>
            <p className='text-base font-light'>Last Created {formatTimeAgo(task.created_at)}</p>
          </div>
        </div>
      }
    </>
  );
}
