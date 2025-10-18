import React, { useState, useEffect } from "react";
import { Alert } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Target, 
  Check, 
  X,
  Bell,
  Settings
} from "lucide-react";

import AlertCard from "../components/alerts/AlertCard";
import AlertFilters from "../components/alerts/AlertFilters";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadAlerts = async () => {
    const data = await Alert.list("-created_date");
    setAlerts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = alerts;

      switch(filter) {
        case 'unread':
          filtered = alerts.filter(alert => !alert.is_read);
          break;
        case 'critical':
          filtered = alerts.filter(alert => alert.severity === 'critical');
          break;
        case 'high':
          filtered = alerts.filter(alert => alert.severity === 'high');
          break;
        case 'line_movement':
          filtered = alerts.filter(alert => alert.alert_type === 'line_movement');
          break;
        case 'sharp_action':
          filtered = alerts.filter(alert => alert.alert_type === 'sharp_action');
          break;
      }

      setFilteredAlerts(filtered);
    };

    applyFilters();
  }, [alerts, filter]);

  const markAsRead = async (alertId) => {
    await Alert.update(alertId, { is_read: true });
    loadAlerts();
  };

  const markAllAsRead = async () => {
    const unreadAlerts = alerts.filter(alert => !alert.is_read);
    for (const alert of unreadAlerts) {
      await Alert.update(alert.id, { is_read: true });
    }
    loadAlerts();
  };

  const getSeverityStats = () => {
    return {
      critical: alerts.filter(a => a.severity === 'critical' && !a.is_read).length,
      high: alerts.filter(a => a.severity === 'high' && !a.is_read).length,
      medium: alerts.filter(a => a.severity === 'medium' && !a.is_read).length,
      total: alerts.filter(a => !a.is_read).length
    };
  };

  const stats = getSeverityStats();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Alerts & Signals
            </h1>
            <p className="text-slate-400 mt-2">Critical market movements and algorithmic signals</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              disabled={stats.total === 0}
              className="border-slate-600"
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" className="border-slate-600">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Alerts</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Critical</p>
                  <p className="text-2xl font-bold text-red-400">{stats.critical}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">High Priority</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.high}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Medium</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.medium}</p>
                </div>
                <Activity className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <AlertFilters 
          currentFilter={filter}
          onFilterChange={setFilter}
          stats={stats}
        />

        {/* Alerts List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading alerts...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No alerts found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <AlertCard 
                key={alert.id} 
                alert={alert} 
                onMarkAsRead={() => markAsRead(alert.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}