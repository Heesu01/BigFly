import { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "../api/Axios";
import axios from "axios";

interface AirportStatus {
  passenger_count: number;
  group_passenger: number;
  congestion: string;
}

interface AirportData {
  international: { [hour: string]: AirportStatus };
  domestic: { [hour: string]: AirportStatus };
}

interface OtherStatusResponse {
  airport_data: { [airportCode: string]: AirportData };
}

const OtherStatus: React.FC = () => {
  const [data, setData] = useState<OtherStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await Axios.get<OtherStatusResponse>("/other_status");
        setData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "데이터를 불러오는 중 오류가 발생했습니다."
          );
        } else {
          setError("기타 공항 정보를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Container>{error}</Container>;
  if (!data) return <Container>No data</Container>;

  const airports = Object.entries(data.airport_data);
  const totalPages = airports.length;
  const [code, airportData] = airports[currentPage];

  const airportMapping: { [code: string]: string } = {
    CJU: "제주공항",
    GMP: "김포공항",
    CJJ: "청주공항",
  };
  const displayAirport = airportMapping[code] || code;

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const renderAirportSection = (
    airportCode: string,
    airportData: AirportData
  ) => {
    const internationalStatus = Object.values(airportData.international)[0];
    const domesticStatus = Object.values(airportData.domestic)[0];

    return (
      <AirportSection key={airportCode}>
        <AirportTitle>{displayAirport}</AirportTitle>
        <Section>
          <SectionTitle>International</SectionTitle>
          {internationalStatus ? (
            <StatusRow>
              <PassengerCount>
                {internationalStatus.passenger_count.toLocaleString()}명
              </PassengerCount>
              <CongestionIndicator congestion={internationalStatus.congestion}>
                {internationalStatus.congestion === "Y" ? "혼잡" : "원활"}
              </CongestionIndicator>
            </StatusRow>
          ) : (
            <p>데이터가 없습니다.</p>
          )}
        </Section>
        <Section>
          <SectionTitle>Domestic</SectionTitle>
          {domesticStatus ? (
            <StatusRow>
              <PassengerCount>
                {domesticStatus.passenger_count.toLocaleString()}명
              </PassengerCount>
              <CongestionIndicator congestion={domesticStatus.congestion}>
                {domesticStatus.congestion === "Y" ? "혼잡" : "원활"}
              </CongestionIndicator>
            </StatusRow>
          ) : (
            <p>데이터가 없습니다.</p>
          )}
        </Section>
      </AirportSection>
    );
  };

  return (
    <Container>
      <ArrowWrapper>
        <ArrowButton onClick={handlePrev} disabled={currentPage === 0}>
          &lt;
        </ArrowButton>
        <ContentWrapper>
          {renderAirportSection(code, airportData)}
        </ContentWrapper>
        <ArrowButton
          onClick={handleNext}
          disabled={currentPage === totalPages - 1}
        >
          &gt;
        </ArrowButton>
      </ArrowWrapper>
    </Container>
  );
};

export default OtherStatus;

const Container = styled.div``;

const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ArrowButton = styled.button`
  font-size: 24px;
  border: none;
  background-color: #fff;
  cursor: pointer;
  margin: 0 10px;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const AirportSection = styled.div`
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 10px;
  margin: 5px 0;
`;

const AirportTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 12px;
  p {
    font-size: 14px;
    text-align: center;
  }
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  margin-right: 10px;
`;

const PassengerCount = styled.span`
  font-size: 14px;
  flex: 1;
  margin-left: 10px;
`;

const CongestionIndicator = styled.span<{ congestion: string }>`
  font-size: 14px;
  font-weight: bold;
  color: ${({ congestion }) => (congestion === "Y" ? "#d32f2f" : "#0288d1")};
`;
