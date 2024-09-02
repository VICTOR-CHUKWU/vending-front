import { FC, memo } from "react";
import { InlineErrProps } from "@/types";

const _InlineErr: FC<InlineErrProps> = ({ err }) => {
    if (err) {
        return (
            <p className="text-red-600 italic text-xs">
                {err}
            </p>
        );
    } else {
        return null;
    }
};

export const InlineErr: FC<InlineErrProps> = memo(_InlineErr);
