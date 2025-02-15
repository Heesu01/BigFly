import React, { useState } from "react";
import styled from "styled-components";
import {
  IoSearch,
  IoCalendarOutline,
  IoAirplane,
  IoTimeOutline,
} from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface FlightSearchProps {
  onSearch: (data: {
    date: Date | null;
    flightNumber: string;
    departureTime: string;
  }) => void;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | null>(null);
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [departureTime, setDepartureTime] = useState<string>("");

  const handleSearch = () => {
    onSearch({ date, flightNumber, departureTime });
    const searchData = { date, flightNumber, departureTime };
    navigate("/departure/detail", { state: searchData });
  };

  return (
    <Container>
      <Row>
        <InputContainer>
          <IoCalendarOutline size={20} color="#888" />
          <StyledDatePicker
            selected={date}
            onChange={(selectedDate: Date | null) => setDate(selectedDate)}
            dateFormat="yyyy. MM. dd."
            placeholderText="출국 날짜"
            locale={ko}
          />
        </InputContainer>

        <InputContainer>
          <IoTimeOutline size={20} color="#888" />
          <Input
            type="text"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            placeholder="오후 12:12"
          />
        </InputContainer>

        <InputContainer>
          <IoAirplane size={20} color="#888" />
          <Input
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            placeholder="TW281"
          />
        </InputContainer>

        <Button onClick={handleSearch}>
          <IoSearch />
          찾기
        </Button>
      </Row>
    </Container>
  );
};

export default FlightSearch;

const Container = styled.div`
  padding: 9px 30px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  margin: auto;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 5px 12px;
  gap: 8px;
  width: 20vw;
`;

const Input = styled.input`
  border: none;
  font-size: 14px;
  flex: 1;
  margin-right: 30px;

  &:focus {
    outline: none;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  border: none;
  font-size: 14px;
  flex: 1;

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: #0056b3;
  }
`;
