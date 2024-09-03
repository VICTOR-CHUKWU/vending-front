"use client";
import {
  CheckCircleIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { useState } from "react";

import { Loader, Modal, showAlert, SmallLoader } from "@/components/shared";
import { useCart, useGetProducts, useUser } from "@/hooks/swrhooks";
import { errorToast, successToast } from "@/utils";
import { useRouter } from "next/navigation";
import { buyProduct } from "@/services/product";
import { ProductPurchasePayload } from "@/types";


export default function Cart() {
  const { deductCoins } = useUser();
  const {  mutate } = useGetProducts();
  const { cart, isLoading, removeFromCartItem, increaseQty, decreaseQty, totalCost, removeAllFromCart } = useCart();
  const [actionLoad, setActionLoad] = useState(false);
  const router = useRouter()



  const handlePay = async () => {
    if(!cart || cart.length === 0){
      errorToast("no item in your cart")
      return
    }
    const payload: ProductPurchasePayload[] = cart?.map((el) => (
      {
        quantity: el.qty,
    productId: el.id
      }
    ))
    setActionLoad(true)
    try {
      const resp = await buyProduct(payload)
      if(resp.success){
        deductCoins(totalCost)
        mutate()
        removeAllFromCart()
        successToast(resp.message)
        router.push('/')
      }
    } catch (error: any) {
      errorToast(error.message || 'could not purchase product');
    } finally {
      setActionLoad(false);
    }
  };

  const handleCheckout = () => {
    showAlert({
      title: `Would you like to make this purchase`,
      text: `Your coin will be deducted accordingly`,
      icon: "warning",
      confirmButtonText: "Buy",
      cancelButtonText: "Cancel",
      showCancel: true,
      customFunction: handlePay,
    });
  }


  return (
    <>
      <div className=" container pt-40 lg:pt-36 flex-col-reverse lg:flex-row gap-2 flex justify-between px-0  mb-8">
        <div className="w-full lg:w-[70%] shrink-0">
          <div className=" bg-white rounded-t-md p-5 mb-4">
            <div className=" text-black font-semibold text-2xl mb-3">
              Vending Cart ({cart?.length || 0})
            </div>
            <div className=" flex items-center gap-4">
              <div className=" flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full cursor-pointer bg-red-400 text-white flex items-center justify-center`}
                >
                  <CheckIcon className=" h-4 w-4 text-white" />
                </div>
                <div className=" text-slate-700 text-xs md:text-base">
                  Select all items
                </div>
              </div>
              <div className=" border-l-[1px] pl-1 md:pl-3 border-slate-200">
                <div className=" text-blue-700 cursor-pointer text-xs md:text-base">
                  Delete selected items
                </div>
              </div>
            </div>
          </div>
          <div className=" bg-white rounded-b-md p-5 w-full">
            <div className=" flex items-center gap-4">
              <div className=" flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full cursor-pointer bg-red-400 text-white flex items-center justify-center`}
                >
                  <CheckIcon className=" h-4 w-4 text-white" />
                </div>
                <div className=" text-slate-700">Choice</div>
              </div>
              <div className=" border-l-[1px] pl-3 border-slate-200">
                <div className=" text-slate-700 cursor-pointer">
                  Shipped by us
                </div>
              </div>
            </div>
            <div className=" my-3 bg-slate-100 px-4 py-1">
              <div className=" text-black">Free shipping on first order</div>
            </div>
            <div>
              {isLoading ? (
                <div className=" flex flex-col justify-center items-center h-20">
                  <Loader text="loading cart" />
                </div>
              ) : (
                <div className=" flex flex-col gap-3">
                  {!cart || cart.length === 0 ? (
                    <div className=" flex flex-col justify-center items-center h-20">
                      <h3 className=" text-black font-medium text-lg text-center">
                        No item in cart
                      </h3>
                    </div>
                  ) : (
                    cart.map((el) => (
                      <div key={el.id} className=" flex items-center gap-5">
                      <div
                        className={`w-5 h-5 shrink-0 rounded-full cursor-pointer bg-red-400 text-white flex items-center justify-center`}
                      >
                        <CheckIcon className=" h-4 w-4 text-white" />
                      </div>
                      <div className="grid flex-grow grid-cols-1 md:grid-cols-5 gap-2">
                        <div className=" ">
                          <div className=" relative w-full 2xl:w-32 h-32 rounded-md overflow-hidden">
                            <Image
                              src={`/img/signup.jpg`}
                              alt="product picture"
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        </div>
                        <div className=" col-span-1 md:col-span-4">
                          <div className=" flex items-center w-full">
                            <h3 className="flex-grow truncate text-sm font-semibold text-black">
                             {el.productName}
                            </h3>
                            <div className="w-[13%] flex justify-end ">
                              <span onClick={() => removeFromCartItem(el.id)} className=" cursor-pointer ">
                                <TrashIcon className=" h-4 w-4 text-red-600" />
                              </span>
                            </div>
                          </div>
                          <div className=" flex items-center justify-between">
                            <div className="text-slate-700 my-3 font-bold">
                              US ${el.cost}
                            </div>
                            <div className=" flex items-center gap-2 mb-2">
                              <span onClick={()=> decreaseQty(el.id)} className=" w-7 h-7 rounded-md bg-slate-200 flex items-center justify-center text-slate-800 font-semibold cursor-pointer">
                                -
                              </span>
                              <span className=" w-7 h-7 rounded-md bg-slate-200 flex items-center justify-center text-slate-800 font-semibold">
                                {el.qty}
                              </span>
                              <span onClick={() => increaseQty(el.id)} className=" w-7 h-7 rounded-md bg-slate-200 flex items-center justify-center text-slate-800 font-semibold cursor-pointer">
                                +
                              </span>
                            </div>
                          </div>
                          <p className=" text-slate-700">
                            Daily Handcraft Store
                          </p>
                        </div>
                      </div>
                    </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=" w-full  lg:w-[28%] shrink-0">
          <div className=" bg-white w-full p-5 rounded-md">
            <div className=" text-black font-semibold text-2xl mb-3">
              Summary
            </div>
            <h3 className=" text-slate-800 font-semibold flex items-center mb-4 justify-between">
              Subtotal
              <span className=" text-slate-700 text-sm"> US ${totalCost}</span>
            </h3>
            <h3 className=" text-slate-800 font-semibold flex items-center mb-4 justify-between">
              Shipping fee
              <span className=" text-slate-700 text-sm"> US $00.00</span>
            </h3>
            <h3 className=" text-slate-800 font-semibold flex items-center mb-4 justify-between">
              Saved
              <span className=" text-red-600 text-sm"> -US $00.00</span>
            </h3>
            <h3 className=" text-slate-800 font-bold flex items-center justify-between">
              Total
              <span className=" text-slate-800 text-lg"> US ${totalCost}</span>
            </h3>
            <div className=" w-3/4 mx-auto mt-5">
              <button
              disabled={!cart || cart.length === 0}
                onClick={handleCheckout}
                className=" bg-orange-500 text-white w-full h-12 cursor-pointer transition-all duration-300 hover:bg-orange-600 rounded-xl flex items-center justify-center outline-none border-0 font-semibold"
              >
                {
                  actionLoad ? <SmallLoader /> : 'Checkout'
                }
                
              </button>
            </div>
          </div>
          <div className=" bg-white w-full mt-3 rounded-md p-5">
            <div className=" text-black font-semibold text-lg mb-2">
              Pay with
            </div>
            <div className=" w-full relative h-11 flex items-center justify-center">
              <Image
                src={`/img/payments.png`}
                alt="payments"
                width={200}
                height={50}
              />
            </div>
            <div className=" text-black font-semibold text-lg mt-5 mb-2">
              Buyer protection
            </div>
            <p className=" text-slate-600 text-sm">
              Get full refund if the item is not as described or if is not
              delivered
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
