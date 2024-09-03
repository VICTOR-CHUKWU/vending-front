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

    return (
        <CldUploadWidget
          options={{
            uploadPreset: 'victor',
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
            // Manually control closing if needed
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
