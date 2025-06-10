
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, Clock, Brain, Sparkles, Zap } from "lucide-react";
import { Company } from "@/types/company";

interface AIInsightsPanelProps {
  companies: Company[];
}

export const AIInsightsPanel = ({ companies }: AIInsightsPanelProps) => {
  const highRiskCompanies = companies.filter(c => c.riskLevel === 'high').length;
  const lowRunwayCompanies = companies.filter(c => c.cashRunway <= 6).length;
  const negativeGrowthCompanies = companies.filter(c => c.arrGrowth < 0).length;

  const insights = [
    {
      type: 'warning',
      icon: Clock,
      title: 'Cash Runway Alert',
      description: `${lowRunwayCompanies} companies have less than 6 months runway`,
      color: 'text-amber-400',
      bgColor: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
      borderColor: 'border-amber-500/20',
      iconBg: 'bg-amber-500/20'
    },
    {
      type: 'risk',
      icon: TrendingDown,
      title: 'Performance Risk',
      description: `${negativeGrowthCompanies} companies showing negative ARR growth`,
      color: 'text-red-400',
      bgColor: 'bg-gradient-to-r from-red-500/10 to-pink-500/10',
      borderColor: 'border-red-500/20',
      iconBg: 'bg-red-500/20'
    },
    {
      type: 'attention',
      icon: AlertTriangle,
      title: 'Requires Attention',
      description: `${highRiskCompanies} companies flagged as high risk`,
      color: 'text-orange-400',
      bgColor: 'bg-gradient-to-r from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/20',
      iconBg: 'bg-orange-500/20'
    }
  ];

  const topPerformers = companies
    .filter(c => c.arrGrowth > 50)
    .sort((a, b) => b.arrGrowth - a.arrGrowth)
    .slice(0, 3);

  const watchlistCompanies = companies
    .filter(c => c.riskLevel === 'high' || c.cashRunway <= 6)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            AI Insights
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border backdrop-blur-sm ${insight.bgColor} ${insight.borderColor} hover:scale-105 transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${insight.iconBg}`}>
                  <insight.icon className={`h-4 w-4 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${insight.color}`}>
                    {insight.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {insight.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-green-500/20">
              <Zap className="h-4 w-4 text-green-400" />
            </div>
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topPerformers.map((company, index) => (
            <div key={company.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{company.name}</div>
                  <div className="text-xs text-muted-foreground">{company.sector}</div>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                +{company.arrGrowth}%
              </Badge>
            </div>
          ))}
          {topPerformers.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No companies with greater than 50% growth</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/20">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
            Watchlist
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {watchlistCompanies.map((company) => (
            <div key={company.id} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
              <div>
                <div className="font-medium text-sm">{company.name}</div>
                <div className="text-xs text-muted-foreground">
                  {company.cashRunway <= 6 ? `${company.cashRunway}m runway` : 'High risk'}
                </div>
              </div>
              <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                {company.riskLevel.toUpperCase()}
              </Badge>
            </div>
          ))}
          {watchlistCompanies.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No companies on watchlist</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-base">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center p-2 rounded-lg bg-blue-500/10">
            <span className="text-sm font-medium">Total ARR</span>
            <span className="font-bold text-blue-400">
              ${companies.reduce((sum, c) => sum + c.arr, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 rounded-lg bg-purple-500/10">
            <span className="text-sm font-medium">Avg. Gross Margin</span>
            <span className="font-bold text-purple-400">
              {Math.round(companies.reduce((sum, c) => sum + c.grossMargin, 0) / companies.length)}%
            </span>
          </div>
          <div className="flex justify-between items-center p-2 rounded-lg bg-green-500/10">
            <span className="text-sm font-medium">Total Headcount</span>
            <span className="font-bold text-green-400">
              {companies.reduce((sum, c) => sum + c.headcount, 0)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
