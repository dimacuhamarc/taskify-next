'use client'

import { useState, useEffect } from 'react';

import AppTemplate from "@/templates/app-template";
import { UserData } from '@/types/app-types';

import { GetUserInfo } from '@/utilities/services';

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    if (userData === null) {
      const user = GetUserInfo();
      setUserData(user);
      console.log('got user data!');
    }
  },[userData]);

  return (
    <AppTemplate>
      <h1>Welcome to Dashboard, {userData?.name}</h1>
      <h2>{userData?.email} | {userData?.id}</h2>
    </AppTemplate>
  );
}