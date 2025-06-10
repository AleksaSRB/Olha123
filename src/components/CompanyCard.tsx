
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Users, DollarSign, Calendar } from "lucide-react";
import { Company } from "@/types/company";

interface CompanyCardProps {
  company: Company;
  viewMode: 'grid' | 'table';
}

export const CompanyCard = ({ company, viewMode }: CompanyCardProps) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRunwayColor = (months: number) => {
    if (months <= 3) return 'text-red-600';
    if (months <= 6) return 'text-amber-600';
    return 'text-green-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (viewMode === 'table') {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="font-bold text-primary text-lg">
                  {company.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{company.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{company.sector}</span>
                  <span>•</span>
                  <span>{company.stage}</span>
                  <span>•</span>
                  <span>{company.partner}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="font-semibold">{formatCurrency(company.arr)}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  {company.arrGrowth > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={company.arrGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                    {company.arrGrowth > 0 ? '+' : ''}{company.arrGrowth}%
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold">{company.grossMargin}%</div>
                <div className="text-sm text-muted-foreground">Gross Margin</div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold">{company.headcount}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <span className={company.headcountChange > 0 ? 'text-green-600' : 'text-red-600'}>
                    {company.headcountChange > 0 ? '+' : ''}{company.headcountChange}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div className={`font-semibold ${getRunwayColor(company.cashRunway)}`}>
                  {company.cashRunway}m
                </div>
                <div className="text-sm text-muted-foreground">Cash Runway</div>
              </div>
              
              <Badge className={getRiskColor(company.riskLevel)}>
                {company.riskLevel.toUpperCase()}
              </Badge>
              
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
          
          {company.aiAlert && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-800">{company.aiAlert}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary text-lg">
                {company.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-none">{company.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{company.sector}</p>
            </div>
          </div>
          <Badge className={getRiskColor(company.riskLevel)}>
            {company.riskLevel.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{company.stage}</span>
          <span>•</span>
          <span>{company.partner}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* ARR */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">ARR</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{formatCurrency(company.arr)}</div>
              <div className="text-sm flex items-center gap-1">
                {company.arrGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={company.arrGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                  {company.arrGrowth > 0 ? '+' : ''}{company.arrGrowth}%
                </span>
              </div>
            </div>
          </div>

          {/* Gross Margin */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Gross Margin</span>
            <span className="font-semibold">{company.grossMargin}%</span>
          </div>

          {/* Headcount */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Headcount</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{company.headcount}</div>
              <div className="text-sm">
                <span className={company.headcountChange > 0 ? 'text-green-600' : 'text-red-600'}>
                  {company.headcountChange > 0 ? '+' : ''}{company.headcountChange}
                </span>
              </div>
            </div>
          </div>

          {/* Cash Runway */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Cash Runway</span>
            </div>
            <span className={`font-semibold ${getRunwayColor(company.cashRunway)}`}>
              {company.cashRunway} months
            </span>
          </div>

          {/* AI Alert */}
          {company.aiAlert && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-xs text-amber-800">{company.aiAlert}</span>
            </div>
          )}

          <Button variant="outline" className="w-full mt-4">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
