import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Account Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="w-5 h-5 text-cyan-400" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="bg-slate-800 border-slate-700 text-white mt-1" />
            </div>
            <div>
              <Label htmlFor="name" className="text-slate-300">Display Name</Label>
              <Input id="name" placeholder="Your name" className="bg-slate-800 border-slate-700 text-white mt-1" />
            </div>
            <Button className="bg-cyan-600 hover:bg-cyan-700">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="w-5 h-5 text-cyan-400" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Live Game Alerts</p>
                <p className="text-slate-400 text-sm">Get notified when games go live</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Algorithm Signals</p>
                <p className="text-slate-400 text-sm">Receive high-confidence betting signals</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Line Movement Alerts</p>
                <p className="text-slate-400 text-sm">Track significant odds changes</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-cyan-400" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-slate-400 text-sm">Add an extra layer of security</p>
              </div>
              <Button variant="outline" className="border-slate-700">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Activity Tracking</p>
                <p className="text-slate-400 text-sm">Allow analytics for better insights</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="w-5 h-5 text-cyan-400" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800">
              Export Betting History
            </Button>
            <Button variant="outline" className="w-full border-red-700 text-red-400 hover:bg-red-950">
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}