
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Company } from "@/types/company";
import { useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, BarChart3, PieChart as PieChartIcon, Activity } from "lucide-react";

interface AnalyticsSectionProps {
  companies: Company[];
}

const MODERN_COLORS = {
  primary: "#8B5CF6",
  secondary: "#06B6D4", 
  accent: "#F59E0B",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
  purple: "#A855F7",
  pink: "#EC4899",
  indigo: "#6366F1"
};

const RISK_COLORS = {
  low: MODERN_COLORS.success,
  medium: MODERN_COLORS.warning, 
  high: MODERN_COLORS.danger
};

const SECTOR_COLORS = {
  "Healthcare": MODERN_COLORS.purple,
  "FinTech": MODERN_COLORS.secondary,
  "AI/ML": MODERN_COLORS.accent,
  "SaaS": MODERN_COLORS.success,
  "IoT": MODERN_COLORS.info
};

export const AnalyticsSection = ({ companies }: AnalyticsSectionProps) => {
  const [trendFilter, setTrendFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');

  // Enhanced historical data with more realistic growth patterns
  const generateHistoricalData = () => {
    const quarters = ['Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024'];
    return quarters.map((quarter, index) => {
      const baseGrowth = 1 + (index * 0.15);
      const totalArr = companies.reduce((sum, c) => sum + c.arr * baseGrowth, 0);
      const avgMargin = companies.reduce((sum, c) => sum + c.grossMargin, 0) / companies.length;
      const totalHeadcount = companies.reduce((sum, c) => sum + c.headcount * (1 + index * 0.1), 0);
      return {
        quarter,
        totalArr: Math.round(totalArr),
        avgMargin: Math.round(avgMargin * (0.95 + index * 0.02)),
        totalHeadcount: Math.round(totalHeadcount)
      };
    });
  };

  const historicalData = generateHistoricalData();

  // Risk distribution data
  const riskData = [
    { name: 'Low Risk', value: companies.filter(c => c.riskLevel === 'low').length, color: RISK_COLORS.low },
    { name: 'Medium Risk', value: companies.filter(c => c.riskLevel === 'medium').length, color: RISK_COLORS.medium },
    { name: 'High Risk', value: companies.filter(c => c.riskLevel === 'high').length, color: RISK_COLORS.high }
  ];

  // Sector distribution data
  const sectorData = Object.entries(
    companies.reduce((acc, company) => {
      acc[company.sector] = (acc[company.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([sector, count]) => ({
    name: sector,
    value: count,
    color: SECTOR_COLORS[sector as keyof typeof SECTOR_COLORS] || MODERN_COLORS.indigo
  }));

  // Stage distribution data
  const stageData = Object.entries(
    companies.reduce((acc, company) => {
      acc[company.stage] = (acc[company.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([stage, count], index) => ({ 
    name: stage, 
    value: count,
    color: Object.values(MODERN_COLORS)[index % Object.values(MODERN_COLORS).length]
  }));

  // Top performers by ARR Growth
  const topArrGrowth = companies
    .sort((a, b) => b.arrGrowth - a.arrGrowth)
    .slice(0, 6)
    .map(c => ({ name: c.name, growth: c.arrGrowth, sector: c.sector }));

  // Top performers by Gross Margin
  const topMargin = companies
    .sort((a, b) => b.grossMargin - a.grossMargin)
    .slice(0, 6)
    .map(c => ({ name: c.name, margin: c.grossMargin, sector: c.sector }));

  // Negative growth companies
  const negativeGrowthCompanies = companies
    .filter(c => c.arrGrowth < 0)
    .sort((a, b) => a.arrGrowth - b.arrGrowth);

  // Enhanced scatter data
  const scatterData = companies.map(c => ({
    name: c.name,
    burnRate: Math.round(c.arr / 12 / c.cashRunway),
    runway: c.cashRunway,
    risk: c.riskLevel,
    arr: c.arr,
    growth: c.arrGrowth
  }));

  // Cash runway distribution
  const runwayDistribution = companies.map(c => ({
    name: c.name.split(' ')[0], // Shortened names for better display
    runway: c.cashRunway,
    risk: c.riskLevel,
    fill: RISK_COLORS[c.riskLevel]
  })).sort((a, b) => a.runway - b.runway);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="trends" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Activity className="w-4 h-4 mr-2" />
            Trends & Performance
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Risk & Health
          </TabsTrigger>
          <TabsTrigger value="performers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="w-4 h-4 mr-2" />
            Top Performers
          </TabsTrigger>
          <TabsTrigger value="composition" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <PieChartIcon className="w-4 h-4 mr-2" />
            Portfolio Composition
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="flex gap-4 mb-4">
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="FinTech">FinTech</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="IoT">IoT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  ARR Growth Trajectory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalArr: { label: "Total ARR", color: MODERN_COLORS.primary }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="colorArr" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={MODERN_COLORS.primary} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={MODERN_COLORS.primary} stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, "Total ARR"]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="totalArr" 
                        stroke={MODERN_COLORS.primary}
                        strokeWidth={3}
                        fill="url(#colorArr)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Gross Margin Evolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    avgMargin: { label: "Avg Margin", color: MODERN_COLORS.success }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(value) => `${value}%`} stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${value}%`, "Avg Margin"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avgMargin" 
                        stroke={MODERN_COLORS.success}
                        strokeWidth={4}
                        dot={{ fill: MODERN_COLORS.success, strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, stroke: MODERN_COLORS.success, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Cash Runway Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    runway: { label: "Cash Runway", color: MODERN_COLORS.info }
                  }}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={runwayDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(value) => `${value}m`} stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${value} months`, "Cash Runway"]}
                      />
                      <Bar dataKey="runway" radius={[4, 4, 0, 0]}>
                        {runwayDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    low: { label: "Low Risk", color: RISK_COLORS.low },
                    medium: { label: "Medium Risk", color: RISK_COLORS.medium },
                    high: { label: "High Risk", color: RISK_COLORS.high }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Burn Rate vs Cash Runway
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    scatter: { label: "Companies", color: MODERN_COLORS.purple }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={scatterData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="burnRate" 
                        name="Monthly Burn Rate"
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis 
                        dataKey="runway" 
                        name="Cash Runway"
                        tickFormatter={(value) => `${value}m`}
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value, name) => [
                          name === "burnRate" ? `$${(Number(value) / 1000).toFixed(0)}K` : `${value} months`,
                          name === "burnRate" ? "Monthly Burn" : "Cash Runway"
                        ]}
                      />
                      <Scatter dataKey="burnRate" fill={MODERN_COLORS.purple} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Top ARR Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    growth: { label: "ARR Growth", color: MODERN_COLORS.success }
                  }}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topArrGrowth} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tickFormatter={(value) => `${value}%`} stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${value}%`, "ARR Growth"]}
                      />
                      <Bar dataKey="growth" fill={MODERN_COLORS.success} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Top Gross Margin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    margin: { label: "Gross Margin", color: MODERN_COLORS.info }
                  }}
                  className="h-[350px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topMargin} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tickFormatter={(value) => `${value}%`} stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="name" type="category" width={120} stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${value}%`, "Gross Margin"]}
                      />
                      <Bar dataKey="margin" fill={MODERN_COLORS.info} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-gradient-to-br from-red-500/5 to-pink-500/5 border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Companies with Negative ARR Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {negativeGrowthCompanies.map((company) => (
                    <div key={company.id} className="flex items-center justify-between p-4 border rounded-xl bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/20">
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-sm text-muted-foreground">{company.sector} • {company.stage}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                          {company.arrGrowth}%
                        </Badge>
                        {company.aiAlert && (
                          <div className="flex items-center gap-1 text-amber-400">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-xs">{company.aiAlert}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {negativeGrowthCompanies.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">🎉 No companies with negative ARR growth</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="composition" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-indigo-500" />
                  Sector Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={Object.fromEntries(
                    Object.entries(SECTOR_COLORS).map(([key, value]) => [
                      key, { label: key, color: value }
                    ])
                  )}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sectorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border-yellow-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-yellow-600" />
                  Stage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Companies", color: MODERN_COLORS.accent }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stageData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {stageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-gradient-to-br from-teal-500/5 to-green-500/5 border-teal-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-500" />
                  Team Growth Trajectory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalHeadcount: { label: "Total Headcount", color: MODERN_COLORS.secondary }
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="colorHeadcount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={MODERN_COLORS.secondary} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={MODERN_COLORS.secondary} stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="quarter" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [Math.round(Number(value)), "Total Headcount"]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="totalHeadcount" 
                        stroke={MODERN_COLORS.secondary}
                        strokeWidth={3}
                        fill="url(#colorHeadcount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
