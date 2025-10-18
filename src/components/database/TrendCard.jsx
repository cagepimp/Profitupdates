import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, User, Users } from "lucide-react";

export default function TrendCard({ trend }) {
    const getCategoryColor = (category) => {
        if (!category) return "bg-slate-600";
        const lowerCategory = category.toLowerCase();
        if (lowerCategory.includes("ats") || lowerCategory.includes("spread")) return "bg-sky-600";
        if (lowerCategory.includes("o/u") || lowerCategory.includes("total")) return "bg-amber-600";
        if (lowerCategory.includes("moneyline") || lowerCategory.includes("win")) return "bg-green-600";
        return "bg-purple-600";
    };

    return (
        <Card className="bg-slate-800/50 border-slate-700 flex flex-col h-full hover:border-amber-500/50 transition-all">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-amber-400 text-sm font-medium uppercase tracking-wider">{trend.category || "General Trend"}</CardTitle>
                    {trend.team && (
                        <Badge variant="outline" className="border-slate-600 text-slate-300 flex items-center gap-1">
                            <Users className="w-3 h-3"/>
                            {trend.team}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-slate-200 text-base mb-4 flex-grow">{trend.description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-xl font-bold text-green-400">{trend.record}</span>
                    </div>
                     <Badge className={getCategoryColor(trend.category)}>
                        {trend.category}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}