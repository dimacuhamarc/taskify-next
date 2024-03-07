'use client';

import { CategoryCard } from '@/components/cards';
import AppTemplate from '@/templates/app-template';
import { API_URL } from '@/utilities/services';

import { UserCategories } from '@/types/app-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

import Icon from '@/components/icon';

export default function Categories() {
  const [categories, setCategories] = useState<UserCategories[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/categories`, {
          headers: {
            authorization: sessionStorage.getItem('token'),
            Accept: 'application/json',
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const editHandler = () => {
    const modal = document.getElementById(
      'create_category_modal'
    ) as HTMLDialogElement;
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      console.error('Modal element or showModal() method not available');
    }
  };

  return (
    <AppTemplate>
      <div className="w-full flex flex-col justify-between items-start gap-4">
        <h1 className="text-4xl font-bold">Categories</h1>
        <div className="w-full grid auto-rows-[300px] grid-cols-4 gap-6">
          {categories.length > 0 ? (
            categories &&
            categories.map((category, i) => {
              return (
                <CategoryCard
                  key={i}
                  className={`row-span-1 rounded-xl border-2 border-slate-400/10`}
                  category={category}
                />
              );
            })
          ) : (
            <>
              <p className="text-lg font-thin opacity-50">
                No Categories Found
              </p>
            </>
          )}
          <button className="absolute right-4 bottom-4 btn btn-primary tooltip tooltip-left" onClick={editHandler} data-tip={'Create Category'}>
            <Icon iconName="add-fill" className="text-lg font-bold"></Icon>
          </button>
        </div>
      </div>
    </AppTemplate>
  );
}
