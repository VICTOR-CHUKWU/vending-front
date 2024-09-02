"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  EnvelopeIcon,
  KeyIcon,
  PaperAirplaneIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginFormSchema } from "@/utils/schema";
import { InlineErr, SmallLoader } from "@/components/shared";
import { errorToast, successToast } from "@/utils/toastify";
import { saveToken, saveUser } from "@/utils";
import { login } from "@/services/user";
import { useUser } from "@/hooks/swrhooks";
import { LoginPayload } from "@/types";

const Page = () => {
  
  const {  updateUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isforget, setIsforget] = useState(false);
  const router = useRouter();

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginUser = async (data: any) => {
    setLoading(true)
    const payload: LoginPayload = { email: data.email, password: data.password };
    try {
      const resp = await login(payload)
      if(resp.success){
        saveUser(resp.data)
        saveToken(resp.data.token as string)
        successToast( resp.message ||
          "You have logged in successfully"
        );
        updateUser(resp.data);
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      
      errorToast(error.message || 'could not login')
    }finally {
      setLoading(false)
    }
   
  };

  const passwordForgot = async () => {
   console.log('hey');
   
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="flex items-center justify-center login">
      <div className=" rounded-lg bg-white px-3 py-6 login__backdrop shadow-lg">
        <h2 className=" text-black font-bold text-2xl text-center mb-4">
          Welcome back!!
        </h2>
        <p className=" text-center text-lg text-slate-600">Log in to...</p>
        <div className=" mt-7 w-10/12 mx-auto flex flex-col gap-5">
          <form className=" mt-7" onSubmit={handleSubmit(loginUser)}>
            <div className=" grid grid-cols-2 gap-4">
              <label
                className=" col-span-2 flex flex-col text-slate-600 w-full text-base font-semibold gap-1"
                htmlFor=""
              >
                <span className=" flex items-center gap-1 text-slate-600">
                  <EnvelopeIcon className=" h-5 w-5 text-slate-600" />
                  Email
                </span>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <input
                      type="email"
                      className=" border-slate-200  border-2 text-sm text-slate-700 font-normal rounded-md h-[2.5rem] w-full outline-none px-2"
                      value={value}
                      placeholder="username"
                      onChange={onChange}
                    />
                  )}
                />
                <InlineErr err={errors?.email?.message} />
              </label>
              <label
                htmlFor="password"
                className=" flex flex-col gap-1 col-span-2 relative"
              >
                <span className=" flex items-center gap-1 text-slate-600">
                  <KeyIcon className=" h-5 w-5 text-slate-600" />
                 Password
                </span>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <input
                      type={showPassword ? "text" : "password"}
                      className=" border-slate-200  border-2 text-sm text-slate-700 font-normal rounded-md h-[2.5rem] w-full outline-none px-2"
                      value={value}
                      placeholder=""
                      onChange={onChange}
                    />
                  )}
                />
                <span
                  className=" absolute z-[1] right-3 top-[54%] cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeSlashIcon className=" h-5 w-5 text-slate-600" />
                  ) : (
                    <EyeIcon className=" h-5 w-5 text-slate-600" />
                  )}
                </span>
                <InlineErr err={errors?.password?.message} />
              </label>
            </div>

            <div className=" col-span-2 mt-9 mb-3">
              <button
                type="submit"
                className=" w-full h-12 bg-blue-600 text-white cursor-pointer flex gap-1 text-lg rounded-lg items-center justify-center"
              >
                {loading ? "Loading..." : "...Continue"}
                <PaperAirplaneIcon className=" h-4 w-4 text-white" />
              </button>
            </div>
          </form>
          <p className=" text-center italic text-blue-800">
            Forgot password?{" "}
            <span
              onClick={() => passwordForgot()}
              className=" text-orange-700 font-semibold text-xs cursor-pointer"
            >
              Click here
            </span>
            {
              isforget && <SmallLoader />
            }
          </p>
          <div className=' text-center double-side-border'>
                        <span className=' '>Or</span>
                    </div>
                    <button className=' w-full h-12 bg-gray-200 text-blue-600 cursor-pointer flex gap-1 text-lg rounded-lg items-center justify-center'>
                        Log in with Google
                    </button>
          <p className=" text-center mt-3">
            Dont have an account yet?{" "}
            <Link
              href={`/signup`}
              className=" text-orange-700 font-semibold text-lg cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Page;
