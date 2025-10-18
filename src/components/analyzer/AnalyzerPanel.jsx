import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { analyzer } from "@/api/functions";

export default function AnalyzerPanel({ sport = "NFL" }) {
  const [loading, setLoading] = useState(true);
  const [teamProps, setTeamProps] = useState([]);
  const [playerProps, setPlayerProps] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await analyzer({ sport });
        if (!mounted) return;
        if (!data?.success) throw new Error(data?.message || "Analyzer failed");
        setTeamProps(data.teamProps || []);
        setPlayerProps(data.playerProps || []);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [sport]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-36 text-gray-300">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Running Slate Analysis…
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-amber-400 text-sm">Analyzer unavailable right now.</p>;
  }

  if (teamProps.length === 0 && playerProps.length === 0) {
    return <p className="text-center text-slate-400 text-sm">No comparable props found in the cache for this sport.</p>;
  }

  const RenderProp = (p, idx) => (
    <Card key={idx} className="bg-slate-800 border-slate-700 rounded-lg">
      <CardHeader className="px-4 pt-3 pb-2">
        <div className="text-white text-xs font-semibold truncate">{p.name}</div>
      </CardHeader>
      <CardContent className="px-4 pb-3 space-y-1 text-xs">
        <div className="flex justify-between text-slate-400">
            <span>DK:</span> <span>{p.dkOdds > 0 ? `+${p.dkOdds}` : p.dkOdds}</span>
        </div>
        <div className="flex justify-between text-slate-400">
            <span>FD:</span> <span>{p.fdOdds > 0 ? `+${p.fdOdds}` : p.fdOdds}</span>
        </div>
        <div className="pt-1">
            <div className="text-emerald-400 font-bold text-sm">{p.edge}% edge</div>
            <div className="text-blue-400 text-xs">Conf: {p.confidence}%</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {teamProps.length > 0 && (
        <div>
          <h3 className="text-slate-200 text-base font-semibold mb-3">Top 10 Team Props</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {teamProps.map(RenderProp)}
          </div>
        </div>
      )}
      {playerProps.length > 0 && (
        <div>
          <h3 className="text-slate-200 text-base font-semibold mb-3">Top 10 Player Props</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {playerProps.map(RenderProp)}
          </div>
        </div>
      )}
    </div>
  );
}