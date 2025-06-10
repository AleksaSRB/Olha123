
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, Clock, Brain } from "lucide-react";
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
      icon: AlertTriangle,
      title: 'Cash Runway Alert',
      description: `${lowRunwayCompanies} companies have less than 6 months runway`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      type: 'risk',
      icon: TrendingDown,
      title: 'Performance Risk',
      description: `${negativeGrowthCompanies} companies showing negative ARR growth`,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      type: 'attention',
      icon: Clock,
      title: 'Requires Attention',
      description: `${highRiskCompanies} companies flagged as high risk`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const topPerformers = companies
    .filter(c => c.arrGrowth > 20)
    .sort((a, b) => b.arrGrowth - a.arrGrowth)
    .slice(0, 3);

  const watchlistCompanies = companies
    .filter(c => c.riskLevel === 'high' || c.cashRunway <= 3)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${insight.bgColor} ${insight.borderColor}`}
            >
              <div className="flex items-start gap-2">
                <insight.icon className={`h-4 w-4 mt-0.5 ${insight.color}`} />
                <div>
                  <div className={`font-medium text-sm ${insight.color}`}>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Performers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topPerformers.map((company) => (
            <div key={company.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{company.name}</div>
                <div className="text-xs text-muted-foreground">{company.sector}</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +{company.arrGrowth}%
              </Badge>
            </div>
          ))}
          {topPerformers.length === 0 && (
            <p className="text-sm text-muted-foreground">No companies with >20% growth</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Watchlist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {watchlistCompanies.map((company) => (
            <div key={company.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{company.name}</div>
                <div className="text-xs text-muted-foreground">
                  {company.cashRunway <= 3 ? `${company.cashRunway}m runway` : 'High risk'}
                </div>
              </div>
              <Badge variant="destructive">
                {company.riskLevel.toUpperCase()}
              </Badge>
            </div>
          ))}
          {watchlistCompanies.length === 0 && (
            <p className="text-sm text-muted-foreground">No companies on watchlist</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Portfolio Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total ARR</span>
            <span className="font-medium">
              ${companies.reduce((sum, c) => sum + c.arr, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Avg. Gross Margin</span>
            <span className="font-medium">
              {Math.round(companies.reduce((sum, c) => sum + c.grossMargin, 0) / companies.length)}%
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Headcount</span>
            <span className="font-medium">
              {companies.reduce((sum, c) => sum + c.headcount, 0)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
