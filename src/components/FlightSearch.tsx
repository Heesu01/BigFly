import { useState } from "react";
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
    year: number;
    month: number;
    day: number;
    airline: string;
    flight_number: string;
    departure_time: string;
  }) => void;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | null>(null);
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [departureTime, setDepartureTime] = useState<string>("");

  const handleSearch = () => {
    if (!date || !flightNumber || !departureTime) {
      alert("모든 필드를 입력해주세요!");
      return;
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const airline = flightNumber.slice(0, 2);
    const flightNum = flightNumber.slice(2);

    const formattedData = {
      year,
      month,
      day,
      airline,
      flight_number: flightNum,
      departure_time: departureTime,
    };

    onSearch(formattedData);
    navigate("/departure/detail", { state: formattedData });
  };

  return (
    <Container>
      <Row>
        <InputContainer>
          <IoCalendarOutline size={20} color="#888" />
          <DatePickerWrapper>
            <DatePicker
              selected={date}
              onChange={(selectedDate: Date | null) => setDate(selectedDate)}
              dateFormat="yyyy. MM. dd."
              placeholderText="출국 날짜"
              locale={ko}
              className="custom-datepicker"
            />
          </DatePickerWrapper>
        </InputContainer>

        <InputContainer>
          <IoTimeOutline size={20} color="#888" />
          <Input
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            placeholder="12:12"
          />
        </InputContainer>

        <InputContainer>
          <IoAirplane size={20} color="#888" />
          <Input
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
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

  &:focus {
    outline: none;
  }
`;

const DatePickerWrapper = styled.div`
  .custom-datepicker {
    border: none;
    font-size: 14px;
    flex: 1;
  }

  .custom-datepicker:focus {
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
