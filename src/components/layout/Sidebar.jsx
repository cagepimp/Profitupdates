import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useBase44 } from "@/components/contexts/Base44Context";
import {
  Home,
  Shield,
  GraduationCap,
  Trophy,
  Diamond,
  Flag,
  Wrench,
  Activity,
  Target,
  LineChart,
  Brain,
  BarChart3,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const mainPages = [
  { path: "Home", label: "NFL", icon: Shield, sport: "NFL" },
  { path: "CFBPage", label: "CFB", icon: GraduationCap, sport: null },
  { path: "NBAPage", label: "NBA", icon: Trophy, sport: null },
  { path: "MLBPage", label: "MLB", icon: Diamond, sport: null },
  { path: "UFCPage", label: "UFC", icon: Shield, sport: null },
  { path: "GolfPage", label: "Golf", icon: Flag, sport: null },
  { path: "PropsPage", label: "Top Props", icon: Target, sport: null },
];

const analyticsPages = [
  { path: "InjuriesPage", label: "Injuries", icon: Activity },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useBase44();
  const query = new URLSearchParams(location.search);
  const currentSport = query.get("sport")?.toUpperCase();
  const isDevTools = query.get("devtools") === "true";
  
  const isAdmin = user?.role === "admin";

  const goToPage = (pageName, sport) => {
    let url = createPageUrl(pageName);
    if (sport) {
      url += `?sport=${sport}`;
    }
    navigate(url);
  };

  // ✅ FIXED - Now navigates to DeveloperTools page
  const goToDevTools = () => {
    navigate('/DeveloperTools');
  };

  const isInjuriesPage = location.pathname.includes('InjuriesPage');
  const isPropsPage = location.pathname.includes('PropsPage');
  const isMultiSportOdds = location.pathname.includes('MultiSportOdds');
  const isPredictionHistory = location.pathname.includes('PredictionHistory');
  const isHomePage = location.pathname.includes('Home');
  const isCFBPage = location.pathname.includes('CFBPage');
  const isNBAPage = location.pathname.includes('NBAPage');
  const isMLBPage = location.pathname.includes('MLBPage');
  const isUFCPage = location.pathname.includes('UFCPage');
  const isGolfPage = location.pathname.includes('GolfPage');
  const isDeveloperTools = location.pathname.includes('DeveloperTools');

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-slate-900/50 backdrop-blur-xl border-r border-purple-500/20 flex flex-col shadow-2xl z-50">
      {/* Logo */}
      <div className="p-6 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Prophet.AI
            </h1>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {/* Leagues */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Leagues
          </h3>
          <div className="space-y-1">
            {mainPages.map(({ path, label, icon: Icon, sport }) => {
              let isActive = false;
              
              if (label === 'NFL') isActive = isHomePage && currentSport === 'NFL';
              else if (label === 'CFB') isActive = isCFBPage;
              else if (label === 'NBA') isActive = isNBAPage;
              else if (label === 'MLB') isActive = isMLBPage;
              else if (label === 'UFC') isActive = isUFCPage;
              else if (label === 'Golf') isActive = isGolfPage;
              else if (label === 'Top Props') isActive = isPropsPage;
              
              return (
                <button
                  key={label}
                  onClick={() => goToPage(path, sport)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Analytics */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Analytics
          </h3>
          <div className="space-y-1">
            {analyticsPages.map(({ path, label, icon: Icon }) => {
              let isActive = false;
              if (label === 'Injuries') isActive = isInjuriesPage;
              
              return (
                <button
                  key={label}
                  onClick={() => goToPage(path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin */}
        {isAdmin && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Admin
            </h3>
            <div className="space-y-1">
              <button
                onClick={goToDevTools}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isDeveloperTools
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Wrench className="w-5 h-5" />
                <span className="font-medium text-sm">Developer Tools</span>
              </button>
              <button
                onClick={() => goToPage('MultiSportOdds')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isMultiSportOdds
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LineChart className="w-5 h-5" />
                <span className="font-medium text-sm">Multi-Sport Odds</span>
              </button>
              <button
                onClick={() => goToPage('PredictionHistory')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isPredictionHistory
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium text-sm">Prediction History</span>
              </button>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* User Info */}
      <div className="p-4 border-t border-purple-500/20">
        <div className="text-center">
          <p className="text-sm text-gray-400">{user?.email || 'Guest'}</p>
          {isAdmin && (
            <span className="inline-block mt-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded">
              ADMIN
            </span>
          )}
        </div>
      </div>
    </div>
  );
}