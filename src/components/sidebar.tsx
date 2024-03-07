'use client'

import { 
  useState, 
  useEffect 
} from 'react';

import axios from 'axios';
import Icon from '@/components/icon';
// import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'
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
import {CreateCategoryModal} from './modals';


export const Sidebar = () => {
  const [userCategories, setUserCategories] = useState<UserCategories[]>([]);
  const [activeRoute, setActiveRoute] = useState<string>('');
  const [userdata, setUserdata] = useState<UserData | null>(null);

  const pathname = usePathname();
  useEffect(() => {
    if (userdata === null) {
      const user = GetUserInfo();
      setUserdata(user);
    }
  },[pathname]);

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
      if (userdata !== null) {
        fetchCategories();
      }
    }, 30000); // Poll every 3 seconds, adjust as needed
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userdata !== null) {
      fetchCategories();
    }
  }, [userdata]);

  useEffect(() => {
    setActiveRoute(pathname)
    if (userdata !== null) {
      fetchCategories();
    }
  }, [pathname]);

  const router = useRouter();
  const handleSignOut = () => {
    setUserdata(null);
    router.push('/onboarding');
    SignOutHandler();
  };

  return (
    userdata && <>
      <div className="z-30 sidebar flex flex-col justify-between animate-fade animate-once animate-ease-out">
        <div className="gradient-overlay"></div>
        <div className="flex flex-col gap-4 ">
          <NavItem icon='user-fill' tooltip='My Dashboard' link='/dashboard' isActive={activeRoute === '/dashboard'} />
          {
            (userCategories.length > 0) && userCategories.slice(0,8).map((category, index) => {
              return (
                <NavItem key={index} icon='folder-fill' tooltip={category.title} link={`/categories/${category.title}`} isCategory isActive={activeRoute.replace(/%20/g, ' ') === `/categories/${category.title}`} />
              );
            })
          }
          {
            !(userCategories.length > 8) && <NavItem icon='more-fill' tooltip='View All Categories' link='/categories' isActive={activeRoute === '/categories'} />
          }
          <CreateCategoryButton icon='add-fill' tooltip='Create a Category' />
        </div>
        <div className='flex flex-col gap-4'>
          <SignOutButton icon='logout-box-fill' tooltip='Sign Out' signout={handleSignOut} />
        </div>
      </div>
      <CreateCategoryModal />
    </>
  )
};

const NavItem = ({icon, tooltip, link, isActive, isCategory}: NavItemProps ) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(link);
  }
  isActive ? console.log('active') : null;
  return (
    <div className='indicator animate-fade-up animate-once animate-ease-out animate-delay-700'>
      {
        isActive ? <span className="z-50 indicator-item indicator-middle rounded-badge badge badge-info badge-xs"></span> : null
      }
    {
      isCategory ? 
        (<button className={`z-30 ${isActive ? 'sidebar-item-active' : 'sidebar-item'} group sidebar-animation tooltip tooltip-right before:bg-opacity-25`} data-tip={tooltip} onClick={handleClick}>
          <Icon iconName={icon} className={`text-lg  ${isActive ? 'text-indicator-color' : 'text-primary'} sidebar-animation sidebar-icon group-hover:text-primary-content group-hover:text-xl`} />
        </button>)
        :
        (<button className={`z-30 ${isActive ? 'sidebar-item-active' : 'sidebar-item'} group sidebar-animation tooltip tooltip-right before:bg-opacity-25`} data-tip={tooltip} onClick={handleClick}>
          <Icon iconName={icon} className={`text-lg  ${isActive ? 'text-indicator-color' : 'text-primary'} sidebar-animation sidebar-icon group-hover:text-primary-content group-hover:text-xl`} />
        </button>)
    }
    </div>
  );
};

const CreateCategoryButton = ({ icon, tooltip }: SignOutButtonProps) => {
  return (
    <>
      <button
        className={`z-30 sidebar-item group sidebar-animation tooltip tooltip-right before:bg-opacity-25 animate-fade-up animate-once animate-ease-out animate-delay-400`}
        data-tip={tooltip}
        onClick={() => {
          const modal = document.getElementById(
            'create_category_modal'
          ) as HTMLDialogElement;
          if (modal && typeof modal.showModal === 'function') {
            modal.showModal();
          } else {
            console.error('Modal element or showModal() method not available');
          }
        }}
      >
        <Icon
          iconName={icon}
          className={`text-lg text-primary sidebar-animation sidebar-icon group-hover:text-primary-content group-hover:text-xl`}
        />
      </button>
    </>
  );
};

const SignOutButton: React.FC<SignOutButtonProps> = ({ icon, tooltip, signout }) => {
  
  return (
    <button className="*:z-50 mt-4 sidebar-item group sidebar-animation tooltip tooltip-right before:bg-opacity-25 animate-fade-up animate-once animate-ease-out animate-delay-400" data-tip={tooltip} onClick={signout}>
      <Icon iconName={icon} className='text-lg text-primary group-hover:text-primary-content group-hover:text-xl sidebar-animation sidebar-icon' />
    </button>
  );
};

// 