import React, { useState } from "react";
import { getTeamLogo, getTeamAbbr } from "../utils/teamLogos";

/**
 * Team Logo Component with fallback to initials
 * Lazy loads images for performance
 */
export default function TeamLogo({ sport, teamName, size = "md" }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const logoUrl = getTeamLogo(sport, teamName);
  const abbr = getTeamAbbr(teamName);
  
  // Size mappings
  const sizeClasses = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-12 h-12 text-sm",
    xl: "w-16 h-16 text-base"
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // Show initials if no logo or image failed to load
  const showInitials = !logoUrl || imageError;
  
  if (showInitials) {
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-white shadow-md border border-slate-600`}>
        {abbr}
      </div>
    );
  }
  
  return (
    <div className={`${sizeClass} relative`}>
      {/* Skeleton loader while image loads */}
      {!imageLoaded && (
        <div className={`${sizeClass} absolute inset-0 rounded-full bg-slate-700 animate-pulse`} />
      )}
      
      {/* Actual image */}
      <img
        src={logoUrl}
        alt={`${teamName} logo`}
        className={`${sizeClass} object-contain transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  );
}