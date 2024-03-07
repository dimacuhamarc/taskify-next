'use client'

import Icon from '@/components/icon';
import AppTemplate from '@/templates/app-template';
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';
import axios from 'axios';

import formatTimeAgo from '@/utilities/date-formatter';

import { 
  UserData,
  UserTasks,
  UserCategories,
  initialCategory
} from '@/types/app-types';

import { 
  API_URL,
  DeleteCategory,
} from '@/utilities/services';

export default function Page({ params }: { params: {title: string}}) {
  const router = useRouter();
  const categorytitle = params.title.replace(/%20/g, ' ');

  const [category, setCategory] = useState<UserCategories>(initialCategory);
  const [tasks, setTasks] = useState<UserTasks[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/categories`, {
          headers: {
            'authorization': sessionStorage.getItem('token'),
            'Accept': 'application/json',
          }
        });
        if (response.data) {
          const category = response.data.find((category: any) => category.title === categorytitle);
          setCategory(category);
          console.log('got the category!')
        }
      }
      catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, [categorytitle]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/tasks`, {
          headers: {
            'authorization': sessionStorage.getItem('token'),
            'Accept': 'application/json',
          }
        });
        if (response.data) {
          if (response.data.length > 0) {
            const tasks = response.data.filter((task: any) => task.category_id === category.id);
            setTasks(tasks);
            console.log('got the tasks!')
          }
        }
      }
      catch (error) {
        console.error(error);
      }
    };
    if (category.id) {
      fetchTasks();
    }
  }, [category]);

  const deleteHandler = async (id: number) => {
    try {
      const response = await DeleteCategory(id);
      console.log(response);
      router.push('/categories');
    }
    catch (error) {
      console.error(error);
    }
  };
  
  return (
    <AppTemplate>
      <div className='w-full flex flex-row justify-between items-center'>
        <div className='flex flex-row justify-center items-center gap-4'>
          <button className='btn btn-sm btn-square btn-outline' onClick={() => router.push('/dashboard')}><Icon iconName='arrow-left-fill' className='text-lg'></Icon></button>
          <div className='flex flex-col'>
            <h1 className='text-4xl font-bold'>{category.title}</h1>
            <div className='flex flex-row items-center gap-4 -mt-4'>
              <h3 className='text-xl opacity-55'>{category.subtitle}</h3>
              <h3 className='mt-0.5 text-md opacity-55'>{'Last Edited '+formatTimeAgo(category.updated_at)}</h3>
            </div>
          </div>
        </div>
        <div className='*:mx-2 *:bg-opacity-25 *:text-neutral'> 
        {/* controls */}
          <button className='btn btn-square btn-primary hover:text-primary-content' onClick={() => router.push('/dashboard')}><Icon iconName='edit-fill' /></button>
          <button className='btn btn-square btn-error hover:text-error-content' onClick={() => deleteHandler(category.id)}><Icon iconName='delete-bin-6-fill' /></button>
        </div>
      </div>
      {
        tasks.map((task, index) => {
          return (
            <div key={index} className='w-full flex flex-row justify-between items-center gap-4'>
              <div className='flex flex-row items-center gap-4'>
                <div className='w-4 h-4 rounded-full bg-primary'></div>
                <h3 className='text-lg'>{task.title}</h3>
              </div>
              <div className='flex flex-row items-center gap-4'>
                <h3 className='text-md opacity-55'>{formatTimeAgo(task.updated_at)}</h3>
                <button className='btn btn-sm btn-square btn-primary hover:text-primary-content' onClick={() => router.push('/dashboard')}><Icon iconName='edit-fill' /></button>
                <button className='btn btn-sm btn-square btn-error hover:text-error-content' onClick={() => router.push('/dashboard')}><Icon iconName='delete-bin-6-fill' /></button>
              </div>
            </div>
          );
        })}
    </AppTemplate>
  );
}
