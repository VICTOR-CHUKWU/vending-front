'use client'
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

export const CloudinaryUploadWidget = ({
    onFinish,
    title,
    className,
    children,
  }: {
    [key: string]: any;
  }) => {
    const [resource, setResource] = useState<string | undefined>('');
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'victor';

    return (
        <CldUploadWidget
          options={{
            uploadPreset,
            cropping: true, 
            croppingAspectRatio: 1,
            showSkipCropButton: true,
            croppingShowDimensions: true,
            multiple: true,
            ...title,
          }}
          onSuccess={(result, { widget }) => {
            setResource(result?.info as string); 
            onFinish(result.info);
          }}
          onQueuesEnd={(result, { widget }) => {
            // Manually control closing if needed
          }}
        >
          {({ open }) => {
            function handleOnClick() {
              setResource(undefined);
              open();
            }
            return (
              <div onClick={handleOnClick} className={` ${className ? className : ""}`}>
                {children && <div>{children}</div>}
              </div>
            );
          }}
        </CldUploadWidget>
    );
}
