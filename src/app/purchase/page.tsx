/* eslint-disable @next/next/no-img-element */
"use client";
import { Loader } from "@/components/shared";
import { usePurchases } from "@/hooks/swrhooks";
import moment from "moment";
import Image from "next/image";

export default function Home() {
  const { purchases, isLoading, isError } = usePurchases({
    page: 1,
    limit: 10,
  });
  return (
    <>
      {isLoading ? (
        <div className=" h-screen flex flex-col justify-center items-center bg-white">
          <Loader text="loading purchase" />
        </div>
      ) : (
        <div className="container pt-40 lg:pt-36">
          {!purchases || !purchases.data.length ? (
            <div className=" flex flex-col h-[50vh] justify-center items-center">
              <h2>No purchase </h2>
            </div>
          ) : (
            <div className=" flex flex-col gap-4">
              {purchases.data.map((purchase) => (
                <div key={purchase.id} className="grid grid-cols-1">
                  {/* header  */}
                  <div className=" flex items-end justify-between border-b-2 border-gray-300 pb-3">
                    <h3 className=" flex items-center gap-5 text-black font-semibold text-base">
                      Order ID: {purchase.id}
                      <span className=" text-gray-600 font-normal">
                        Order Date:{" "}
                        {moment(purchase.createdAt).format("DD MM YY")}
                      </span>
                    </h3>
                  </div>
                  {/* header ends  */}

                  {/* delivery and payment info  */}

                  <div className=" grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 border-b-2 border-gray-200 pb-3">
                    <div className=" col-span-1 md:col-span-2">
                      <h3 className=" font-semibold text-lg text-gray-400 mb-3">
                        Delivery to
                      </h3>
                      <p className=" text-black mb-1">Michael Jackson</p>
                      <p className=" text-black mb-1">
                        Phone +1234567890 Email: myname@gmail.com
                      </p>
                      <p className=" text-black mb-1">
                        Location: Home number, Building name, Street 123,
                      </p>
                      <p className=" text-black mb-1">P.O. Box: 100123</p>
                    </div>
                    <div>
                      <h3 className=" font-semibold text-lg text-gray-400 mb-3">
                        Payment
                      </h3>
                      <h3 className="mb-2 text-green-500 flex items-center gap-3">
                        <span className=" bg-green-500 text-white w-7 h-7 flex items-center justify-center">
                          <span className=" text-white italic">Visa</span>
                        </span>
                        Visa ****9989
                      </h3>
                      <p className=" text-black mb-1">
                        Subtotal: ${purchase.totalCost}
                      </p>
                      <p className=" text-black mb-1"> Shipping fee: $00</p>
                      <p className=" text-black mb-1 font-semibold">
                        {" "}
                        Total: ${purchase.totalCost}
                      </p>
                    </div>
                  </div>

                  {/* delivery and payment ends  */}

                  <div className=" flex flex-col gap-2 mt-4">
                    {purchase.productPurchases.map((el) => (
                      <div
                        key={el.id}
                        className=" flex gap-3 items-center justify-between border-b-2 border-gray-200 pb-3"
                      >
                        <span className=" w-16 h-16 relative border-2 border-gray-300 rounded-md flex items-center justify-center">
                          {el.product.productImages.length > 0 ? (
                            <img
                              src={el.product.productImages[0]}
                              alt="Uploaded Image"
                              className=" w-full h-full rounded-full"
                            />
                          ) : (
                            <div className=" w-full h-full flex items-center justify-center bg-gray-700">
                              <h2 className=" text-white text-center text-xs">
                                No Product Image
                              </h2>
                            </div>
                          )}
                        </span>

                        <div className=" flex flex-col gap-0">
                          <p className=" text-black mb-1">
                            {el.product.productName}
                          </p>
                          <h3 className=" font-medium text-gray-400">
                            USD{el.product.cost}
                          </h3>
                        </div>
                        <div className=" flex flex-col gap-0">
                          <p className=" text-black mb-1">Seller</p>
                          <p className=" text-black mb-1">Nike clothing</p>
                        </div>
                        <div className=" flex items-center justify-end gap-1">
                          <button className=" px-3 font-medium py-1 border-primary border-2 bg-transparent text-primary transition-all duration-300 hover:bg-primary hover:text-white rounded-lg">
                            View Purchase
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
