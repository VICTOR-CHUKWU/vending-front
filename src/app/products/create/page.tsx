/* eslint-disable @next/next/no-img-element */
'use client'

import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";

import { InlineErr, SmallLoader } from "@/components/shared";
import { createProductFormSchema, errorToast, successToast } from "@/utils";
import { useGetProducts, useUser } from "@/hooks/swrhooks";
import { createProduct } from "@/services/product";
import { ProductCreationPayload } from "@/types";
import { mutate } from "swr";
import { useRouter } from "next/navigation";
import { CloudinaryUploadWidget } from "@/components/cloudinary/CloudinaryWidget";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter()
  const { products, productLoading, mutate } = useGetProducts();
    const [loading, setLoading] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

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

      const onFinishUpload = (info: any) => {
        console.log(info, 'info')
        setUploadedImages((prev) => (
          [...prev, info.secure_url]
        ));
      };
    
      const handleRemoveImage = (url: string) => {
        // Remove from UI
        setUploadedImages(uploadedImages.filter((img) => img !== url));
       
      };
    
    

      const create = async (data: any) => {
        if(productLoading || isLoading) return
        setLoading(true)
            const payload: ProductCreationPayload = {
              productName: data.productName,
              cost: data.cost,
              amountRemaining: data.amountRemaining,
              sellerId: user?.id as string,
              productImages: uploadedImages
              
            }
            try {
              const resp = await createProduct(payload)
              if(resp.success){
                mutate()
                successToast(resp.message || "created succesfully")
                router.back()
              }
            } catch (error: any) {
              errorToast("could not create product")
            }
      }

    return (
        <>
       <div className=" container mt-20 lg:mt-36">
       <div className=" bg-white w-full md:w-2/3 xl:w-1/2 mx-auto p-8 rounded-lg">
            <h3 className=" text-3xl font-semibold mb-6 text-center">Create Product</h3>
            <div>
            <div className=" cursor-pointer mb-3">
                <p>Upload product Images</p>
                

                    <CloudinaryUploadWidget
                      title={"upload profile picture"}
                      className="w-100"
                      onFinish={onFinishUpload}
                    >
                    <Image
                        src={`/img/camera.png`}
                        alt="profile"
                        width={50}
                        height={50}
                        className=" mix-blend-multiply"
                      />
                    </CloudinaryUploadWidget>
                  </div>
             
            <form className=" mt-7" onSubmit={handleSubmit(create)}>
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
            <div className="flex gap-4 mt-2">
                    {uploadedImages.map((url) => (
                      <div key={url} className="relative p-3">
                        <img
                          src={url}
                          alt="Uploaded Image"
                          className=" w-20 h-20 rounded-full"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(url)}
                          className="absolute w-5 h-5 top-0 right-0 flex items-center justify-center bg-red-500 text-white p-1 rounded-full"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
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
        </div>
       </div>
        </>
    )
}