import { ComponentPropsWithoutRef } from "react";

type ErrorDivProps = ComponentPropsWithoutRef<"div"> & {
  error?: string;
};

export default function ErrorDiv({ error, ...rest }: ErrorDivProps): JSX.Element {
  return (
    <>
      {error && (
        <div className="validation-error-text" {...rest}>
          {error}
        </div>
      )}
    </>
  );
}
