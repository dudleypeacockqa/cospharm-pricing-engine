import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: uploadHistory, isLoading } = trpc.bulkUpload.history.useQuery();
  const processBulkUpload = trpc.bulkUpload.process.useMutation({
    onSuccess: (result) => {
      toast({
        title: "Upload Complete",
        description: `Processed ${result.recordsProcessed} records. Updated: ${result.recordsUpdated}, Failed: ${result.recordsFailed}`,
      });
      setFile(null);
      setIsUploading(false);
      trpc.useUtils().bulkUpload.history.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension !== 'xlsx' && fileExtension !== 'xls' && fileExtension !== 'csv') {
        toast({
          title: "Invalid File Type",
          description: "Please upload an Excel (.xlsx, .xls) or CSV file.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Read file content
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      
      processBulkUpload.mutate({
        fileName: file.name,
        fileContent: content,
      });
    };
    
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    // Create CSV template
    const template = `Product ID,Product Name,Base Price,Product Discount,Bonus Pattern
PROD001,Example Product 1,100.00,5.00,
PROD002,Example Product 2,250.00,10.00,1@40%
PROD003,Example Product 3,75.50,0.00,`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_price_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Price Upload</h1>
        <p className="text-gray-600 mt-1">Import product prices from Excel or CSV files</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Price File
            </CardTitle>
            <CardDescription>
              Upload an Excel or CSV file with product pricing updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                {file && (
                  <p className="text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
              
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]"
              >
                {isUploading ? "Processing..." : "Upload and Process"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              File Format
            </CardTitle>
            <CardDescription>
              Required columns for bulk price upload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="font-semibold">Required Columns:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li><strong>Product ID</strong> - Unique product identifier</li>
                  <li><strong>Product Name</strong> - Product name (optional, for reference)</li>
                  <li><strong>Base Price</strong> - New base price (numeric)</li>
                  <li><strong>Product Discount</strong> - Discount percentage (numeric)</li>
                  <li><strong>Bonus Pattern</strong> - Bonus pattern (optional, e.g., "1@40%")</li>
                </ul>
              </div>
              
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Template
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>
            Recent bulk price upload operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadHistory && uploadHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead className="text-center">Processed</TableHead>
                  <TableHead className="text-center">Updated</TableHead>
                  <TableHead className="text-center">Failed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploadHistory.map((upload: any) => (
                  <TableRow key={upload.id}>
                    <TableCell className="text-sm">
                      {new Date(upload.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{upload.fileName}</TableCell>
                    <TableCell className="text-center">{upload.recordsProcessed}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        {upload.recordsUpdated}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {upload.recordsFailed > 0 ? (
                        <span className="inline-flex items-center gap-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          {upload.recordsFailed}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {upload.recordsFailed === 0 ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          Success
                        </span>
                      ) : upload.recordsFailed === upload.recordsProcessed ? (
                        <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                          <XCircle className="h-4 w-4" />
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          Partial
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-600">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No upload history yet</p>
              <p className="text-sm">Upload your first price file to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

