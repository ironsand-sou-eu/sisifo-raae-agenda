import DatePicker, { ReactDatePickerProps } from "react-datepicker";
import ErrorDiv from "./ErrorDiv";

export type SingleDatePickerProps = ReactDatePickerProps & {
  date?: Date | null;
  error?: string;
  label: string;
};

export default function SingleDatePicker({
  error,
  id,
  label,
  onChange,
  date,
  ...rest
}: SingleDatePickerProps): JSX.Element {
  const datePickerId = id ?? `filter-datepicker-${label.toLowerCase().replaceAll(" ", "")}`;
  return (
    <div>
      <label className="sisifo-label" htmlFor={datePickerId}>
        {label}
      </label>
      <ErrorDiv error={error} />
      <DatePicker
        id={datePickerId}
        selected={date}
        onChange={onChange}
        wrapperClassName="datepicker-wrapper text-center"
        className={`datepicker-input${error ? " validation-error" : ""}`}
        dateFormat="P"
        closeOnScroll
        {...rest}
      />
    </div>
  );
}
