'use client'

import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import { useRouter } from 'next/navigation'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/utilities/services';
import { CreateUserCategory, EditUserCategory, UserCategories } from '@/types/app-types';

import Icon from '@/components/icon';
import AlertBox from '@/components/alertbox';

export function CreateCategoryModal() {
  const {register, handleSubmit, reset, formState: {errors} } = useForm<CreateUserCategory>({criteriaMode:"all"});
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [existingCategories, setExistingCategories] = useState<UserCategories[]>([])

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/categories`, {
          headers: {
            'authorization': sessionStorage.getItem('token'),
            'Accept': 'application/json',
          }
        });
        setExistingCategories(response.data);
      }
      catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<CreateUserCategory> = (data) => {
    console.log(data);
    if (existingCategories.some(category => category.title === data.title)) {
      setErrorMessage('Category Already Exists');
      setError(true);
    } else {
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
      router.push('/categories/'+data.title);
    }
    
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
          {error && <AlertBox type='error'>{errorMessage}</AlertBox>}
          {errors.title && <AlertBox type='warning'>Warning: {errors.title.message}!</AlertBox>}
          {errors.subtitle && <AlertBox type='warning'>Warning: {errors.subtitle.message}!</AlertBox>}

          {/* Input Fields */}
          <label htmlFor='input-title' className="input input-ghost form-transition input-primary flex items-center gap-2">
            <Icon iconName="heading" />
            <input {...register("title", {required: "Title is Required", max: {value:10, message: "Title is more than 10 characters"}})} id='input-title' type="text" className="grow" placeholder="Title" />
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

export function EditCategoryModal({category}: {category: UserCategories; }) {
  const {register, handleSubmit, reset, formState: {errors} } = useForm<EditUserCategory>({criteriaMode:"all"});
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [existingCategories, setExistingCategories] = useState<UserCategories[]>([])

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/categories`, {
          headers: {
            'authorization': sessionStorage.getItem('token'),
            'Accept': 'application/json',
          }
        });
        setExistingCategories(response.data);
      }
      catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<EditUserCategory> = (data) => {
    console.log(data);
    if (existingCategories.some(category => category.title === data.title)) {
      setErrorMessage('Category Already Exists');
      setError(true);
    } else if (data.title === category.title) {
      setErrorMessage('No Changes to the title has been made');
      setError(true);
    } else {
      EditCategoryHandler(data);
      reset(); // Reset form fields
      const modal = document.getElementById(
        'edit_category_modal'
      ) as HTMLDialogElement;
      if (modal && typeof modal.close === 'function') {
        modal.close();
      } else {
        console.error('Modal element or showModal() method not available');
      }
      router.push('/categories/'+data.title)
    }
    
    setTimeout(() => (setErrorMessage(null), setError(false)), 5000);
  };

  async function EditCategoryHandler(data: EditUserCategory) {
    try {
      const response = await axios.put(`${API_URL}/api/v1/categories/${category.id}`, data, {
        headers: {
          'authorization': sessionStorage.getItem('token'),
          'Accept': 'application/json',
        }
      });
      console.log(response);
      if (response.status === 201) {
        setErrorMessage('Category Edited Successfully');
        setError(false);
      }
    }
    catch (error) {
      console.error(error);
      setErrorMessage('Error Editing Category');
      setError(true);
    }
  }

  const handleClose = () => {
    reset(); // Reset form fields
    setErrorMessage(null); // Clear error message
    setError(false); // Clear error state
  };


  return (
    <dialog id="edit_category_modal" className="modal backdrop-blur-sm">
      <div className="modal-box">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-6 mt-6 animate-fade animate-once animate-ease-in">
          {/* Warning Boxes */}
          {error && <AlertBox type='error'>{errorMessage}</AlertBox>}
          {errors.title && <AlertBox type='warning'>Warning: {errors.title.message}!</AlertBox>}
          {errors.subtitle && <AlertBox type='warning'>Warning: {errors.subtitle.message}!</AlertBox>}

          {/* Input Fields */}
          <h3 className="font-bold text-lg">Edit {category.title}</h3>
          <label htmlFor='input-title' className="input input-ghost form-transition input-primary flex items-center gap-2">
            <Icon iconName="heading" />
            <input {...register("title", {required: "Title is Required", max: {value:10, message: "Title is more than 10 characters", }})} id='input-title' type="text" className="grow" placeholder="Title" defaultValue={category.title} />
          </label>
          <label htmlFor='input-subtitle' className="input input-ghost form-transition input-primary flex items-center gap-2">
            <Icon iconName="subscript-2" />
            <input id='input-subtitle' type="text" className="grow" placeholder="Subtitle" defaultValue={category.subtitle}/>
          </label>
          <button className="btn btn-primary">Save</button>
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