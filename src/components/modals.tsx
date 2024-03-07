'use client'

import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import { useRouter } from 'next/navigation'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/utilities/services';
import { CreateUserCategory } from '@/types/app-types';

import Icon from '@/components/icon';

export default function CreateCategoryModal() {
  const {register, handleSubmit, reset, formState: {errors} } = useForm<CreateUserCategory>({criteriaMode:"all"});
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const onSubmit: SubmitHandler<CreateUserCategory> = (data) => {
    console.log(data);
    CreateCategoryHandler(data);
    reset(); // Reset form fields
    const modal = document.getElementById(
      'create_category_modal'
    ) as HTMLDialogElement;
    if (modal && typeof modal.close === 'function') {
      modal.close();
    } else {
      console.error('Modal element or showModal() method not available');
    }
    router.push('/categories');
    setTimeout(() => (setErrorMessage(null), setError(false)), 5000);
  };

  async function CreateCategoryHandler(data: CreateUserCategory) {
    try {
      const response = await axios.post(`${API_URL}/api/v1/categories`, data, {
        headers: {
          'authorization': sessionStorage.getItem('token'),
          'Accept': 'application/json',
        }
      });
      console.log(response);
      if (response.status === 201) {
        setErrorMessage('Category Created Successfully');
        setError(false);
      }
    }
    catch (error) {
      console.error(error);
      setErrorMessage('Error Creating Category');
      setError(true);
    }
  }

  const handleClose = () => {
    reset(); // Reset form fields
    setErrorMessage(null); // Clear error message
    setError(false); // Clear error state
  };

  return (
    <dialog id="create_category_modal" className="modal backdrop-blur-sm">
      <div className="modal-box">
        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center gap-6 mt-6 animate-fade animate-once animate-ease-in"
        >
          {/* Warning Boxes */}
          <h3 className="font-bold text-lg">Create a new Category!</h3>
          {errors.title && <div role="alert" className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>Warning: {errors.title.message}!</span>
          </div>}
          {errors.subtitle && <div role="alert" className="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>Warning: {errors.subtitle.message}!</span>
          </div>}

          {/* Input Fields */}
          <label htmlFor='input-title' className="input input-ghost form-transition input-primary flex items-center gap-2">
            <Icon iconName="heading" />
            <input {...register("title", {required: "Title is Required"})} id='input-title' type="text" className="grow" placeholder="Title" />
          </label>
          <label htmlFor='input-subtitle' className="input input-ghost form-transition input-primary flex items-center gap-2">
            <Icon iconName="subscript-2" />
            <input {...register("subtitle", {required: "Subtitle is Required"})} id='input-subtitle' type="text" className="grow" placeholder="Subtitle" />
          </label>
          <button className="btn btn-primary" type="submit">Create</button>
        </form>

        {/* Modal Actions */}
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={handleClose}>Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}