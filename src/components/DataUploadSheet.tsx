
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataUploadSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpload: (data: any) => void;
}

export const DataUploadSheet = ({ isOpen, onClose, onDataUpload }: DataUploadSheetProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file processing
    setTimeout(() => {
      toast({
        title: "Data uploaded successfully",
        description: "Portfolio data has been updated.",
      });
      onDataUpload({ fileName: file.name });
      setIsUploading(false);
      setFile(null);
      onClose();
    }, 2000);
  };

  const downloadTemplate = () => {
    // Create CSV template
    const template = `Company Name,Quarter,ARR,Gross Margin,Monthly Cash Burn,Cash Runway,Headcount,Sector,Stage,Partner
AlphaTech,Q2 2024,33136312,80.4,3253882,11,85,Healthcare,Series B,John Smith
BrightLogix,Q2 2024,9606675,45.4,3095505,9,42,FinTech,Series A,Jane Doe`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio_data_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Upload Portfolio Data</SheetTitle>
          <SheetDescription>
            Upload a CSV file to update your portfolio company data.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Template Download */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">CSV Template</CardTitle>
              <CardDescription>
                Download the template to see the required format for your data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={downloadTemplate} className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upload Data</CardTitle>
              <CardDescription>
                Select a CSV file with your portfolio company data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="csv-file">CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>

              {file && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">{file.name}</span>
                </div>
              )}

              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload Data'}
              </Button>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• File must be in CSV format</li>
                <li>• Required columns: Company Name, Quarter, ARR, Gross Margin, Monthly Cash Burn, Cash Runway, Headcount</li>
                <li>• Optional columns: Sector, Stage, Partner</li>
                <li>• ARR should be in USD (numeric)</li>
                <li>• Gross Margin should be percentage (0-100)</li>
                <li>• Cash Runway should be in months</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
