"use client";
import { Loader, showAlert, SmallLoader } from "@/components/shared";
import { useCart, useGetProducts, useUser } from "@/hooks/swrhooks";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";
import { TProduct } from "@/types/product";
import { useState } from "react";
import { errorToast, successToast } from "@/utils";
import { resetCoin } from "@/services/user";

export default function Home() {
  const { user, isLoading, updateUser } = useUser();
  const { products, productLoading } = useGetProducts();
  const [actionLoad, setActionLoad] = useState(false);
  const { cart, addToCartItem } = useCart();

  const handleAddToCart = (product: TProduct) => {
    addToCartItem({
      ...product,
      qty: 1,
    });
  };

  const handleReset = async () => {
    setActionLoad(true)
    try {
      const resp = await resetCoin(user?.id as string)
      if(resp.success){
        updateUser(resp.data)
        successToast(resp.message)
      }
    } catch (error: any) {
      errorToast('could not reset coin');
    } finally {
      setActionLoad(false);
    }
  };

  const resetUserCoin = () => {
    showAlert({
      title: `Reset Coin`,
      text: `Do you want to reset your coin?`,
      icon: "warning",
      confirmButtonText: "Reset",
      cancelButtonText: "Cancel",
      showCancel: true,
      customFunction: handleReset,
    });
  }

  if (isLoading) {
    return (
      <div className=" h-screen flex items-center flex-col justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <main className=" pt-40 lg:pt-32">
      <section className=" container">
        <h2 className=" font-semibold text-xl lg:text-4xl flex items-center justify-between flex-wrap">
          Welcome {user?.firstName} {user?.lastName}

          {
            user && user.role.toLowerCase() === 'buyer' && (
              <button
                onClick={() => resetUserCoin()}
                className=" bg-blue-950 text-white w-28 h-10 flex items-center justify-center text-sm font-normal rounded-lg outline-none border-0 cursor-pointer"
              >
               {
                actionLoad ? <SmallLoader /> : ' Reset Coin'
               }
              </button>
            )
          }
        </h2>
        {productLoading ? (
          <div className=" flex items-center flex-col justify-center h-[40vh]">
            <Loader text="Loading products..." />
          </div>
        ) : (
          <div>
            {!products || products.data.length === 0 ? (
              <div>no product found</div>
            ) : (
              <div className=" mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.data.map((product) => {
                  const isInCart = cart?.some((item) => item.id === product.id);
                  return (
                    <div key={product.id}>
                      <div className=" transition-all duration-300 hover:shadow-md rounded-lg p-5 bg-white shadow-lg text-black">
                        <div className=" relative w-full h-40 rounded-lg overflow-hidden mb-2">
                          <Image
                            src={`/img/signup.jpg`}
                            alt="product"
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className=" flex flex-col gap-4">
                          <h3 className=" text-xl font-medium">
                            {product.productName}
                          </h3>
                          <div className=" flex items-center gap-2">
                            <p>vendor:</p>
                            <p className=" bg-orange-500 text-white py-1 px-2 rounded-lg text-sm">
                              Amaka olinya
                            </p>
                          </div>
                          <div className=" flex items-center gap-2">
                            <p>price:</p>
                            <p className=" bg-green-800 text-white py-1 px-2 rounded-lg text-sm">
                              ${product.cost}
                            </p>
                          </div>
                          <div className=" flex items-center gap-2">
                            <p>Available stock:</p>
                            <p className="  text-lg font-semibold">
                              {product.amountRemaining}
                            </p>
                          </div>
                          <div className=" flex items-center gap-2">
                            <p>posted on:</p>
                            <p className=" ">
                              {moment(product.createdAt).format("DD MMM YYYY")}
                            </p>
                          </div>
                          <div className=" flex items-center mt-3 gap-4">
                            <Link
                              href={`/products/${product.id}`}
                              className=" px-3 py-2 rounded-lg bg-blue-950 text-white outline-none border-0 cursor-pointer transition-all duration-300 hover:bg-blue-900"
                            >
                              View
                            </Link>
                            {user && user?.role?.toLowerCase() === "buyer" && (
                              <div>
                                {isInCart ? (
                                  <Link
                                    href={`/cart`}
                                    className=" px-3 py-2 rounded-lg bg-orange-500 text-white outline-none border-0 cursor-pointer transition-all duration-300 hover:bg-orange-600"
                                  >
                                    Go to cart
                                  </Link>
                                ) : (
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className=" px-3 py-2 rounded-lg bg-blue-950 text-white outline-none border-0 cursor-pointer transition-all duration-300 hover:bg-blue-900"
                                  >
                                    Add to cart
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
