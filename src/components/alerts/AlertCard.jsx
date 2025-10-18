import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Target, 
  Check,
  Clock,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";

const alertIcons = {
  line_movement: TrendingUp,
  sharp_action: Target,
  public_fade: Activity,
  injury_update: AlertTriangle,
  algorithm_signal: DollarSign
};

const severityColors = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30"
};

export default function AlertCard({ alert, onMarkAsRead }) {
  const IconComponent = alertIcons[alert.alert_type] || AlertTriangle;

  return (
    <Card className={`bg-slate-900 border-slate-800 ${!alert.is_read ? 'border-l-4 border-l-sky-400' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <IconComponent className="w-5 h-5 text-sky-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className={severityColors[alert.severity]}>
                  {alert.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-slate-400">
                  {alert.sport}
                </Badge>
                <Badge variant="outline" className="text-slate-400 capitalize">
                  {alert.alert_type.replace(/_/g, ' ')}
                </Badge>
                {!alert.is_read && (
                  <Badge className="bg-sky-500/20 text-sky-400">New</Badge>
                )}
              </div>
              <CardTitle className="text-white text-lg">
                {alert.event_description}
              </CardTitle>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Clock className="w-3 h-3" />
                {format(new Date(alert.created_date), "MMM d, h:mm a")}
              </div>
            </div>
          </div>
          
          {!alert.is_read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAsRead}
              className="text-slate-400 hover:text-white"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Market Data */}
        {alert.market_data && (
          <div className="bg-slate-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Market Data</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {Object.entries(alert.market_data).map(([key, value]) => (
                <div key={key}>
                  <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}: </span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {alert.recommendation && (
          <div className="bg-slate-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Recommendation</h4>
            <p className="text-slate-300">{alert.recommendation}</p>
            {alert.confidence_score && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-slate-400 text-sm">Confidence:</span>
                <Badge className="bg-sky-500/20 text-sky-400">
                  {alert.confidence_score}%
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}