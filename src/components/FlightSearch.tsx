import React, { useState } from "react";
import styled from "styled-components";
import { IoSearch } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

interface FlightSearchProps {
  onSearch: (data: {
    date: Date | null;
    flightNumber: string;
    departureTime: string;
  }) => void;
}

const FlightSearch: React.FC<FlightSearchProps> = ({ onSearch }) => {
  const [date, setDate] = useState<Date | null>(null);
  const [flightNumber, setFlightNumber] = useState<string>("");
  const [departureTime, setDepartureTime] = useState<string>("");

  const handleSearch = () => {
    onSearch({ date, flightNumber, departureTime });
  };

  return (
    <Container>
      <Row>
        <Label>출국날짜:</Label>
        <StyledDatePicker
          selected={date}
          onChange={(selectedDate: Date | null) => setDate(selectedDate)}
          dateFormat="yyyy-MM-dd"
          placeholderText="2025-01-01"
          locale={ko}
        />
        <Label>항공편:</Label>
        <Input
          type="text"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
          placeholder="TW281"
        />
        <Label>출국시간:</Label>
        <Input
          type="text"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          placeholder="12:12"
        />
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
  gap: 8px;
`;

const Label = styled.p`
  margin: 0;
  font-size: 14px;
`;

const Input = styled.input`
  border: 1px solid ${(props) => props.theme.colors.gray};
  border-radius: 5px;
  padding: 5px 8px;
  font-size: 14px;
  flex: 1;
  margin-right: 30px;
`;

const StyledDatePicker = styled(DatePicker)<
  React.ComponentProps<typeof DatePicker>
>`
  border: 1px solid ${(props) => props.theme.colors.gray};
  border-radius: 5px;
  padding: 5px 8px;
  font-size: 14px;
  flex: 1;
  margin-right: 30px;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.blue};
  padding: 5px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: ${(props) => props.theme.colors.pointBlue};
    color: white;
  }
`;
