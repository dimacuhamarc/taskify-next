'use client'

import { 
  useState, 
  useEffect 
} from 'react';

import axios from 'axios';
import Icon from '@/components/icon';
// import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { 
  UserData,
  UserCategories 
} from '@/types/app-types';

import {
  NavItemProps,
  SignOutButtonProps
} from '@/types/sidebar-types';

import { 
  SignOutHandler, 
  API_URL,
  GetUserInfo,
  GetToken
} from '@/utilities/services';


export const Sidebar = () => {
  const [userCategories, setUserCategories] = useState<UserCategories[]>([]);
  const [activeRoute, setActiveRoute] = useState<string>('');
  const [userdata, setUserdata] = useState<UserData | null>(null);

  useEffect(() => {
    if (userdata === null) {
      const user = GetUserInfo();
      setUserdata(user);
    }
  },[userdata]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/categories`, {
        headers: {
          'authorization': sessionStorage.getItem('token'),
          'Accept': 'application/json',
        }
      });
      setUserCategories(response.data);
    }
    catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCategories();
    }, 3000); // Poll every 3 seconds, adjust as needed
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userdata) {
      fetchCategories();
    }
  }, [userdata]);

  return (
    <>
      <div className="z-30 sidebar flex flex-col justify-between">
        <div className="gradient-overlay"></div>
        <div className="flex flex-col gap-4 ">
          <NavItem icon='user-fill' tooltip='Profile' link='/profile' />
          {
            userCategories.slice(0,8).map((category, index) => {
              return (
                <NavItem key={index} icon='folder-fill' tooltip={category.title} link={`/category/${category}`} isCategory />
              );
            })
          }
          {
            !(userCategories.length > 8) && <NavItem icon='more-fill' tooltip='View All Categories' link='/categories' />
          }
          <NavItem icon='add-fill' tooltip='Create a Category' link='/create' />
        </div>
        <div className='flex flex-col gap-4'>
          <SignOutButton icon='logout-box-fill' tooltip='Sign Out' />
        </div>
        
      </div>
    </>
  )
};

const NavItem = ({icon, tooltip, link, isActive, isCategory}: NavItemProps ) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(link);
  }

  return (
    <>
    {
      isCategory ? 
        (<button className="z-30  sidebar-item group sidebar-animation tooltip tooltip-right before:bg-opacity-25 before:z-50 after:z-50" data-tip={tooltip} onClick={handleClick}>
          <Icon iconName={icon} className='text-lg text-primary group-hover:text-primary-content group-hover:text-xl sidebar-animation sidebar-icon' />
        </button>)
        :
        (<button className="z-30  sidebar-item group sidebar-animation tooltip tooltip-right before:bg-opacity-25" data-tip={tooltip} onClick={handleClick}>
          <Icon iconName={icon} className='text-lg text-primary group-hover:text-primary-content group-hover:text-xl sidebar-animation sidebar-icon' />
        </button>)
    }
    </>
  );
};


const SignOutButton = ({icon, tooltip}: SignOutButtonProps ) => {
  const router = useRouter();
  const handleSignOut = () => {
    router.push('/onboarding');
    SignOutHandler();
  };
  return (
    <button className="*:z-50 mt-4 sidebar-item group sidebar-animation tooltip tooltip-right before:bg-opacity-25" data-tip={tooltip} onClick={handleSignOut}>
      <Icon iconName={icon} className='text-lg text-primary group-hover:text-primary-content group-hover:text-xl sidebar-animation sidebar-icon' />
    </button>
  );
};