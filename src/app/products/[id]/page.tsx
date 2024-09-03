/* eslint-disable @next/next/no-img-element */
"use client";
import {
  InlineErr,
  Loader,
  Modal,
  showAlert,
  SmallLoader,
} from "@/components/shared";
import { useCart, useGetProducts, useUser } from "@/hooks/swrhooks";
import {
  createProduct,
  deleteProduct,
  fetchProduct,
  updateProduct,
} from "@/services/product";
import { ProductCreationPayload, UpdateProductPayload } from "@/types";
import { TCartItem, TProduct } from "@/types/product";
import { createProductFormSchema, errorToast, successToast } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { mutate } from "swr";
const sellingPoints = [
  `Best quality: The solar panel is made of high-quality aluminum alloy material, which is durable and has a long service life.`,
  `Useful: This solar panel can be used for a variety of devices, such as mobile phones, tablets, laptops, etc.`,
  `Easy installation ano operation: The solar panel is easy to install and use, no need to worry about installation. it can be installed in a few seconds without any tools.`,
];


export default function Installation({
  params: { id },
}: {
  params: { id: string };
}) {
  const { user, isLoading } = useUser();
  const { products, productLoading, mutate } = useGetProducts();
  const { addToCartItem, cart } = useCart();

  const [productImage, setProductImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isadded, setIsadded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [isCart, setIsCart] = useState<TCartItem | null>(null);
  const [actionLoad, setActionLoad] = useState(false);
  const [product, setProduct] = useState<TProduct | null>(null);

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm({
    resolver: yupResolver(createProductFormSchema),
    defaultValues: {
      productName: "",
      cost: 0,
      amountRemaining: 0,
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCartItem({ ...product, qty: quantity });
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCartItem({ ...product, qty: quantity });
    router.push("/cart");
  };

  const editProduct = async (data: any) => {
    if (productLoading || isLoading) return;
    setLoading(true);
    const payload: UpdateProductPayload = {
      productName: data.productName,
      cost: data.cost,
      amountRemaining: data.amountRemaining,
    };
    try {
      const resp = await updateProduct(payload, id);
      if (resp.success) {
        setEditModal(false);
        await getProduct(id);
        mutate();
        successToast(resp.message || "updated succesfully");
      }
    } catch (error: any) {
      errorToast("could not update product");
    }
  };

  const getProduct = async (id: string) => {
    setLoading(true);
    try {
      const resp = await fetchProduct(id);
      if (resp.success) {
        setProduct(resp.data);
        if(resp.data.productImages.length > 0){
          setProductImage(resp.data.productImages[0])
        }
        reset({
          productName: resp.data.productName,
          cost: resp.data.cost,
          amountRemaining: resp.data.amountRemaining,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const increaseCount = useCallback(
    (qty: number) => {
      if (quantity <= qty) {
        setQuantity((prev) => prev + 1);
      }
    },
    [quantity]
  );

  const decreaseCount = useCallback(() => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }, [quantity]);

  const handleDelete = async () => {
    setActionLoad(true);
    try {
      const resp = await deleteProduct(id);
      if (resp.success) {
        mutate();
        successToast(resp.message);
        router.push("/");
      }
    } catch (error: any) {
      errorToast("could not delete product");
    } finally {
      setActionLoad(false);
    }
  };

  const handleProductDelete = () => {
    showAlert({
      title: `Delete ${product?.productName}`,
      text: `Do you want to remove this product from your store?`,
      icon: "warning",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      showCancel: true,
      customFunction: handleDelete,
    });
  };

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      const isInCart = cart?.find((item) => item.id === product.id);
      if (isInCart) {
        setIsCart(isInCart);
        setQuantity(isInCart.qty);
      }
    }
  }, [product, cart]);

  if (loading) {
    return (
      <div className=" h-screen flex items-center flex-col justify-center bg-white">
        <Loader text="loading product" />
      </div>
    );
  }

  if (!loading && !product) {
    return (
      <div className=" h-screen flex items-center flex-col justify-center bg-white">
        <h3>Something went wrong</h3>
      </div>
    );
  }

  return (
    <>
      <div className=" container pt-40 lg:pt-48 flex flex-col ">
        <div className=" w-full pl-2">
          <div className=" w-full  border-b-[1px] border-slate-300 pb-3 flex-col md:flex-row flex justify-between gap-3">
            <div className=" flex w-full md:w-1/2 shrink-0 gap-2">
              {product && product?.productImages.length > 0 && (
                <div className=" flex flex-col w-auto shrink-0 relative gap-3">
                  {product.productImages.map((el, i) => (
                    <span
                      key={i}
                      onMouseMove={() => setProductImage(el)}
                      className=" realtive cursor-pointer"
                    >
                      <img src={el} alt="other picture" className="w-12 h-12" />
                    </span>
                  ))}
                </div>
              )}
              <div className=" flex-grow h-[10rem] md:h-[14rem] rounded-md overflow-hidden lg:h-[20rem] relative">
                {product && product.productImages.length > 0 ? (
                  <img
                    src={productImage}
                    alt="Uploaded Image"
                    className=" w-full h-full rounded-full"
                  />
                ) : (
                  <div className=" w-full h-full flex items-center justify-center bg-gray-700">
                    <h2 className=" text-white text-center">
                      No Product Image
                    </h2>
                  </div>
                )}
              </div>
            </div>
            <div className=" flex-grow">
              <h3 className="text-lg lg:text-2xl text-black font-bold">
                USD {product?.cost}
              </h3>
              <p className=" text-xs lg:text-sm text-primary mb-2">
                USD {product?.cost} each, ≥ 1 piece
              </p>
              <p className=" text-xs lg:text-sm text-slate-600 mb-2">
                Price shown before tax
              </p>

              <p className=" text-base lg:text-lg text-slate-800 mb-2 font-semibold">
                {product?.productName}
              </p>

              <div className=" flex items-center gap-3 border-b-[1px] border-slate-300 pb-2">
                <div className="text-base text-black">1123 Reviews</div>
                <div className="text-base text-black border-l-[1px] border-slate-300 pl-2">
                  150 sold
                </div>
              </div>

              <div className=" pb-2 mt-2">
                <div className="text-base text-black font-semibold mb-2">
                  Product sellpoints
                </div>
                <ul className=" list-disc pl-4 text-black">
                  {sellingPoints.map((el, i) => (
                    <li key={i} className=" text-xs lg:text-sm mb-2">
                      {el}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* cart  */}
        <div className="w-full">
          {user?.role.toLowerCase() === "buyer" ? (
            <div className="w-full md:w-[30rem] bg-white rounded-md p-2">
              {/* <AddCart /> */}
              <div className=" bg-white rounded-md p-3 w-full">
                <h3 className=" font-bold text-black text-xl lg:text-3xl">
                  <span className=" text-base lg:text-lg">USD</span>
                  {product?.cost}
                </h3>
                <p className=" text-xs text-slate-500 border-b-[1px] border-slate-300 pb-2">
                  Price shown before tax
                </p>
                {/* <div className=" flex items-center bg-yellow-400 bg-opacity-40 gap-2 mt-2">
              <span className=" bg-yellow-600 text-white text-xs font-semibold rounded-md px-1 py-1">
                Choice
              </span>
              <span className=" text-slate-700 text-xs lg:text-sm font-semibold">
                Alistyle commitment
              </span>
            </div> */}
                <div className="border-b-[1px] border-slate-300 pb-2">
                  <div className=" flex items-center gap-1 mb-2 mt-2 text-slate-500">
                    <div>
                      <h3 className=" text-black mt-0 text-base font-semibold">
                        {" "}
                        Security & Privacy{" "}
                      </h3>
                      <p className=" text-slate-600 text-xs break-all">
                        Safe payments: We do not share your personal details
                        with any third parties without your consent. Secure
                        personal details: We protect your privacy and keep your
                        personal details safe and secure.{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-black text-xl font-semibold mb-1">
                    Quantity
                  </h3>
                  <div className=" flex items-center gap-2 mb-2">
                    <span
                      onClick={decreaseCount}
                      className=" w-10 h-10 rounded-md bg-slate-200 flex items-center justify-center text-slate-800 font-semibold cursor-pointer"
                    >
                      -
                    </span>
                    <span className=" w-10 h-10 rounded-md bg-slate-200 flex items-center justify-center text-slate-800 font-semibold">
                      {quantity}
                    </span>
                    <span
                      onClick={() =>
                        increaseCount(product?.amountRemaining as number)
                      }
                      className=" w-10 h-10 rounded-md bg-slate-200 flex items-center justify-center text-slate-800 font-semibold cursor-pointer"
                    >
                      +
                    </span>
                  </div>
                  <p className=" text-slate-600">
                    {product?.amountRemaining} Pieces remaining
                  </p>
                </div>
                <div className=" flex flex-col items-center w-full gap-3 mt-3">
                  <button
                    onClick={() => handleBuyNow()}
                    className=" outline-none border-0 cursor-pointer bg-red-500 text-white w-full h-9 rounded-lg flex items-center justify-center transition-all hover:bg-red-600"
                  >
                    Buy now
                  </button>
                  {!isCart && (
                    <button
                      onClick={() => handleAddToCart()}
                      className=" outline-none border-0 cursor-pointer bg-orange-500 text-white w-full h-9 rounded-lg flex items-center justify-center transition-all hover:bg-orange-600"
                    >
                      Add to cart
                    </button>
                  )}
                  {isCart && (
                    <Link
                      href={`/cart`}
                      className=" outline-none deco border-0 cursor-pointer bg-orange-500 text-white w-full h-9 rounded-lg flex items-center justify-center transition-all hover:bg-orange-600"
                    >
                      Go to cart
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className=" flex items-center mt-4 gap-7">
              <div
                onClick={() => setEditModal(!editModal)}
                className=" bg-orange-600 text-white w-52 flex items-center justify-center h-12 rounded-lg cursor-pointer transition-all duration-300 hover:bg-orange-700 border-0"
              >
                Update
              </div>
              <div
                onClick={() => handleProductDelete()}
                className=" bg-red-500 text-white w-52 flex items-center justify-center h-12 rounded-lg cursor-pointer transition-all duration-300 hover:bg-red-600 border-0"
              >
                {actionLoad ? <SmallLoader /> : "Delete"}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        closeModal={() => setEditModal(!editModal)}
        isOpen={editModal}
        header={`Edit ${product?.productName}`}
      >
        <div>
          <form className=" mt-7" onSubmit={handleSubmit(editProduct)}>
            <div className=" grid grid-cols-2 gap-8">
              <label
                className=" col-span-2 flex flex-col text-slate-600 w-full text-lg font-medium gap-1"
                htmlFor=""
              >
                Product Name
                <Controller
                  control={control}
                  name="productName"
                  render={({ field: { onChange, value } }) => (
                    <input
                      type="text"
                      className=" border-slate-200  border-2 text-sm text-slate-700 font-normal rounded-md h-[2.5rem] w-full outline-none px-2"
                      value={value}
                      placeholder="product name"
                      onChange={onChange}
                    />
                  )}
                />
                <InlineErr err={errors?.productName?.message} />
              </label>
              <label
                className=" col-span-2 flex flex-col text-slate-600 w-full text-lg font-medium gap-1"
                htmlFor=""
              >
                Product Cost
                <Controller
                  control={control}
                  name="cost"
                  render={({ field: { onChange, value } }) => (
                    <input
                      type="text"
                      className=" border-slate-200  border-2 text-sm text-slate-700 font-normal rounded-md h-[2.5rem] w-full outline-none px-2"
                      value={value}
                      placeholder="2000"
                      onChange={onChange}
                    />
                  )}
                />
                <InlineErr err={errors?.cost?.message} />
              </label>
              <label
                className=" col-span-2 flex flex-col text-slate-600 w-full text-lg font-medium  gap-1"
                htmlFor=""
              >
                Number of Available Stock
                <Controller
                  control={control}
                  name="amountRemaining"
                  render={({ field: { onChange, value } }) => (
                    <input
                      type="text"
                      className=" border-slate-200  border-2 text-sm text-slate-700 font-normal rounded-md h-[2.5rem] w-full outline-none px-2"
                      value={value}
                      placeholder="145"
                      onChange={onChange}
                    />
                  )}
                />
                <InlineErr err={errors?.amountRemaining?.message} />
              </label>
            </div>

            <div className=" col-span-2 flex justify-center mt-9 mb-3">
              <button
                type="submit"
                className=" w-[20rem] h-12 bg-blue-600 text-white cursor-pointer flex gap-1 text-lg rounded-lg items-center justify-center"
              >
                {loading ? <SmallLoader /> : "...Create"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
