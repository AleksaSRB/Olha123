
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Upload, Search, Filter, Grid2x2, LayoutList, TrendingUp, TrendingDown } from "lucide-react";
import { CompanyCard } from "@/components/CompanyCard";
import { DataUploadSheet } from "@/components/DataUploadSheet";
import { AIInsightsPanel } from "@/components/AIInsightsPanel";
import { mockCompanies } from "@/data/mockData";

const Index = () => {
  const [companies, setCompanies] = useState(mockCompanies);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Filter companies based on search and filters
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || company.sector === selectedSector;
    const matchesStage = selectedStage === 'all' || company.stage === selectedStage;
    const matchesRisk = selectedRisk === 'all' || company.riskLevel === selectedRisk;
    
    return matchesSearch && matchesSector && matchesStage && matchesRisk;
  });

  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case 'arr':
        return b.arr - a.arr;
      case 'runway':
        return a.cashRunway - b.cashRunway;
      case 'risk':
        const riskOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      case 'growth':
        return b.arrGrowth - a.arrGrowth;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Portfolio Dashboard</h1>
              <p className="text-muted-foreground">Monitor your portfolio companies' performance</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setIsUploadOpen(true)}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Data
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Q2 2024
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sector" />
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

            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B</SelectItem>
                <SelectItem value="Series C">Series C</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRisk} onValueChange={setSelectedRisk}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="arr">ARR</SelectItem>
                <SelectItem value="runway">Cash Runway</SelectItem>
                <SelectItem value="risk">Risk Level</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid2x2 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{companies.length}</div>
                  <p className="text-sm text-muted-foreground">Total Companies</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {companies.filter(c => c.riskLevel === 'low').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Low Risk</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-amber-600">
                    {companies.filter(c => c.riskLevel === 'medium').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Medium Risk</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {companies.filter(c => c.riskLevel === 'high').length}
                  </div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                </CardContent>
              </Card>
            </div>

            {/* Companies Grid */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {sortedCompanies.map((company) => (
                <CompanyCard 
                  key={company.id} 
                  company={company} 
                  viewMode={viewMode}
                />
              ))}
            </div>

            {sortedCompanies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No companies found matching your filters.</p>
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          <div className="w-80">
            <AIInsightsPanel companies={companies} />
          </div>
        </div>
      </div>

      <DataUploadSheet 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)}
        onDataUpload={(data) => {
          console.log('Data uploaded:', data);
          // Here you would process the uploaded data and update companies
        }}
      />
    </div>
  );
};

export default Index;
