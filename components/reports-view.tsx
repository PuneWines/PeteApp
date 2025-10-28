"use client"

import React, { useState, useEffect, useMemo } from "react";
import { Target, CreditCard, Calendar, Users, Loader2, Filter } from "lucide-react";

// --- INTERFACES ---
interface Transaction {
    id: string;
    personName: string;
    userId: string;
    date: string; // Keep as string (YYYY-MM-DD) for simplicity
    incoming: number;
    outgoing: number;
    mode: string;
    groupHead: string;
    reason: string;
}

interface AppUser {
    id: string;
    name: string;
    role: "user" | "admin";
    pages: string[];
}

interface AnalysisData {
    incoming: number;
    outgoing: number;
    count: number;
}

// --- NEW INTERFACES FOR FILTERS ---
interface Filters {
    dateFrom: string;
    dateTo: string;
    personName: string;
    groupHead: string;
    reason: string;
    mode: string;
}

interface DropdownOptions {
    personNames: string[];
    reasons: string[];
    groupHeads: string[];
    modes: string[];
}


// --- UI COMPONENTS (Self-contained & Styled) ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => <div className={`bg-white border border-slate-200/80 rounded-xl shadow-sm flex flex-col ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => <div className={`p-4 border-b border-slate-200/80 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => <h3 className={`text-base font-semibold text-slate-800 flex items-center gap-2.5 ${className}`}>{children}</h3>;
const CardContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => <div className={`p-2 ${className}`}>{children}</div>;

// --- NEW UI COMPONENTS FOR FILTERS (FROM DASHBOARD) ---
const Button = ({ children, onClick, variant = 'default', className = '', disabled }: { children: React.ReactNode, onClick?: () => void, variant?: string, className?: string, disabled?: boolean }) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = variant === 'outline' ? 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50' : 'bg-purple-600 text-white hover:bg-purple-700';
  return <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`} disabled={disabled}>{children}</button>;
};
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${props.className || ''}`} />;
const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => <label {...props} className={`block text-sm font-medium text-slate-700 mb-1 ${props.className || ''}`} />;
const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => <select {...props} className={`w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${props.className || ''}`}>{children}</select>;
const SelectItem = (props: React.OptionHTMLAttributes<HTMLOptionElement>) => <option {...props}>{props.children}</option>;


// --- GOOGLE SHEET CONSTANTS ---
const SHEET_ID = "1-NTfh3VGrhEImrxNVSbDdBmFxTESegykHslL-t3Nf8I";
const DATA_SHEET_NAME = "Data";
const MASTER_SHEET_NAME = "Master"; // NEW

function ReportsView({
  currentUser,
  onDetailClick,
}: {
  currentUser: AppUser
  onDetailClick: (detail: { type: string; value: string; data: Transaction[] }) => void
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW STATE FOR FILTERS ---
  const [filters, setFilters] = useState<Filters>({ dateFrom: '', dateTo: '', personName: 'all', groupHead: 'all', reason: 'all', mode: 'all' });
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({ personNames: [], reasons: [], groupHeads: [], modes: [] });

  useEffect(() => {
    const fetchSheetData = async () => {
        setIsLoading(true);
        setError(null);
        const dataUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(DATA_SHEET_NAME)}`;
        const masterUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(MASTER_SHEET_NAME)}`;
        
        try {
            // Fetch both transactions and master data for dropdowns
            const [dataRes, masterRes] = await Promise.all([
                fetch(dataUrl),
                fetch(masterUrl)
            ]);

            // Process transaction data (existing logic)
            if (!dataRes.ok) throw new Error("Failed to fetch data from Google Sheet. Check sheet permissions.");
            let dataText = await dataRes.text();
            const dataJson = JSON.parse(dataText.substring(dataText.indexOf('(') + 1, dataText.lastIndexOf(')')));
            if (!dataJson.table || !dataJson.table.rows) throw new Error("Invalid data format from Google Sheet.");
            
            const fetchedTransactions: Transaction[] = dataJson.table.rows.map((row: any, index: number) => {
                const dateValue = row.c[2]?.v;
                let parsedDate: Date | null = null;
                if (dateValue) {
                    const match = typeof dateValue === 'string' && dateValue.match(/Date\((\d+),(\d+),(\d+)/);
                    if (match) {
                        parsedDate = new Date(parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10));
                    } else if (!isNaN(new Date(dateValue).getTime())) {
                        parsedDate = new Date(dateValue);
                    }
                }
                return {
                    id: row.c[0]?.v ? `${row.c[0]?.v}-${index}` : `row-${index}`, 
                    date: parsedDate ? parsedDate.toISOString().split('T')[0] : null,
                    personName: row.c[1]?.v || '', 
                    userId: row.c[1]?.v || '',
                    incoming: parseFloat(row.c[3]?.v) || 0,
                    outgoing: parseFloat(row.c[4]?.v) || 0,
                    mode: row.c[5]?.v || '',
                    groupHead: row.c[6]?.v || '',
                    reason: row.c[7]?.v || '',
                }
            }).filter((t: any): t is Transaction => t.date);
            
            setTransactions(fetchedTransactions);

            // Process master data for filters (new logic)
            if (!masterRes.ok) throw new Error("Failed to fetch Master data for filters.");
            let masterText = await masterRes.text();
            const masterJson = JSON.parse(masterText.substring(masterText.indexOf('(') + 1, masterText.lastIndexOf(')')));
            if (!masterJson.table || !masterJson.table.rows) throw new Error("Invalid Master data format.");
            
            const masterRows = masterJson.table.rows.slice(1);
            const personNames = new Set<string>();
            const reasons = new Set<string>();
            const groupHeads = new Set<string>();
            const modes = new Set<string>();

            masterRows.forEach((row: any) => {
                if (row.c[0]?.v) personNames.add(row.c[0].v);
                if (row.c[1]?.v) modes.add(row.c[1].v);
                if (row.c[2]?.v) groupHeads.add(row.c[2].v);
                if (row.c[6]?.v) reasons.add(row.c[6].v);
            });

            setDropdownOptions({
                personNames: Array.from(personNames),
                reasons: Array.from(reasons),
                groupHeads: Array.from(groupHeads),
                modes: Array.from(modes),
            });

        } catch (err: any) {
            setError(err.message);
            console.error("Error fetching or parsing sheet data:", err);
        } finally {
            setIsLoading(false);
        }
    };
    fetchSheetData();
  }, []);

  // UPDATED useMemo to include filtering logic
  const userTransactions = useMemo(() => {
    let baseTransactions = currentUser.role === "admin"
      ? transactions
      : transactions.filter((t) => t.personName === currentUser.name);
    
    // Apply filters
    return baseTransactions.filter(t => {
        if (filters.dateFrom && t.date < filters.dateFrom) return false;
        if (filters.dateTo && t.date > filters.dateTo) return false;
        if (filters.personName !== 'all' && t.personName !== filters.personName) return false;
        if (filters.groupHead !== 'all' && t.groupHead !== filters.groupHead) return false;
        if (filters.mode !== 'all' && t.mode !== filters.mode) return false;
        if (filters.reason !== 'all' && t.reason !== filters.reason) return false;
        return true;
    });

  }, [transactions, currentUser, filters]);

  // --- NEW FILTER HANDLERS ---
  const handleFilterChange = (name: keyof Filters, value: string) => setFilters(prev => ({ ...prev, [name]: value }));
  const clearFilters = () => setFilters({ dateFrom: '', dateTo: '', personName: 'all', groupHead: 'all', reason: 'all', mode: 'all' });


  const useAnalysis = (key: keyof Transaction | 'month') => useMemo(() => {
      return Object.entries(
        userTransactions.reduce((acc, t) => {
            let categoryKey: string;
            if (key === 'month') {
                categoryKey = new Date(t.date).toLocaleDateString("en-US", { year: "numeric", month: "long" });
            } else {
                categoryKey = t[key] as string || (key === 'groupHead' ? 'Uncategorized' : 'Unknown');
            }
          if (!acc[categoryKey]) acc[categoryKey] = { incoming: 0, outgoing: 0, count: 0 };
          acc[categoryKey].incoming += t.incoming;
          acc[categoryKey].outgoing += t.outgoing;
          acc[categoryKey].count++;
          return acc;
        }, {} as Record<string, AnalysisData>)
      );
  }, [userTransactions]);
  
  const groupHeadData = useAnalysis('groupHead');
  const modeData = useAnalysis('mode');
  const monthlyData = useAnalysis('month');
  const personData = useAnalysis('personName');


  const handleClick = (type: string, value: string) => {
    let filteredData: Transaction[] = [];
    switch (type) {
      case "groupHead":
        filteredData = userTransactions.filter((t) => (t.groupHead || "Uncategorized") === value);
        break;
      case "mode":
        filteredData = userTransactions.filter((t) => (t.mode || "Unknown") === value);
        break;
      case "month":
        filteredData = userTransactions.filter(
          (t) => new Date(t.date).toLocaleDateString("en-US", { year: "numeric", month: "long" }) === value
        );
        break;
      case "person":
        filteredData = userTransactions.filter((t) => (t.personName || "Unknown User") === value);
        break;
    }
    onDetailClick({ type, value, data: filteredData });
  };
  
    // --- UPDATED AnalysisCard Component with Purple Theme & Scrolling ---
    const AnalysisCard = ({ title, icon: Icon, data, type }: { title: string, icon: React.ElementType, data: [string, AnalysisData][], type: string }) => (
        <Card>
          <CardHeader className="bg-slate-50/70">
            <CardTitle><Icon className="h-5 w-5 text-purple-600" />{title}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Wrapper for scrollable content */}
            <div className="max-h-[22rem] overflow-y-auto pr-1 space-y-2">
              {data.map(([key, itemData]) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-purple-50/60 hover:border-purple-300 border border-transparent cursor-pointer transition-all duration-200"
                  onClick={() => handleClick(type, key)}
                >
                  <div>
                    <div className="font-semibold text-slate-700">{key}</div>
                    <div className="text-sm text-slate-500">{itemData.count} transactions</div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-green-600 font-medium">+₹{itemData.incoming.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <div className="text-red-600 font-medium">-₹{itemData.outgoing.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );

    const analysisCardsConfig = [
        { title: "Group Head Analysis", icon: Target, data: groupHeadData, type: "groupHead", adminOnly: false },
        { title: "Payment Mode Analysis", icon: CreditCard, data: modeData, type: "mode", adminOnly: false },
        { title: "Monthly Analysis", icon: Calendar, data: monthlyData, type: "month", adminOnly: false },
        { title: "Person-wise Analysis", icon: Users, data: personData, type: "person", adminOnly: true },
    ];

    const visibleCards = analysisCardsConfig.filter(card => !card.adminOnly || currentUser.role === "admin");

  if (isLoading) {
    return <div className="flex justify-center items-center h-96 text-slate-600"><Loader2 className="h-6 w-6 animate-spin" /> <span className="ml-3 text-lg">Loading Reports...</span></div>;
  }

  if (error) {
    return <div className="m-4 text-red-700 bg-red-100 border border-red-400 rounded-lg p-4 text-center font-medium">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50/50 min-h-screen">
       <h1 className="text-2xl font-bold text-slate-800 mb-6">Reports</h1>
       
       {/* --- NEW FILTER CARD --- */}
       <Card className="mb-6">
            <CardHeader className="bg-purple-50/70 border-b border-purple-200/80 !p-4">
                <CardTitle><Filter className="w-5 h-5 text-purple-600" /> Filters</CardTitle>
            </CardHeader>
            <CardContent className="!p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="dateFrom">From Date</Label>
                        <Input id="dateFrom" type="date" value={filters.dateFrom} onChange={e => handleFilterChange('dateFrom', e.target.value)} />
                    </div>
                    <div>
                        <Label htmlFor="dateTo">To Date</Label>
                        <Input id="dateTo" type="date" value={filters.dateTo} onChange={e => handleFilterChange('dateTo', e.target.value)} />
                    </div>
                    {currentUser.role === 'admin' && (
                       <div>
                            <Label>Person Name</Label>
                            <Select value={filters.personName} onChange={e => handleFilterChange('personName', e.target.value)}>
                                <SelectItem value="all">All Persons</SelectItem>
                                {dropdownOptions.personNames.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </Select>
                       </div>
                    )}
                    <div>
                        <Label>Group Head</Label>
                        <Select value={filters.groupHead} onChange={e => handleFilterChange('groupHead', e.target.value)}>
                            <SelectItem value="all">All Groups</SelectItem>
                            {dropdownOptions.groupHeads.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </Select>
                    </div>
                    <div>
                        <Label>Mode</Label>
                        <Select value={filters.mode} onChange={e => handleFilterChange('mode', e.target.value)}>
                            <SelectItem value="all">All Modes</SelectItem>
                            {dropdownOptions.modes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </Select>
                    </div>
                    <div>
                        <Label>Reason</Label>
                        <Select value={filters.reason} onChange={e => handleFilterChange('reason', e.target.value)}>
                            <SelectItem value="all">All Reasons</SelectItem>
                            {dropdownOptions.reasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </Select>
                    </div>
                </div>
                <div className="mt-4">
                    <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
                </div>
            </CardContent>
        </Card>

      {/* --- UPDATED Grid Layout with Odd Item Handling --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleCards.map((card, index) => {
            const isLastItem = index === visibleCards.length - 1;
            const isOddCount = visibleCards.length % 2 !== 0;
            return (
                <div key={card.title} className={isLastItem && isOddCount ? "lg:col-span-2" : ""}>
                    <AnalysisCard {...card} />
                </div>
            )
        })}
      </div>
    </div>
  );
}

export default ReportsView;