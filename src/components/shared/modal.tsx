import { Fragment, ReactNode, memo } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/20/solid";

const _Modal = ({
  isOpen,
  closeModal,
  header,
  description,
  children,
  large = false,
}: {
  isOpen: boolean;
  closeModal: () => void;
  header: string;
  description?: string;
  children: ReactNode;
  large?: boolean;
}) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 over">
            <div className="flex h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className={`w-full  ${
                    large ? "max-w-3xl" : "max-w-lg"
                  } transform rounded-2xl bg-white py-6 px-1 text-left align-middle shadow-xl transition-all`}
                >
                  <div className=" max-h-[90vh] px-3 relative">
                    <DialogTitle
                      as="h3"
                      className="text-lg font-semibold leading-6 text-center text-slate-800"
                    >
                      {header}
                    </DialogTitle>
                    {
                      description && (
                        <div className="mt-2">
                      <p className="text-sm font-semibold text-slate-500 text-center">
                        {description}
                      </p>
                    </div>
                      )
                    }
                    <span
                      className=" cursor-pointer absolute right-1 -top-5 z-20 justify-self-end"
                      onClick={closeModal}
                    >
                      <XCircleIcon className="w-7 h-7" />
                    </span>
                    <div className="  max-h-[90vh]">{children}</div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export const Modal = memo(_Modal);
