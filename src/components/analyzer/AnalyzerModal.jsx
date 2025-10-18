import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AnalyzerModal({ analysis, onClose }) {
  if (!analysis) return null;

  const { home, away, sport, startTime, topProps } = analysis;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-slate-900 border border-slate-700 shadow-xl rounded-2xl p-6 w-full max-w-3xl mx-4 relative max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.9, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {away} @ {home}
              </h2>
              <p className="text-sm text-gray-400">
                {sport} • {startTime ? new Date(startTime).toLocaleString() : 'Time TBD'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
          </div>

          {/* ANALYZER SUMMARY */}
          <div className="bg-slate-800/60 p-4 rounded-xl mb-5 border border-slate-700">
            <p className="text-gray-300 text-sm">
              <span className="font-semibold text-cyan-400">AI Verdict:</span>{" "}
              The <span className="text-emerald-400 font-semibold">Analyzer 10000+</span> has
              identified <span className="font-semibold">{topProps?.length || 0}</span> top
              value opportunities based on sportsbook discrepancies, momentum, and implied
              probability convergence.
            </p>
          </div>

          {/* TOP PROPS LIST */}
          {topProps && topProps.length > 0 ? (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {topProps.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-start bg-slate-800/70 rounded-lg p-3 border border-slate-700 hover:border-cyan-500 transition-all"
                >
                  <div className="flex flex-col text-sm">
                    <span className="text-gray-200 font-medium">{p.entity}</span>
                    <span className="text-gray-400">{p.prop}</span>
                  </div>
                  <div className="text-right text-sm">
                    <span className="text-cyan-400 font-semibold">{p.bestBook}</span>
                    <div className="text-emerald-400 font-semibold">
                      {p.bestAmerican > 0 ? '+' : ''}{p.bestAmerican}
                    </div>
                    <div className="text-xs mt-1">
                      <span
                        className={
                          p.evPercent > 5
                            ? "text-emerald-300"
                            : p.evPercent > 0
                            ? "text-yellow-300"
                            : "text-gray-400"
                        }
                      >
                        {p.evPercent}% EV
                      </span>{" "}
                      |{" "}
                      <span
                        className={
                          p.trend.includes("Value")
                            ? "text-emerald-300"
                            : p.trend.includes("Discrepancy")
                            ? "text-yellow-300"
                            : "text-gray-400"
                        }
                      >
                        {p.trend}
                      </span>
                    </div>
                    {p.edgePercent && (
                      <div className="text-xs text-gray-500 mt-1">
                        Edge: {p.edgePercent}% • {p.confidence} books
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-gray-400 text-lg mb-2">No props available</p>
                <p className="text-gray-500 text-sm">
                  This game may not have props yet, or odds haven't been aggregated.
                </p>
              </div>
            </div>
          )}

          {/* CLOSE BUTTON */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-lg text-white font-semibold transition-all"
            >
              Close Analyzer
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}