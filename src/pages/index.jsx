import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Alerts from "./Alerts";

import Algorithm from "./Algorithm";

import Props from "./Props";

import Injuries from "./Injuries";

import Databases from "./Databases";

import Schedules from "./Schedules";

import Performance from "./Performance";

import Settings from "./Settings";

import slate from "./slate";

import Debug from "./Debug";

import Research from "./Research";

import Home from "./Home";

import CFBPage from "./CFBPage";

import NBAPage from "./NBAPage";

import MLBPage from "./MLBPage";

import GolfPage from "./GolfPage";

import UFCPage from "./UFCPage";

import MultiSportOdds from "./MultiSportOdds";

import TeamProps from "./TeamProps";

import PropsAnalyzer from "./PropsAnalyzer";

import NFLPage from "./NFLPage";

import PropsPage from "./PropsPage";

import InjuriesPage from "./InjuriesPage";

import ManualTools from "./ManualTools";

import DevPredictionTracker from "./DevPredictionTracker";

import PredictionResults from "./PredictionResults";

import PredictionHistory from "./PredictionHistory";

import SportPage from "./SportPage";

import DeveloperTools from "./DeveloperTools";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Alerts: Alerts,
    
    Algorithm: Algorithm,
    
    Props: Props,
    
    Injuries: Injuries,
    
    Databases: Databases,
    
    Schedules: Schedules,
    
    Performance: Performance,
    
    Settings: Settings,
    
    slate: slate,
    
    Debug: Debug,
    
    Research: Research,
    
    Home: Home,
    
    CFBPage: CFBPage,
    
    NBAPage: NBAPage,
    
    MLBPage: MLBPage,
    
    GolfPage: GolfPage,
    
    UFCPage: UFCPage,
    
    MultiSportOdds: MultiSportOdds,
    
    TeamProps: TeamProps,
    
    PropsAnalyzer: PropsAnalyzer,
    
    NFLPage: NFLPage,
    
    PropsPage: PropsPage,
    
    InjuriesPage: InjuriesPage,
    
    ManualTools: ManualTools,
    
    DevPredictionTracker: DevPredictionTracker,
    
    PredictionResults: PredictionResults,
    
    PredictionHistory: PredictionHistory,
    
    SportPage: SportPage,
    
    DeveloperTools: DeveloperTools,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Alerts" element={<Alerts />} />
                
                <Route path="/Algorithm" element={<Algorithm />} />
                
                <Route path="/Props" element={<Props />} />
                
                <Route path="/Injuries" element={<Injuries />} />
                
                <Route path="/Databases" element={<Databases />} />
                
                <Route path="/Schedules" element={<Schedules />} />
                
                <Route path="/Performance" element={<Performance />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/slate" element={<slate />} />
                
                <Route path="/Debug" element={<Debug />} />
                
                <Route path="/Research" element={<Research />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/CFBPage" element={<CFBPage />} />
                
                <Route path="/NBAPage" element={<NBAPage />} />
                
                <Route path="/MLBPage" element={<MLBPage />} />
                
                <Route path="/GolfPage" element={<GolfPage />} />
                
                <Route path="/UFCPage" element={<UFCPage />} />
                
                <Route path="/MultiSportOdds" element={<MultiSportOdds />} />
                
                <Route path="/TeamProps" element={<TeamProps />} />
                
                <Route path="/PropsAnalyzer" element={<PropsAnalyzer />} />
                
                <Route path="/NFLPage" element={<NFLPage />} />
                
                <Route path="/PropsPage" element={<PropsPage />} />
                
                <Route path="/InjuriesPage" element={<InjuriesPage />} />
                
                <Route path="/ManualTools" element={<ManualTools />} />
                
                <Route path="/DevPredictionTracker" element={<DevPredictionTracker />} />
                
                <Route path="/PredictionResults" element={<PredictionResults />} />
                
                <Route path="/PredictionHistory" element={<PredictionHistory />} />
                
                <Route path="/SportPage" element={<SportPage />} />
                
                <Route path="/DeveloperTools" element={<DeveloperTools />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}