'use client'

import { useState, useEffect } from 'react';

import AppTemplate from "@/templates/app-template";
import { UserData, UserTasks } from '@/types/app-types';

import { GetUserInfo, API_URL } from '@/utilities/services';

import axios from 'axios';
import { TaskCard } from '@/components/cards';


export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uncategorizedTasks, setUncategorizedTasks] = useState<UserTasks[]>([]);

  useEffect(() => {
    const fetchUncategorizedTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/tasks/uncategorized`, {
          headers: {
            'authorization': sessionStorage.getItem('token'),
            'Accept': 'application/json',
          }
        });
        if (response.data) {
          setUncategorizedTasks(response.data);
          console.log(uncategorizedTasks);
          console.log('got the uncategorized tasks!');
        }
      }
      catch (error) {
        console.error(error);
      }
    };
    fetchUncategorizedTasks();
  },[2]);



  useEffect(() => {
    if (userData === null) {
      const user = GetUserInfo();
      setUserData(user);
      console.log('got user data!');
    }
  },[userData]);

  return (
    <AppTemplate>
      
      <div className='flex flex-row justify-between items-center'>
        <h1 className='text-4xl'>Your priorities for today!</h1>
        <div className='text-right'>
          <h1>Welcome to Dashboard, {userData?.name}</h1>
          <h2>{userData?.email} | UID : {userData?.id}</h2>
        </div>
      </div>
      <div className='flex flex-row w-full'>
        <div className='flex flex-grow flex-col'>
          <h2 className='text-2xl font-bold'>Pending Tasks</h2>
          <p>Coming soon!</p>
        </div>
        <div className='flex flex-grow flex-col'>
          <h2 className='text-2xl font-bold'>Uncategorized Tasks</h2>
          {
            uncategorizedTasks.length > 0 && uncategorizedTasks.map((task, index) => {
              return (
                <TaskCard key={task.id} task={task} className=''/>
              )
            })
          }
        </div>
      </div>
    </AppTemplate>
  );
}