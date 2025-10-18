import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, XCircle, HelpCircle, ShieldAlert } from "lucide-react";

export default function InjuryIndicator({ status, description, size = "sm" }) {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('out') || statusLower.includes('ir')) {
      return {
        icon: XCircle,
        className: "bg-red-500/20 text-red-400",
        text: "OUT"
      };
    }
    
    if (statusLower.includes('doubtful')) {
      return {
        icon: ShieldAlert,
        className: "bg-orange-500/20 text-orange-400",
        text: "DOUBTFUL"
      };
    }
    
    if (statusLower.includes('questionable')) {
      return {
        icon: HelpCircle,
        className: "bg-yellow-500/20 text-yellow-400",
        text: "QUESTIONABLE"
      };
    }
    
    return {
      icon: AlertTriangle,
      className: "bg-slate-500/20 text-slate-400",
      text: status?.toUpperCase() || "INJURED"
    };
  };

  if (!status) return null;

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${size === 'xs' ? 'text-xs px-1' : ''}`} title={description}>
      <Icon className={`${size === 'xs' ? 'w-2 h-2' : 'w-3 h-3'} mr-1`} />
      {config.text}
    </Badge>
  );
}