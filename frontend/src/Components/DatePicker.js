import React, { useState, useRef, forwardRef } from 'react';
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";

import "react-datepicker/dist/react-datepicker.css";

export default function DatePickerCustom(props) {
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
    return (
      <button className="example-custom-input" onClick={onClick} ref={ref}>
        {value}
      </button>
    )}
  );
  return (
    <DatePicker
      locale={ko}
      selected={props.startDate}
      onChange={(date) => props.setStartDate(date)}
      dateFormat="yyyy년 MM월 dd일"
      customInput={<ExampleCustomInput />}
    />
  );
};