"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  EnvelopeIcon,
  KeyIcon,
  PaperAirplaneIcon,
  EyeIcon,
  ChevronLeftIcon,
  UserIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { saveToken, saveUser, signupFormSchema } from "@/utils";
import { InlineErr, SmallLoader } from "@/components/shared";
import { useRouter } from "next/navigation";
import { errorToast, successToast } from "@/utils/toastify";
import { signup } from "@/services/user";
import { removeUser } from "@/utils";
import {  useUser } from "@/hooks/swrhooks";
import { SignupPayload } from "@/types";

const Page = () => {
  const {  updateUser } = useUser();
  const [signas, setSignas] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(signupFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const createNewUser = async (data: any) => {
    setIsLoading(true)
    const payload: SignupPayload = { 
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      role: signas as 'Seller' | 'Buyer'
    };

    try {
      const resp = await signup(payload)
      if(resp.success){
        saveUser(resp.data)
        saveToken(resp.data.token as string)
        successToast( resp.message ||
          "You have signed in successfully"
        );
        updateUser(resp.data);
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      
      errorToast(error.message || 'could not create user')
    }finally {
      setIsLoading(false)
    }
   
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <main className=" flex items-center justify-center signin">
      <div className=" rounded-lg bg-white px-4 py-6 pt-10 signin__backdrop shadow-lg">
        {signas === "Buyer" ? (
          <div className=" overflow-x-hidden">
            <div className=" mb-5">
              <button
                onClick={() => setSignas("")}
                className=" hover:shadow-md transition-all duration-300 flex items-center justify-center shadow-lg rounded-md outline-none bg-gray-100 cursor-pointer w-auto px-2 py-3 gap-1 text-blue-600"
              >
                <ChevronLeftIcon className=" h-5 w-5 text-blue-600" />
                Back
              </button>
            </div>
            {/* <h2 className=" text-black font-bold text-xl text-center mb-5">
              We are glad to have you onbaord
            </h2>
            <button className=" w-11/12 mx-auto h-12 bg-gray-200 text-blue-600 cursor-pointer flex gap-1 text-lg rounded-lg items-center justify-center">
              Sign up with Google
            </button>
            <div className=" text-center double-side-border mt-3">
              <span className=" ">Or</span>
            </div> */}
            <form className=" mt-7" onSubmit={handleSubmit(createNewUser)}>
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
                        placeholder="email"
                        onChange={onChange}
                      />
                    )}
                  />
                  <InlineErr err={errors?.email?.message} />
                </label>
                <label
                  className=" col-span-2 flex flex-col text-slate-600 w-full text-base font-semibold gap-1"
                  htmlFor=""
                >
                  <span className=" flex items-center gap-1 text-slate-600">
                    <UserIcon className=" h-5 w-5 text-slate-600" />
                    First name
                  </span>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, value } }) => (
                      <input
                        className=" border-slate-200  border-2 text-sm text-slate-700 font-normal rounded-md h-[2.5rem] w-full outline-none px-2"
                        value={value}
                        placeholder="first name"
                        onChange={onChange}
                      />
                    )}
                  />
                  <InlineErr err={errors?.firstName?.message} />
                </label>
                <label
                  className=" col-span-2 flex flex-col text-slate-600 w-full text-base font-semibold gap-1"
                  htmlFor=""
                >
                  <span className=" flex items-center gap-1 text-slate-600">
                    <UserIcon className=" h-5 w-5 text-slate-600" />
                    Last name
                  </span>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, value } }) => (
                      <input
                        className=" border-slate-200  border-2 text-sm text-slate-700 font-normal rounded-md h-[2.5rem] w-full outline-none px-2"
                        value={value}
                        placeholder="last name"
                        onChange={onChange}
                      />
                    )}
                  />
                  <InlineErr err={errors?.lastName?.message} />
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
              <label
                htmlFor="code"
                className=" flex gap-1 mt-5 col-span-2 relative"
              >
                <span className=" flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    className=" w-5 h-5 bg-gray-100 hover:border-slate-300 focus:border-slate-300 outline-none transition-all duration-300 rounded-md border-2 border-slate-100"
                  />
                  Agree to{" "}
                  <Link
                    href={`https://jobnest.io/terms-and-conditions/`}
                    target="blank"
                    className=" text-blue-600"
                  >
                    terms and conditions
                  </Link>
                </span>
              </label>
              <div className=" col-span-2 mt-9 mb-6">
                <button
                  type="submit"
                  className=" w-full h-12 bg-blue-600 text-white cursor-pointer flex gap-1 text-lg rounded-lg items-center justify-center"
                >
                  {isLoading ? <SmallLoader /> : "Sign up"}
                  <PaperAirplaneIcon className=" h-4 w-4 text-white" />
                </button>
              </div>
            </form>
          </div>
        ) : signas === "Seller" ? (
          <div className=" overflow-x-hidden">
            <div className=" mb-5">
              <button
                onClick={() => setSignas("")}
                className=" hover:shadow-md transition-all duration-300 flex items-center justify-center shadow-lg rounded-md outline-none bg-gray-100 cursor-pointer w-auto px-2 py-3 gap-1 text-blue-600"
              >
                <ChevronLeftIcon className=" h-5 w-5 text-blue-600" />
                Back
              </button>
            </div>
            {/* <h2 className=" text-black font-bold text-xl text-center mb-5">
              We are glad to have you onbaord
            </h2>
            <button className=" w-11/12 mx-auto h-12 bg-gray-200 text-blue-600 cursor-pointer flex gap-1 text-lg rounded-lg items-center justify-center">
              Sign up with Google
            </button>
            <div className=" text-center double-side-border mt-3">
              <span className=" ">Or</span>
            </div> */}
            <form className=" mt-7" onSubmit={handleSubmit(createNewUser)}>
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
                        placeholder="email"
                        onChange={onChange}
                      />
                    )}
                  />
                  <InlineErr err={errors?.email?.message} />
                </label>
                <label
                  className=" col-span-2 flex flex-col text-slate-600 w-full text-base font-semibold gap-1"
                  htmlFor=""
                >
                  <span className=" flex items-center gap-1 text-slate-600">
                    <UserIcon className=" h-5 w-5 text-slate-600" />
                    First name
                  </span>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, value } }) => (
                      <input
                        className=" border-slate-200  border-2 text-sm text-slate-700 font-normal rounded-md h-[2.5rem] w-full outline-none px-2"
                        value={value}
                        placeholder="first name"
                        onChange={onChange}
                      />
                    )}
                  />
                  <InlineErr err={errors?.firstName?.message} />
                </label>
                <label
                  className=" col-span-2 flex flex-col text-slate-600 w-full text-base font-semibold gap-1"
                  htmlFor=""
                >
                  <span className=" flex items-center gap-1 text-slate-600">
                    <UserIcon className=" h-5 w-5 text-slate-600" />
                    Last name
                  </span>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, value } }) => (
                      <input
                        className=" border-slate-200  border-2 text-sm text-slate-700 font-normal rounded-md h-[2.5rem] w-full outline-none px-2"
                        value={value}
                        placeholder="last name"
                        onChange={onChange}
                      />
                    )}
                  />
                  <InlineErr err={errors?.lastName?.message} />
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
                    onClick={togglePasswordVisibility}
                    className=" absolute z-[10] right-3 top-[54%] cursor-pointer"
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
              <label
                htmlFor="code"
                className=" flex gap-1 mt-5 col-span-2 relative"
              >
                <span className=" flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    className=" w-5 h-5 bg-gray-100 hover:border-slate-300 focus:border-slate-300 outline-none transition-all duration-300 rounded-md border-2 border-slate-100"
                  />
                  Agree to{" "}
                  <Link
                    href={`/signup`}
                    target="blank"
                    className=" text-blue-600"
                  >
                    terms and conditions
                  </Link>
                </span>
              </label>
              <div className=" col-span-2 mt-9 mb-6">
                <button
                  type="submit"
                  className=" w-full h-12 bg-blue-600 text-white cursor-pointer flex gap-1 text-lg rounded-lg items-center justify-center"
                >
                  {isLoading ? <SmallLoader />: "Sign up"}
                  <PaperAirplaneIcon className=" h-4 w-4 text-white" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className=" overflow-x-hidden">
            <h2 className=" text-black font-bold text-xl text-center mb-4">
              Sign up now to buy and sell nice products with us!
            </h2>
            <p className=" text-center text-base font-light text-slate-600">
              We offers low-cost, quality, and indutrial made goods with
              technology-driven solutions. We cover all your
              needs.
            </p>
            <div className=" mt-7 w-10/12 mx-auto flex flex-col gap-5">
              <button
                onClick={() => setSignas("Buyer")}
                className=" w-2/3 mx-auto h-14 bg-blue-950 text-white rounded-lg "
              >
                Sign up an Buyer
              </button>
              <button
                onClick={() => setSignas("Seller")}
                className=" w-2/3 mx-auto h-14 bg-gray-300 text-slate-900 rounded-lg hover:bg-gray-400 transition-all duration-300"
              >
                Sign up as Seller
              </button>

              <div className=" bg-blue-900 bg-opacity-30 animate-pulse px-2 py-3 rounded-md mt-5">
                <p className=" text-center text-blue-600 ">
                  Refer a friend or bussines to us and spread the good news!
                </p>
              </div>
            </div>
          </div>
        )}
        <p className=" text-center mt-3">
          Have an account already?{" "}
          <Link
            href={`/login`}
            className=" text-orange-700 font-semibold text-lg cursor-pointer"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Page;
