import React from 'react';
import { motion } from "framer-motion";
import { Button } from "../restaurant-setup/ui/button";
import { X } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface LocationInsightsProps {
  insights: string;
  onClose: () => void;
}

export const LocationInsights: React.FC<LocationInsightsProps> = ({
  insights,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
      >
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg">Location Intelligence Insights</h1>
              <p className="text-blue-100 text-xs">
                AI-generated analysis and recommendations
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-emerald max-w-none">
            <ReactMarkdown>{insights}</ReactMarkdown>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              // Create a Blob from the insights text
              const blob = new Blob([insights], { type: 'text/markdown' });
              // Create a URL for the Blob
              const url = URL.createObjectURL(blob);
              // Create a temporary anchor element
              const a = document.createElement('a');
              a.href = url;
              a.download = 'location-insights.md';
              // Trigger the download
              document.body.appendChild(a);
              a.click();
              // Clean up
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Download as Markdown
          </Button>
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
          >
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
