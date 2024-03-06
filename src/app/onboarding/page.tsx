'use client'

import { useRouter } from 'next/navigation'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/utilities/services';

import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import Icon from '@/components/icon';
import AlertBox from '@/components/alertbox';

import {
  OnbType, 
  OnboardingMsg, 
  OnboardingTtl, 
  OnboardingButton, 
  SignInUpProps, 
  SignInInput, 
  SignUpInput, 
  emailRegex,
  passwordRegex,
  nameRegex
} from '@/types/onb-types';

import { 
  UserData
} from '@/types/app-types';

export default function Onboarding() {
  const [type, setType] = useState<OnbType>('SIGN_IN');
  const [onboardingMsg, setOnboardingMsg] = useState<string>(OnboardingMsg[type]);
  const [onboardingTitle, setOnboardingTitle] = useState<string>(OnboardingTtl[type]);
  const [onboardingButton, setOnboardingButton] = useState<string>(OnboardingButton[type]);
  const [userdata, setUserdata] = useState<UserData | null>(null);

  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");
    if (user && token) {
      const userparsed = JSON.parse(user);
      setUserdata(userparsed);
      console.log(userparsed);
    }
  }, []);

  useEffect(() => {
    if (userdata) {
      router.push('/');
    }
  });

  const handleTypeClick = () => {
    if (type === 'SIGN_IN') {
      setType('SIGN_UP');
      handleSignUpClick();
    } else {
      setType('SIGN_IN');
      handleSignInClick();
    }
  }
  const handleSignInClick = () => {
    setType('SIGN_IN');
    setOnboardingMsg(OnboardingMsg['SIGN_IN']);
    setOnboardingTitle(OnboardingTtl['SIGN_IN']);
    setOnboardingButton(OnboardingButton['SIGN_IN']);
  };
  const handleSignUpClick = () => {
    setType('SIGN_UP');
    setOnboardingMsg(OnboardingMsg['SIGN_UP']);
    setOnboardingTitle(OnboardingTtl['SIGN_UP']);
    setOnboardingButton(OnboardingButton['SIGN_UP']);
  }

  return (
    <div className="bg-gradient-to-br from-gray-950 via-purple-950  to-gray-950 bg-animate h-full page-container gap-6 px-52">
      <div className="flex flex-col gap-4 text-center text-xl w-96">
        <div>
          <p className='text-2xl font-semibold animate-fade-up animate-once animate-ease-out' key={onboardingTitle}>{onboardingTitle}</p>
          <span className='opacity-55'>
            <p className="text-base animate-fade animate-once animate-ease-in text-pretty" key={onboardingMsg}>{onboardingMsg}</p>
          </span>
        </div>
        {type === 'SIGN_IN' ? <SignIn type={type} /> : <SignUp type={type} />}
        <div className="flex flex-col justify-center gap-6 mt-6 animate-once animate-ease-out">
          <button
            key={onboardingButton}
            onClick={handleTypeClick}
            className="text-base text-transition"
          >
            {onboardingButton}
          </button>
        </div>
      </div>
    </div>
  );
}

const SignIn = ({ type }: SignInUpProps) => {
  const { register, handleSubmit, formState: {errors} } = useForm<SignInInput>({criteriaMode:"all"});
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  const onSubmit: SubmitHandler<SignInInput> = (data) => {
    handleSignin(data);
    setTimeout(() => (setErrorMessage(null), setError(false)), 5000);
  };

  async function handleSignin(user: SignInInput) {
    try {
      const response = await axios.post(`${API_URL}/signin`, {
        user: {
          email: user.email,
          password: user.password
        }
      })
      const userData = response.data.status.data.user;
      const userHeader = response.headers['authorization'];
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', userHeader);
      setError(false);
      setErrorMessage(null);
      router.push('/');
    } catch (error) {
      setError(true);
      setErrorMessage('Invalid Credentials');
    }
  }
  
  return (
    <form key={type} onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-6 mt-6 animate-fade animate-once animate-ease-in">
      {error && <AlertBox type='error'>{errorMessage}</AlertBox>}
      <div className="toast toast-center">
        {errors && 
        <>
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => <div className="alert alert-warning flex flex-col"><span>{message}</span></div>}
          />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => <div className="alert alert-error flex flex-col"><span>{message}</span></div>}
          />
        </>
        }
      </div>

      <label htmlFor='input-email' className="input input-ghost form-transition input-primary flex items-center gap-2">
        <Icon iconName="mail-fill" />
        <input {...register("email", {required: "Email is Required", pattern: { value: emailRegex, message: "Invalid Email" }})} id='input-email' type="text" className="grow" placeholder="Email" />
      </label>
      
      <label className="input input-ghost form-transition input-primary flex items-center gap-2">
        <Icon iconName="key-fill" />
        <input {...register("password", {required: "Password is Required", pattern: {value: passwordRegex, message: "Password must contain 8 alphanumeric characters" }})} type="password" className="grow" placeholder="Password" />
      </label>

      <input
        type='submit'
        value='Sign In'
        className="btn btn-neutral btn-primary"
      />
    </form>
  );
}

const SignUp = ({type}: SignInUpProps) => {
  const { register, handleSubmit, formState: {errors} } = useForm<SignUpInput>({criteriaMode:"all"});
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<SignUpInput> = (data) => {
    SignUpHandler(data);
  };

  async function SignUpHandler(user:SignUpInput) {
    try {
      await axios.post(`${API_URL}/signup`, {
        user: {
          email: user.email,
          password: user.password,
          name: user.name
        }
      })
      setError(false);
      setErrorMessage(null);
      location.reload();
    } catch (error) {
      setError(true);
      setErrorMessage('Invalid Email or Password');
    }
  }
  
  return (
    <form key={type} onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-6 mt-6 animate-fade animate-once animate-ease-in">
      {error && <AlertBox type='error'>{errorMessage}</AlertBox>}
      <div className="toast toast-center">
        {
        <>
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => <div className="alert alert-error flex flex-col"><span>{message}</span></div>}
          />
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => <div className="alert alert-error flex flex-col"><span>{message}</span></div>}
          />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => <div className="alert alert-error flex flex-col"><span>{message}</span></div>}
          />
        </>
        }
      </div>

      <label className="input input-ghost form-transition input-primary flex items-center gap-2">
        <Icon iconName="mail-fill" />
        <input {...register("email", {required: "Email is Required", pattern: { value: emailRegex, message: "Invalid Email" }})} type="text" className="grow" placeholder="Email" />
      </label>

      <label className="input input-ghost form-transition input-primary flex items-center gap-2">
        <Icon iconName="user-fill" />
        <input {...register("name", {required: "Name is Required", minLength: {value: 3, message: "Name must be more than 3 letters"}, maxLength: {value: 15, message: "Name must be less than 16 letters"}, pattern: {value: nameRegex, message: "Name is Invalid" }})} type="text" className="grow" placeholder="Name" />
      </label>

      <label className="input input-ghost form-transition input-primary flex items-center gap-2">
      <Icon iconName="key-fill" />
        <input {...register("password", {required: "Password is Required", pattern: {value: passwordRegex, message: "Password must contain 8 alphanumeric characters" }})} type="password" className="grow" placeholder="Password" />
      </label>

      <button
        className="btn btn-neutral btn-primary"
      >
        Sign Up
      </button>
    </form>
  );
}