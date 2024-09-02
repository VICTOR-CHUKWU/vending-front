import { FC, memo, useMemo } from "react";

type PaginationProp = {
    isDecreaseDiabled: boolean,
    isIncreaseDiabled: boolean,
    prev: () => void,
    next: () => void,
    current: number,
    total: number
}

const _Paginate: FC<PaginationProp> = ({
 isDecreaseDiabled, isIncreaseDiabled, prev, next, current, total
}) => {

  return (
    <div className="flex items-center justify-end gap-3 w-full p-3">
      <button onClick={prev} disabled={isDecreaseDiabled} className={`${isDecreaseDiabled ? 'cursor-not-allowed bg-slate-200' : 'bg-slate-400 cursor-pointer'} rounded-md px-3 py-1 text-sm font-medium text-orange-400`}>Prev</button>
      <p className="font-medium text-lg text-blue-900">{current} of {total}</p>
      <button onClick={next} disabled={isIncreaseDiabled} className={`${isIncreaseDiabled ? 'cursor-not-allowed bg-slate-200' : 'bg-slate-400 cursor-pointer'} rounded-md px-3 py-1 text-sm font-medium text-blue-700`}>Next</button>
    </div>
  );
};

export const Paginate: FC<PaginationProp> = memo(_Paginate);
