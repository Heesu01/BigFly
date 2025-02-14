import { Navigate, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import MainPage from "./pages/MainPage";
import RealTimeAirport from "./pages/RealTimeAirport";
import AirportNews from "./pages/AirportNews";
import DepartureRecommendation from "./pages/DepartureRecommendation";
import DepartureDetail from "./pages/DepartureDetail";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/main" />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/realtime" element={<RealTimeAirport />} />
          <Route path="/news" element={<AirportNews />} />
          <Route path="/departure" element={<DepartureRecommendation />} />
          <Route path="/departure/detail" element={<DepartureDetail />} />
          <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
        </Routes>
      </Layout>
      <ScrollToTop />
    </>
  );
}

export default App;
