import { useState } from "react";
import { Card } from "../restaurant-setup/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../restaurant-setup/components/ui/tabs";
import { MarketAnalysis } from "../restaurant-setup/restaurant/MarketAnalysis";
import { CompetitorAnalysis } from "../restaurant-setup/restaurant/CompetitorAnalysis";
import { LocationAnalysis } from "../restaurant-setup/restaurant/LocationAnalysis";
import { MenuAnalysis } from "../restaurant-setup/restaurant/MenuAnalysis";
import { CustomerInsights } from "../restaurant-setup/restaurant/CustomerInsights";
import { FinancialMetrics } from "../restaurant-setup/restaurant/FinancialMetrics";

export function RestaurantDashboard() {
  const [activeTab, setActiveTab] = useState("market");

  return (
    <div className="flex h-full w-full flex-col bg-background p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Restaurant Research Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis and insights for your restaurant business
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="menu">Menu & Pricing</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="financial">Financial Metrics</TabsTrigger>
        </TabsList>

        <div className="mt-4 flex-1 overflow-auto">
          <TabsContent value="market" className="h-full">
            <MarketAnalysis />
          </TabsContent>
          <TabsContent value="competitors" className="h-full">
            <CompetitorAnalysis />
          </TabsContent>
          <TabsContent value="location" className="h-full">
            <LocationAnalysis />
          </TabsContent>
          <TabsContent value="menu" className="h-full">
            <MenuAnalysis />
          </TabsContent>
          <TabsContent value="customers" className="h-full">
            <CustomerInsights />
          </TabsContent>
          <TabsContent value="financial" className="h-full">
            <FinancialMetrics />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 