import { useEffect, useState } from "react";
import styled from "styled-components";
import Axios from "../api/Axios";
import { PieChart, Pie, Cell, ResponsiveContainer as RC2 } from "recharts";

export interface ParkingDetail {
  floor: string;
  parking: number;
  parkingarea: number;
  available_spots: number;
  occupancy_rate: string;
  datetm: string;
}

const OccupancyChart: React.FC<{ occupancyRate: number }> = ({
  occupancyRate,
}) => {
  const fixedRate = occupancyRate > 100 ? 100 : occupancyRate;
  const data = [
    { name: "Occupied", value: fixedRate },
    { name: "Available", value: 100 - fixedRate },
  ];
  const COLORS = ["#3b82f6", "#e0e0e0"];
  return (
    <ChartWrapper>
      <RC2 width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={20}
            outerRadius={30}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </RC2>
      <ChartText>{fixedRate.toFixed(1)}%</ChartText>
    </ChartWrapper>
  );
};

const ParkingSection: React.FC = () => {
  const [parkingData, setParkingData] = useState<ParkingDetail[]>([]);
  const [activeTab, setActiveTab] = useState<"T1" | "T2">("T1");

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const response = await Axios.get("/parking_status");
        if (response.data.parking_status) {
          const parkingObj = response.data.parking_status;
          const parkingArray: ParkingDetail[] = Object.values(
            parkingObj
          ).flat() as ParkingDetail[];

          setParkingData(parkingArray);
        }
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    };
    fetchParking();
  }, []);

  const filteredData = parkingData.filter((item) =>
    activeTab === "T1" ? item.floor.includes("T1") : item.floor.includes("T2")
  );

  return (
    <Container>
      <TabContainer>
        <TabButton
          active={activeTab === "T1"}
          onClick={() => setActiveTab("T1")}
        >
          제1여객터미널
        </TabButton>
        <TabButton
          active={activeTab === "T2"}
          onClick={() => setActiveTab("T2")}
        >
          제2여객터미널
        </TabButton>
      </TabContainer>
      <CardsContainer>
        {filteredData.length > 0 ? (
          filteredData.map((detail, idx) => {
            const occupancy = parseFloat(
              detail.occupancy_rate.replace("%", "")
            );
            return (
              <ParkingCard key={idx}>
                <ParkingTitle>{detail.floor}</ParkingTitle>
                <ParkingInfo>
                  <InfoItem>
                    주차: {detail.parking} / {detail.parkingarea} (
                    {occupancy > 100
                      ? "주차불가"
                      : `${detail.available_spots}대 가능`}
                    )
                  </InfoItem>
                  <InfoItem>
                    <OccupancyChart occupancyRate={occupancy} />
                  </InfoItem>
                </ParkingInfo>
              </ParkingCard>
            );
          })
        ) : (
          <PlaceholderText>데이터 없음</PlaceholderText>
        )}
      </CardsContainer>
    </Container>
  );
};

export default ParkingSection;

const Container = styled.div``;

const TabContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  margin-bottom: 16px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  margin-right: 15px;
  border: none;
  background: ${({ active }) => (active ? "#3b82f6" : "#e0e0e0")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const PlaceholderText = styled.p`
  color: #868e96;
  text-align: center;
  grid-column: 1 / -1;
`;

const ParkingCard = styled.div`
  background: #fdfdfd;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ParkingTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
`;

const ParkingInfo = styled.div`
  font-size: 14px;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoItem = styled.div`
  align-items: center;
  margin: 0 auto;
`;

const ChartWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const ChartText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
  color: #333;
`;
