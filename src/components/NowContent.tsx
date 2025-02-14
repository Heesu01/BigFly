import React, { useState } from "react";
import styled from "styled-components";

// 목데이터
const mockDepartureData = [
  {
    terno: "T1",
    gate: "A",
    congestion: "혼잡",
    passengers: 120,
    estimatedWait: "30분",
  },
  {
    terno: "T1",
    gate: "B",
    congestion: "보통",
    passengers: 80,
    estimatedWait: "20분",
  },
  {
    terno: "T1",
    gate: "C",
    congestion: "여유",
    passengers: 40,
    estimatedWait: "10분",
  },
  {
    terno: "T1",
    gate: "D",
    congestion: "혼잡",
    passengers: 150,
    estimatedWait: "40분",
  },
  {
    terno: "T1",
    gate: "E",
    congestion: "보통",
    passengers: 90,
    estimatedWait: "25분",
  },
  {
    terno: "T2",
    gate: "A",
    congestion: "혼잡",
    passengers: 200,
    estimatedWait: "50분",
  },
  {
    terno: "T2",
    gate: "B",
    congestion: "보통",
    passengers: 130,
    estimatedWait: "30분",
  },
  {
    terno: "T2",
    gate: "C",
    congestion: "여유",
    passengers: 60,
    estimatedWait: "15분",
  },
  {
    terno: "T2",
    gate: "D",
    congestion: "보통",
    passengers: 110,
    estimatedWait: "25분",
  },
  {
    terno: "T2",
    gate: "E",
    congestion: "혼잡",
    passengers: 180,
    estimatedWait: "45분",
  },
];

const DepartureStatus = () => {
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(mockDepartureData.length / itemsPerPage);
  const displayedItems = mockDepartureData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Container>
      <Title>출국장 혼잡도 현황</Title>

      {displayedItems.length === 0 ? (
        <NoData>현재 출국장 혼잡도 데이터가 없습니다.</NoData>
      ) : (
        <>
          <StatGrid>
            {displayedItems.map((item, index) => (
              <StatItem key={index} congestionLevel={item.congestion}>
                <Header>
                  <Terminal>🌍 {item.terno}</Terminal>
                  <Gate>🛫 {item.gate} 출국장</Gate>
                </Header>
                <Detail>
                  <Label>혼잡도</Label>
                  <Value congestionLevel={item.congestion}>
                    {item.congestion}
                  </Value>
                </Detail>
                <Detail>
                  <Label>탑승객 수</Label>
                  <Value>{item.passengers}명</Value>
                </Detail>
                <Detail>
                  <Label>예상 대기 시간</Label>
                  <Value>{item.estimatedWait}</Value>
                </Detail>
              </StatItem>
            ))}
          </StatGrid>

          <Pagination>
            <PageButton
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              ◀
            </PageButton>
            <PageNumber>
              {page} / {totalPages}
            </PageNumber>
            <PageButton
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              ▶
            </PageButton>
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default DepartureStatus;

const Container = styled.div`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
`;

const NoData = styled.p`
  font-size: 16px;
  color: #888;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
  width: 100%;
`;

const StatItem = styled.div<{ congestionLevel: string }>`
  background: ${(props) =>
    props.congestionLevel === "혼잡"
      ? "#ffcccc"
      : props.congestionLevel === "보통"
      ? "#fff3cd"
      : "#d4edda"};
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
`;

const Terminal = styled.div`
  color: #007bff;
`;

const Gate = styled.div`
  color: #ff4d4d;
`;

const Detail = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
`;

const Label = styled.span`
  font-weight: bold;
  color: #555;
`;

const Value = styled.span<{ congestionLevel?: string }>`
  color: ${(props) =>
    props.congestionLevel === "혼잡"
      ? "#d9534f"
      : props.congestionLevel === "보통"
      ? "#ff9800"
      : "#28a745"};
  font-weight: bold;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
`;

const PageButton = styled.button`
  padding: 0px 12px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumber = styled.span`
  font-size: 15px;
  font-weight: bold;
`;
