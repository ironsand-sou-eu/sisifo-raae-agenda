import DatePicker from "react-datepicker";

export type SingleDatePickerProps = {
  label: string;
  date?: Date | null;
  onChange: (newValue: any) => void;
};

export default function SingleDatePicker({ label, date, onChange }: SingleDatePickerProps): JSX.Element {
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
        wrapperClassName="datepicker-wrapper"
        className="datepicker-input"
        dateFormat={"dd/MM/yyyy"}
        closeOnScroll
      />
    </div>
  );
}

// TODO: codigoUsuarioCriador: 89323
