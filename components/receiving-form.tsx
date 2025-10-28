"use client"

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, ExternalLink, FilePlus, List } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- INTERFACES (No changes to logic) ---
interface ReceivingEntry {
  date: string;
  vendorName: string;
  invoiceAmt: number;
  invoiceNumber: string;
  mode: string;
  remarks: string;
  imageLink?: string;
}

interface AppUser {
  id: string;
  name: string;
  role: "user" | "admin";
}

interface ReceivingDropdownOptions {
  vendorNames: string[];
  modes: string[];
}

interface ReceivingFormProps {
  currentUser: AppUser;
}

interface ReceivingRecord {
  id: string;
  timestamp: string;
  date: string;
  vendorName: string;
  invoiceAmt: number;
  invoiceNumber: string;
  mode: string;
  remarks: string;
  imageLink?: string;
}

// --- CONSTANTS (No changes to logic) ---
const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx5dryxS1R5zp6myFfUlP1QPimufTqh5hcPcFMNcAJ-FiC-hyQL9mCkgHSbLkOiWTibeg/exec";
const GOOGLE_DRIVE_FOLDER_ID = "1khKpwllobekR5yCeDXMUyz-hY_MwFWyv";
const PUBLIC_SHEET_ID_MASTER = "1-NTfh3VGrhEImrxNVSbDdBmFxTESegykHslL-t3Nf8I";
const PUBLIC_SHEET_MASTER_NAME = "Master";
const RECEIVING_DATA_SHEET_NAME = "Reciving";
const VENDOR_COLUMN_INDEX_IN_MASTER_SHEET = 5;
const MODE_COLUMN_INDEX_IN_MASTER_SHEET = 1;

// --- HELPER FUNCTIONS (No changes to logic) ---
const isNonEmptyString = (value: any): value is string => typeof value === "string" && value.trim().length > 0;

const parseSheetTimestamp = (tsStr: string): Date | null => {
  if (!tsStr) return null;
  const date = new Date(tsStr);
  if (!isNaN(date.getTime())) return date;
  const match = tsStr.match(/Date\((\d+),(\d+),(\d+),(\d+),(\d+),(\d+)\)/);
  if (match) {
    const [_, y, m, d, h, min, s] = match.map(Number);
    return new Date(y, m, d, h, min, s);
  }
  return null;
};

const formatEntryDate = (dateStr: string): string => {
    if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === "") return "N/A";
    let date: Date | null = null;
    const gvizDateMatch = dateStr.match(/Date\((\d+),(\d+),(\d+)/);
    if (gvizDateMatch) {
        const [, year, month, day] = gvizDateMatch.map(Number);
        date = new Date(Date.UTC(year, month, day));
    } else {
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
            date = new Date(parsedDate.getTime() + parsedDate.getTimezoneOffset() * 60000);
        }
    }
    if (!date) return "Invalid Date";
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: 'UTC' }).format(date);
};

const formatDisplayTimestamp = (tsStr: string): string => {
  const dateObj = parseSheetTimestamp(tsStr);
  if (!dateObj) return tsStr || "N/A";
  return dateObj.toLocaleString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });
};


// --- ReceivingForm Component (Logic untouched, UI updated) ---
const ReceivingForm: React.FC<ReceivingFormProps> = ({ currentUser }) => {
  const { toast } = useToast();
  // All state management logic is preserved
  const [formData, setFormData] = useState<ReceivingEntry>({
    date: new Date().toISOString().split('T')[0],
    vendorName: '',
    invoiceAmt: 0,
    invoiceNumber: '',
    mode: '',
    remarks: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [dropdownOptions, setDropdownOptions] = useState<ReceivingDropdownOptions>({ vendorNames: [], modes: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [isAddingVendor, setIsAddingVendor] = useState(false);

  // All data fetching and handler functions are preserved exactly as they were.
  const fetchDropdownOptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const masterUrl = `https://docs.google.com/spreadsheets/d/${PUBLIC_SHEET_ID_MASTER}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(PUBLIC_SHEET_MASTER_NAME)}`;
      const masterResponse = await fetch(masterUrl);
      if (!masterResponse.ok) throw new Error(`Failed to fetch master data: ${masterResponse.statusText}`);
      let masterText = await masterResponse.text();
      masterText = masterText.substring(masterText.indexOf("(") + 1, masterText.lastIndexOf(")"));
      const masterJsonData = JSON.parse(masterText);
      const vendorNamesSet = new Set<string>();
      const modesSet = new Set<string>();
      const dataRows = masterJsonData.table.rows.slice(1);
      dataRows.forEach((row: any) => {
        if (row.c?.[VENDOR_COLUMN_INDEX_IN_MASTER_SHEET]?.v != null) vendorNamesSet.add(String(row.c[VENDOR_COLUMN_INDEX_IN_MASTER_SHEET].v).trim());
        if (row.c?.[MODE_COLUMN_INDEX_IN_MASTER_SHEET]?.v != null) modesSet.add(String(row.c[MODE_COLUMN_INDEX_IN_MASTER_SHEET].v).trim());
      });
      setDropdownOptions({
        vendorNames: Array.from(vendorNamesSet).filter(isNonEmptyString),
        modes: Array.from(modesSet).filter(isNonEmptyString),
      });
    } catch (err: any) {
      console.error("Error fetching dropdown data:", err);
      setError(err.message || "An unknown error occurred.");
      toast({ title: "Error", description: "Could not fetch dropdown options.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdownOptions();
  }, []);

  const handleAddNewVendor = async () => {
    if (!newVendorName.trim()) {
      toast({ title: "Error", description: "Vendor name cannot be empty.", variant: "destructive" });
      return;
    }
    setIsAddingVendor(true);
    try {
        const url = `https://docs.google.com/spreadsheets/d/${PUBLIC_SHEET_ID_MASTER}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(PUBLIC_SHEET_MASTER_NAME)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch sheet data: ${response.status}`);
        let text = await response.text();
        text = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"));
        const jsonData = JSON.parse(text);
        if (!jsonData.table?.rows) throw new Error("Sheet data is not in the expected format.");
        const dataRows = jsonData.table.rows;
        let lastRowWithDataInColumn = 1;
        for (let i = 1; i < dataRows.length; i++) {
            if (dataRows[i].c?.[VENDOR_COLUMN_INDEX_IN_MASTER_SHEET]?.v != null && String(dataRows[i].c[VENDOR_COLUMN_INDEX_IN_MASTER_SHEET].v).trim() !== "") {
                lastRowWithDataInColumn = i;
            }
        }
        const targetRowIndex = lastRowWithDataInColumn + 1;
        const targetRowNumber = targetRowIndex + 1;
        let existingRowData: string[] = Array(VENDOR_COLUMN_INDEX_IN_MASTER_SHEET + 1).fill("");
        if (targetRowIndex < dataRows.length && dataRows[targetRowIndex]?.c) {
            for (let i = 0; i < dataRows[targetRowIndex].c.length; i++) {
                existingRowData[i] = dataRows[targetRowIndex].c[i]?.v != null ? String(dataRows[targetRowIndex].c[i].v) : "";
            }
        }
        existingRowData[VENDOR_COLUMN_INDEX_IN_MASTER_SHEET] = newVendorName.trim();
        const requestBody = new URLSearchParams({ action: "update", sheetName: PUBLIC_SHEET_MASTER_NAME, rowIndex: targetRowNumber.toString(), rowData: JSON.stringify(existingRowData) }).toString();
        const updateResponse = await fetch(APP_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: requestBody });
        const result = await updateResponse.json();
        if (result.success) {
            toast({ title: "Success", description: `Vendor "${newVendorName.trim()}" added successfully.` });
            setNewVendorName('');
            setIsVendorModalOpen(false);
            await fetchDropdownOptions();
        } else {
            throw new Error(result.error || `Failed to add vendor.`);
        }
    } catch (err: any) {
        console.error("Error adding vendor:", err);
        toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
        setIsAddingVendor(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof ReceivingEntry, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast({ title: "Submitting Entry...", description: "Please wait.", duration: 900000 });
    try {
        let imageLink = "";
        if (imageFile) {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            imageLink = await new Promise<string>((resolve, reject) => {
                reader.onload = async () => {
                    const base64Data = reader.result?.toString().split(",")[1];
                    if (!base64Data) return reject(new Error("Failed to read image data."));
                    const uploadBody = new URLSearchParams({ action: "uploadFile", fileName: imageFile.name, base64Data, mimeType: imageFile.type, folderId: GOOGLE_DRIVE_FOLDER_ID }).toString();
                    const uploadResponse = await fetch(APP_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: uploadBody });
                    const uploadResult = await uploadResponse.json();
                    if (uploadResult.success) resolve(uploadResult.fileUrl);
                    else reject(new Error(uploadResult.error || "Image upload failed."));
                };
                reader.onerror = (error) => reject(error);
            });
        }
        const formattedTimestamp = new Date().toLocaleString("en-GB").replace(/,/g, "");
        const rowDataArray = [ formattedTimestamp, formData.date, formData.vendorName, Number.parseFloat(String(formData.invoiceAmt)) || 0, formData.invoiceNumber, formData.mode, formData.remarks, imageLink ];
        const submitBody = new URLSearchParams({ action: "insert", sheetName: RECEIVING_DATA_SHEET_NAME, rowData: JSON.stringify(rowDataArray) }).toString();
        const submitResponse = await fetch(APP_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: submitBody });
        const submitResult = await submitResponse.json();
        if (submitResult.success) {
            toast({ title: "Entry Added!", description: "Your receiving entry has been recorded." });
            setFormData({ date: new Date().toISOString().split("T")[0], vendorName: "", invoiceAmt: 0, invoiceNumber: "", mode: "", remarks: "" });
            setImageFile(null);
            setFileInputKey(Date.now());
        } else {
            throw new Error(submitResult.error || "Failed to add entry.");
        }
    } catch (err: any) {
        console.error("Submission error:", err);
        toast({ title: "Submission Failed", description: err.message, variant: "destructive" });
    } finally {
        setIsSubmitting(false);
        loadingToast.dismiss();
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /><p className="ml-3 text-slate-600">Loading Form...</p></div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-700 bg-red-100 rounded-lg"><p className="font-bold">Error loading form</p><p className="text-sm mt-1">{error}</p></div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-1.5">
          <Label className="font-medium text-slate-700">Date</Label>
          <Input type="date" value={formData.date} onChange={handleInputChange} name="date" required />
        </div>
        <div className="space-y-1.5">
          <Label className="font-medium text-slate-700">Vendor Name</Label>
          <div className="flex items-center space-x-2">
            <Select value={formData.vendorName} onValueChange={(value) => handleSelectChange("vendorName", value)}>
              <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
              <SelectContent>{dropdownOptions.vendorNames.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
            <Button type="button" size="icon" variant="outline" onClick={() => setIsVendorModalOpen(true)} className="flex-shrink-0">
              <PlusCircle className="h-4 w-4 text-purple-500" />
            </Button>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="font-medium text-slate-700">Invoice Amount</Label>
          <Input type="number" step="0.01" placeholder="0.00" value={formData.invoiceAmt || ''} onChange={(e) => setFormData(p => ({ ...p, invoiceAmt: parseFloat(e.target.value) || 0 }))} name="invoiceAmt" required />
        </div>
        <div className="space-y-1.5">
          <Label className="font-medium text-slate-700">Invoice Number</Label>
          <Input type="text" placeholder="INV-12345" value={formData.invoiceNumber} onChange={handleInputChange} name="invoiceNumber" required />
        </div>
        <div className="space-y-1.5">
          <Label className="font-medium text-slate-700">Payment Mode</Label>
          <Select value={formData.mode} onValueChange={(value) => handleSelectChange("mode", value)}>
            <SelectTrigger><SelectValue placeholder="Select Mode" /></SelectTrigger>
            <SelectContent>{dropdownOptions.modes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
            <Label className="font-medium text-slate-700">Remarks</Label>
            <Input type="text" placeholder="Optional remarks" value={formData.remarks} onChange={handleInputChange} name="remarks"/>
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label className="font-medium text-slate-700">Attach Image/PDF (Optional)</Label>
          <Input key={fileInputKey} type="file" accept="image/*,application/pdf" onChange={handleImageFileChange} />
        </div>
        <div className="md:col-span-2 pt-2">
          <Button type="submit" className="w-full bg-purple-500 text-white hover:bg-purple-600" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Add Receiving Entry"}
          </Button>
        </div>
      </form>
      <Dialog open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Vendor</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label htmlFor="newVendorName">Vendor Name</Label>
            <Input id="newVendorName" value={newVendorName} onChange={(e) => setNewVendorName(e.target.value)} placeholder="Enter new vendor name" className="mt-1" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVendorModalOpen(false)}>Cancel</Button>
            <Button className="bg-purple-500 text-white hover:bg-purple-600" onClick={handleAddNewVendor} disabled={isAddingVendor}>
              {isAddingVendor && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// --- ReceivingRecords Component (Logic untouched, UI updated) ---
const ReceivingRecords: React.FC = () => {
  const [records, setRecords] = useState<ReceivingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
          const url = `https://docs.google.com/spreadsheets/d/${PUBLIC_SHEET_ID_MASTER}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(RECEIVING_DATA_SHEET_NAME)}`;
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          let text = await response.text();
          text = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"));
          const json = JSON.parse(text);
          if (!json.table?.rows) throw new Error("Invalid data structure from Google Sheets.");
          const parsedRecords: ReceivingRecord[] = json.table.rows.map((row: any, index: number) => ({
              id: `rec-${index}`,
              timestamp: row.c[0]?.v || "",
              date: row.c[1]?.v || "",
              vendorName: row.c[2]?.v || "",
              invoiceAmt: Number.parseFloat(row.c[3]?.v) || 0,
              invoiceNumber: row.c[4]?.v || "",
              mode: row.c[5]?.v || "",
              remarks: row.c[6]?.v || "",
              imageLink: row.c[7]?.v || undefined,
          })).filter((record: ReceivingRecord) => record.timestamp);
          parsedRecords.sort((a, b) => (parseSheetTimestamp(b.timestamp)?.getTime() || 0) - (parseSheetTimestamp(a.timestamp)?.getTime() || 0));
          setRecords(parsedRecords);
      } catch (err: any) {
          console.error("Error fetching records:", err);
          setError(err.message || "An unknown error occurred.");
      } finally {
          setIsLoading(false);
      }
    };
    fetchRecords();
  }, []);
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-10"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /><p className="ml-3 text-slate-600">Loading History...</p></div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-700 bg-red-100 rounded-lg"><p className="font-bold">Failed to load records</p><p className="text-sm mt-1">{error}</p></div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="text-slate-600 font-semibold">Timestamp</TableHead>
            <TableHead className="text-slate-600 font-semibold">Entry Date</TableHead>
            <TableHead className="text-slate-600 font-semibold">Vendor</TableHead>
            <TableHead className="text-slate-600 font-semibold">Invoice #</TableHead>
            <TableHead className="text-slate-600 font-semibold text-right">Amount</TableHead>
            <TableHead className="text-slate-600 font-semibold">Mode</TableHead>
            <TableHead className="text-slate-600 font-semibold">Image</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length > 0 ? (
            records.map((rec) => (
              <TableRow key={rec.id} className="hover:bg-purple-50/60 border-b last:border-b-0 border-slate-100">
                <TableCell className="text-slate-600">{formatDisplayTimestamp(rec.timestamp)}</TableCell>
                <TableCell className="text-slate-600">{formatEntryDate(rec.date)}</TableCell>
                <TableCell className="font-medium text-slate-800">{rec.vendorName}</TableCell>
                <TableCell className="text-slate-600">{rec.invoiceNumber}</TableCell>
                <TableCell className="text-right font-mono text-slate-800">₹{rec.invoiceAmt.toFixed(2)}</TableCell>
                <TableCell className="text-slate-600">{rec.mode}</TableCell>
                <TableCell>
                  {rec.imageLink ? (
                    <a href={rec.imageLink} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-700 inline-block">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-slate-400">--</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan={7} className="text-center h-24 text-slate-500">No records found.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// --- Main Page Component (UI updated) ---
const ReceivingPage: React.FC<ReceivingFormProps> = ({ currentUser }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-white min-h-screen">
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-slate-100">
          <TabsTrigger value="form" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm">
              <FilePlus className="h-4 w-4 mr-2"/>
              Receiving Form
          </TabsTrigger>
          <TabsTrigger value="records" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm">
              <List className="h-4 w-4 mr-2"/>
              Entry Records
          </TabsTrigger>
        </TabsList>
        <TabsContent value="form" className="mt-6">
            <Card className="max-w-4xl mx-auto border-purple-200/80 rounded-xl shadow-sm">
                <CardHeader className="bg-purple-50 border-b border-purple-200/80">
                    <CardTitle className="text-slate-800 flex items-center gap-2.5">
                        <FilePlus className="h-5 w-5 text-purple-500" />
                        Create New Receiving Entry
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <ReceivingForm currentUser={currentUser} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="records" className="mt-6">
             <Card className="border-purple-200/80 rounded-xl shadow-sm">
                <CardHeader className="bg-purple-50 border-b border-purple-200/80">
                    <CardTitle className="text-slate-800 flex items-center gap-2.5">
                        <List className="h-5 w-5 text-purple-500" />
                        Receiving History
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 md:p-2">
                     <ReceivingRecords />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReceivingPage;