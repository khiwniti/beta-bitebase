"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@bitebase/ui"
import { Button } from "@bitebase/ui"
import { ReportViewer } from "@bitebase/ui"
import { ChartContainer } from "@bitebase/ui"
import { MetricCard } from "@bitebase/ui"
import { MainLayout } from "../../components/layout/MainLayout"

// Mock report data
const mockReport = {
  title: "Upper East Side Market Analysis Report",
  generatedAt: new Date(),
  sections: [
    {
      id: "executive-summary",
      title: "Executive Summary",
      content: "This comprehensive market analysis reveals significant opportunities for restaurant expansion in the Upper East Side. The area demonstrates strong demographic alignment with target customer profiles and shows moderate competition levels, creating favorable conditions for new restaurant ventures.",
      metrics: [
        { label: "Market Opportunity Score", value: "8.5/10" },
        { label: "Competition Level", value: "Medium" },
        { label: "Target Demographics", value: "85% Match" },
        { label: "Revenue Potential", value: "$2.4M" },
      ],
    },
    {
      id: "market-overview",
      title: "Market Overview",
      content: "The Upper East Side restaurant market is characterized by high-income demographics, strong foot traffic, and diverse dining preferences. Current market saturation is moderate, with particular gaps in Mediterranean and healthy fast-casual segments.",
      metrics: [
        { label: "Total Restaurants", value: "247" },
        { label: "Average Rating", value: "4.2/5" },
        { label: "Price Range", value: "$25-45" },
        { label: "Foot Traffic", value: "15.2K/day" },
      ],
    },
    {
      id: "competition-analysis",
      title: "Competition Analysis",
      content: "Competitive landscape analysis reveals moderate competition density with opportunities for differentiation. Italian and American cuisine dominate the market, while Mediterranean and Asian fusion show underrepresentation relative to demographic demand.",
      metrics: [
        { label: "Direct Competitors", value: "12" },
        { label: "Indirect Competitors", value: "35" },
        { label: "Market Share Available", value: "18%" },
        { label: "Differentiation Opportunity", value: "High" },
      ],
    },
    {
      id: "recommendations",
      title: "Strategic Recommendations",
      content: "Based on comprehensive analysis, we recommend targeting the Mediterranean cuisine segment with a focus on healthy, premium offerings. Optimal location identified at the intersection of Lexington Avenue and 77th Street, with projected ROI of 24% within 18 months.",
      metrics: [
        { label: "Recommended Investment", value: "$850K" },
        { label: "Projected ROI", value: "24%" },
        { label: "Break-even Timeline", value: "14 months" },
        { label: "Success Probability", value: "87%" },
      ],
    },
  ],
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = React.useState<string | null>("current")

  const handleExport = (format: "pdf" | "excel") => {
    // Mock export functionality
    console.log(`Exporting report in ${format} format`)
  }

  return (
    <MainLayout
      pageTitle="Reports"
      pageDescription="Generate and view comprehensive market analysis reports"
      showWelcomeBanner={false}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" className="btn-secondary">
            <span className="mr-2">📋</span>
            Report Templates
          </Button>
          <Button className="btn-primary">
            <span className="mr-2">➕</span>
            Generate New Report
          </Button>
        </div>

      {/* Report Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Select a report to view or generate a new analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                id: "current",
                title: "Upper East Side Analysis",
                description: "Comprehensive market analysis for restaurant opportunity",
                date: "Today",
                status: "completed",
              },
              {
                id: "midtown",
                title: "Midtown Competition Report",
                description: "Competitive landscape analysis for fast-casual segment",
                date: "Yesterday",
                status: "completed",
              },
              {
                id: "brooklyn",
                title: "Brooklyn Demographic Study",
                description: "Demographic trends analysis for organic food market",
                date: "2 days ago",
                status: "in-progress",
              },
            ].map((report) => (
              <Card
                key={report.id}
                className={`cursor-pointer transition-colors ${
                  selectedReport === report.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <div className={`w-2 h-2 rounded-full ${
                      report.status === "completed" ? "status-active" : "status-secondary"
                    }`}></div>
                  </div>
                  <CardDescription className="text-sm">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">{report.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Viewer */}
      {selectedReport === "current" && (
        <ReportViewer
          title={mockReport.title}
          sections={mockReport.sections}
          generatedAt={mockReport.generatedAt}
          onExport={handleExport}
        />
      )}

      {selectedReport === "midtown" && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Midtown Competition Report</h3>
            <p className="text-muted-foreground mb-4">
              This report is being generated. Please check back in a few minutes.
            </p>
            <Button variant="outline">
              View Progress
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedReport === "brooklyn" && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-lg font-semibold mb-2">Brooklyn Demographic Study</h3>
            <p className="text-muted-foreground mb-4">
              Analysis in progress. Estimated completion: 2 hours
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="progress-bar-primary" style={{ width: "65%" }}></div>
            </div>
            <Button variant="outline">
              Cancel Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
          <CardDescription>
            Quick-start templates for common analysis types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Market Analysis",
                description: "Comprehensive market opportunity assessment",
                icon: "🗺️",
              },
              {
                name: "Competition Report",
                description: "Detailed competitive landscape analysis",
                icon: "⚔️",
              },
              {
                name: "Demographic Study",
                description: "Target demographic analysis and insights",
                icon: "👥",
              },
              {
                name: "Financial Projection",
                description: "Revenue and ROI projections",
                icon: "💰",
              },
            ].map((template) => (
              <Button
                key={template.name}
                variant="outline"
                className="h-20 flex-col"
              >
                <span className="text-2xl mb-2">{template.icon}</span>
                <div className="text-center">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </MainLayout>
  )
}
