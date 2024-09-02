/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { INavMenus } from "@/types";
import { NavMenuItems } from "@/data";
import { MenuItems, Modal } from "./shared";
import Image from "next/image";
import { getUser, removeUser } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import { errorToast, successToast } from "@/utils/toastify";
import { useUser } from "@/hooks/swrhooks";
import { buyCoin } from "@/services/user";

const options = [
  {
    text: "5",
    value: 5,
  },
  {
    text: "10",
    value: 10,
  },
  {
    text: "20",
    value: 20,
  },
  {
    text: "50",
    value: 50,
  },
  {
    text: "100",
    value: 100,
  },
];

const Nav = () => {
  const { user, isLoading, removeUserData, updateUser } = useUser();

  const router = useRouter();
  const pathname = usePathname();

  const renderNavs = useCallback(
    (nav: INavMenus) => {
      let role = user ? user.role.toLowerCase() : ''

      if (
        ( role === "buyer" && nav.url === "/products/create") ||
        (role === "seller" && nav.url === "/purchase")
      ) {
        return null;
      }
      return <MenuItems menu={nav} key={nav.url} />;
    },
    [pathname, user?.role]
  );

  const [scrolled, setScrolled] = useState(false);
  const [load, setLoad] = useState(false);
  const [coinModal, setCoinModal] = useState(false);
  const [coinValue, setCoinValue] = useState("");

  const handleScroll: EventListener = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const LogoutUser = () => {
    removeUserData();
    successToast("You are logged out");
    router.push("/login");
  };

  const purchaseCoin = async() => {
    if(!coinValue){
      errorToast('Selecet a value')
      return
    }
    setLoad(true)
    const coin = Number(coinValue)
    try {
      const resp = await buyCoin(coin, user?.id as string)
      if(resp.success){
        // updateUser(resp.data)
        successToast(resp.message)
        setCoinModal(false)
      }
    } catch (error) {
      errorToast('could not buy coin')
    }finally {
      setLoad(false)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
        className={`Nav bg-white ${scrolled ? " bg-opacity-100" : " bg-opacity-100"}`}
      >
        <nav className="rounded-lg pt-4 container w-full flex items-center flex-col md:flex-row justify-between flex-wrap gap-3 md:gap-0">
          <div className="flex items-center w-full shrink-0 justify-between md:w-auto md:justify-start gap-12">
            <Link href="/" className="flex items-center gap-2">
              <span className=" bg-blue-950 text-white flex items-center justify-center w-12 h-12 shrink-0 rounded-full">
                VC
              </span>
              <p className="hidden md:flex flex-col">
                <span className=" text-sm font-medium">Buy with ease</span>
                <span className=" text-xs font-light">we are here for you</span>
              </p>
            </Link>
            <div className="item-container flex items-center gap-10">
              {NavMenuItems.map(renderNavs)}
            </div>
          </div>
          <div className=" flex justify-between items-center gap-2 lg:gap-7">
          {user && user?.role?.toLowerCase() === "buyer" && (
            <div className=" flex items-center gap-5">
              <p className=" flex items-center gap-1">
                {" "}
                Coin Balance:{" "}
                <span
                  className={`px-2 py-1 ${
                    user?.coins > 50 ? " bg-green-100" : " bg-red-100"
                  } font-semibold text-sm`}
                >
                  {user?.coins}
                </span>
              </p>
              <button
                onClick={() => setCoinModal(!coinModal)}
                className=" bg-blue-950 text-xs md:text-base text-white px-1 py-1 md:px-3 md:py-2 rounded-lg outline-none border-0 cursor-pointer"
              >
                Buy Coin
              </button>
            </div>
          )}

          {!isLoading && user && (
            <button
              onClick={LogoutUser}
              className=" outline-none text-blue-950 transition-all duration-300 hover:text-blue-900 font-semibold cursor-pointer  "
            >
              Logout
            </button>
          )}
          </div>
        </nav>
      </div>
      <Modal
        isOpen={coinModal}
        closeModal={() => setCoinModal(!coinModal)}
        header="Buy Coin"
      >
        <div>
          <h4 className=" text-center text-2xl font-medium mb-2">
            Select amount
          </h4>
          <div className=" mt-8 mb-5">
            <label
              className={`flex flex-col text-text-gray w-full leading-5 gap-1`}
            >
              <span className="flex items-center font-medium text-base gap-1 text-text-gray">
                Coin
              </span>

              <select
                className="border-gray-200 border-2 text-sm bg-transparent text-text-gray font-normal rounded-lg h-[56px] w-full outline-none px-2"
                value={coinValue}
                onChange={(e) => setCoinValue(e.target.value)}
              >
                <option value="">Select Amount</option>
                {options?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            </label>
           <div className=" mt-3 flex justify-center">
           <button onClick={purchaseCoin} className=" bg-blue-950 text-white font-medium text-lg w-40 h-12 flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-blue-900">Buy</button>
           </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Nav;
