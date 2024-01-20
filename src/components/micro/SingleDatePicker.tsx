import DatePicker from "react-datepicker";

export type SingleDatePickerProps = {
  label: string;
  onChange: (newValue: any) => void;
  date?: Date | null;
  readonly?: boolean;
};

export default function SingleDatePicker({ label, onChange, date, readonly }: SingleDatePickerProps): JSX.Element {
  const datePickerId = `filter-datepicker-${label.toLowerCase().replaceAll(" ", "")}`;
  return (
    <div>
      <label className="sisifo-label" htmlFor={datePickerId}>
        {label}
      </label>
      <DatePicker
        id={datePickerId}
        selected={date}
        onChange={onChange}
        wrapperClassName="datepicker-wrapper text-center"
        className="datepicker-input"
        dateFormat={"dd/MM/yyyy"}
        closeOnScroll
        readOnly={readonly}
      />
    </div>
  );
}

// TODO: codigoUsuarioCriador: 89323
