"use client"

import React, { useState, useMemo, useEffect } from "react"
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Filter, DollarSign, FileText, TrendingUp, TrendingDown, LayoutDashboard, 
  PieChart as PieChartIcon, Loader2 
} from "lucide-react"

// --- INTERFACES ---
interface Transaction {
    id: string;
    personName: string;
    userId: string;
    date: string;
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

// --- GOOGLE SHEET CONSTANTS ---
const SHEET_ID = "1-NTfh3VGrhEImrxNVSbDdBmFxTESegykHslL-t3Nf8I";
const DATA_SHEET_NAME = "Data";
const MASTER_SHEET_NAME = "Master";

// --- HELPER FUNCTIONS ---
const formatXAxisDate = (tickItem: string): string => {
    if (!tickItem) return '';
    try {
        const date = new Date(tickItem);
        if (isNaN(date.getTime())) return tickItem;
        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    } catch (e) {
        return tickItem;
    }
};

const parseSheetDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    const match = typeof dateValue === 'string' && dateValue.match(/Date\((\d+),(\d+),(\d+)/);
    if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const day = parseInt(match[3], 10);
        return new Date(year, month, day);
    }
    const d = new Date(dateValue);
    if (!isNaN(d.getTime())) return d;
    return null;
}

// --- UI COMPONENTS ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => <div className={`bg-white border border-slate-200/80 rounded-xl shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => <div className={`p-4 border-b border-slate-200/80 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => <h3 className={`text-base font-semibold text-slate-800 flex items-center gap-2 ${className}`}>{children}</h3>;
const CardContent = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => <div className={`p-4 ${className}`}>{children}</div>;
const Button = ({ children, onClick, variant = 'default', className = '', disabled }: { children: React.ReactNode, onClick?: () => void, variant?: string, className?: string, disabled?: boolean }) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = variant === 'outline' ? 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50' : 'bg-purple-600 text-white hover:bg-purple-700';
  return <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`} disabled={disabled}>{children}</button>;
};
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={`w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${props.className || ''}`} />;
const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => <label {...props} className={`block text-sm font-medium text-slate-700 mb-1 ${props.className || ''}`} />;
const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) => <select {...props} className={`w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition ${props.className || ''}`}>{children}</select>;
const SelectItem = (props: React.OptionHTMLAttributes<HTMLOptionElement>) => <option {...props}>{props.children}</option>;
const Badge = ({ children, variant = 'default', className = '' }: { children: React.ReactNode, variant?: string, className?: string }) => {
    const base = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
    const variants: { [key: string]: string } = { default: "bg-purple-100 text-purple-800", secondary: "bg-slate-100 text-slate-700" };
    return <span className={`${base} ${variants[variant]} ${className}`}>{children}</span>
};

// --- DASHBOARD VIEW COMPONENT ---
function DashboardView({ currentUser }: { currentUser: AppUser }) {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [filters, setFilters] = useState<Filters>({ dateFrom: '', dateTo: '', personName: 'all', groupHead: 'all', reason: 'all', mode: 'all' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
        personNames: [],
        reasons: [],
        groupHeads: [],
        modes: [],
    });

    useEffect(() => {
        const fetchSheetData = async () => {
            setIsLoading(true);
            setError(null);
            const dataUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(DATA_SHEET_NAME)}`;
            const masterUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(MASTER_SHEET_NAME)}`;

            try {
                const [dataRes, masterRes] = await Promise.all([
                    fetch(dataUrl),
                    fetch(masterUrl)
                ]);

                if (!dataRes.ok) throw new Error("Failed to fetch transaction data.");
                let dataText = await dataRes.text();
                const dataJson = JSON.parse(dataText.substring(dataText.indexOf('(') + 1, dataText.lastIndexOf(')')));
                if (!dataJson.table || !dataJson.table.rows) throw new Error("Invalid transaction data format.");

                const transactions: Transaction[] = dataJson.table.rows.map((row: any, index: number) => ({
                    id: `${row.c[0]?.v}-${index}`,
                    date: parseSheetDate(row.c[2]?.v)?.toISOString().split('T')[0] || null,
                    personName: row.c[1]?.v || '',
                    userId: row.c[1]?.v || '',
                    incoming: parseFloat(row.c[3]?.v) || 0,
                    outgoing: parseFloat(row.c[4]?.v) || 0,
                    mode: row.c[5]?.v || '',
                    groupHead: row.c[6]?.v || '',
                    reason: row.c[7]?.v || '',
                })).filter((t: any): t is Transaction => t.date);
                
                transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setAllTransactions(transactions);

                if (!masterRes.ok) throw new Error("Failed to fetch Master data.");
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
                console.error("Error fetching sheet data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSheetData();
    }, []);

    const filteredTransactions = useMemo(() => {
        let userVisibleTransactions = currentUser.role === 'admin'
            ? allTransactions
            : allTransactions.filter(t => t.personName === currentUser.name);

        return userVisibleTransactions.filter(t => {
            if (filters.dateFrom && t.date < filters.dateFrom) return false;
            if (filters.dateTo && t.date > filters.dateTo) return false;
            if (filters.personName !== 'all' && t.personName !== filters.personName) return false;
            if (filters.groupHead !== 'all' && t.groupHead !== filters.groupHead) return false;
            if (filters.mode !== 'all' && t.mode !== filters.mode) return false;
            if (filters.reason !== 'all' && t.reason !== filters.reason) return false;
            return true;
        });
    }, [allTransactions, filters, currentUser]);
    
    const totalIncoming = useMemo(() => filteredTransactions.reduce((sum, t) => sum + t.incoming, 0), [filteredTransactions]);
    const totalOutgoing = useMemo(() => filteredTransactions.reduce((sum, t) => sum + t.outgoing, 0), [filteredTransactions]);
    const balance = totalIncoming - totalOutgoing;

    const timeSeriesData = useMemo(() => {
        const dailyData = new Map<string, { date: string, income: number, expense: number }>();
        const sorted = [...filteredTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let cumulativeBalance = 0;
        sorted.forEach(t => {
            const dateKey = t.date;
            if (!dailyData.has(dateKey)) dailyData.set(dateKey, { date: dateKey, income: 0, expense: 0 });
            const entry = dailyData.get(dateKey)!;
            entry.income += t.incoming;
            entry.expense += t.outgoing;
        });
        return Array.from(dailyData.values()).map(d => {
            cumulativeBalance += d.income - d.expense;
            return { ...d, balance: cumulativeBalance };
        });
    }, [filteredTransactions]);

    const expenseByGroupHeadData = useMemo(() => {
        const groupMap = new Map<string, number>();
        filteredTransactions.forEach(t => {
            if (t.outgoing > 0 && t.groupHead) {
                groupMap.set(t.groupHead, (groupMap.get(t.groupHead) || 0) + t.outgoing);
            }
        });
        return Array.from(groupMap.entries()).map(([name, value]) => ({ name, value }));
    }, [filteredTransactions]);

    const recentTransactions = useMemo(() => filteredTransactions.slice(0, 5), [filteredTransactions]);
    const handleFilterChange = (name: keyof Filters, value: string) => setFilters(prev => ({ ...prev, [name]: value }));
    const clearFilters = () => setFilters({ dateFrom: '', dateTo: '', personName: 'all', groupHead: 'all', reason: 'all', mode: 'all' });

    const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];
    const getPieColor = (index: number) => PIE_COLORS[index % PIE_COLORS.length];

    if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /> <span className="ml-4 text-lg text-slate-600">Loading Dashboard...</span></div>;
    if (error) return <div className="p-4 text-center text-red-600 bg-red-100 border border-red-400 rounded-md"><strong>Error:</strong> {error}</div>;

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50/50 min-h-screen space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><CardContent className="p-5 flex justify-between items-center"><div className="space-y-1"><div className="text-2xl font-bold text-green-600">₹{totalIncoming.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div><div className="text-sm text-slate-500">Total Income</div></div><TrendingUp className="h-8 w-8 text-green-500" /></CardContent></Card>
                <Card><CardContent className="p-5 flex justify-between items-center"><div className="space-y-1"><div className="text-2xl font-bold text-red-600">₹{totalOutgoing.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div><div className="text-sm text-slate-500">Total Expense</div></div><TrendingDown className="h-8 w-8 text-red-500" /></CardContent></Card>
                <Card><CardContent className="p-5 flex justify-between items-center"><div className="space-y-1"><div className="text-2xl font-bold text-purple-600">₹{balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div><div className="text-sm text-slate-500">Net Balance</div></div><LayoutDashboard className="h-8 w-8 text-purple-600" /></CardContent></Card>
                <Card><CardContent className="p-5 flex justify-between items-center"><div className="space-y-1"><div className="text-2xl font-bold text-slate-600">{allTransactions.length}</div><div className="text-sm text-slate-500">Total Transactions</div></div><FileText className="h-8 w-8 text-slate-600" /></CardContent></Card>
            </div>
            <Card>
                <CardHeader className="bg-purple-50/70 border-b border-purple-200/80"><CardTitle><Filter className="w-5 h-5 text-purple-600" /> Filters</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
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
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader><CardTitle>Income, Expense & Balance Trend</CardTitle></CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={formatXAxisDate} />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                                <Legend />
                                <Line type="monotone" dataKey="income" name="Income" stroke="#16a34a" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="expense" name="Expense" stroke="#dc2626" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="balance" name="Balance" stroke="#8884d8" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Expense by Group Head</CardTitle></CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                {expenseByGroupHeadData.length > 0 ? (
                                    <Pie data={expenseByGroupHeadData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                        {expenseByGroupHeadData.map((_, i) => <Cell key={`cell-${i}`} fill={getPieColor(i)} />)}
                                    </Pie>
                                ) : (
                                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#64748b">No expense data</text>
                                )}
                                <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-3 text-left font-medium text-slate-600">Date</th>
                                    {currentUser.role === 'admin' && <th className="p-3 text-left font-medium text-slate-600">Person</th>}
                                    <th className="p-3 text-left font-medium text-slate-600">Group Head</th>
                                    <th className="p-3 text-left font-medium text-slate-600">Reason</th>
                                    <th className="p-3 text-left font-medium text-slate-600">Mode</th>
                                    <th className="p-3 text-right font-medium text-slate-600">Income</th>
                                    <th className="p-3 text-right font-medium text-slate-600">Expense</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map(t => (
                                    <tr key={t.id} className="border-b last:border-b-0 border-slate-200 hover:bg-purple-50/60">
                                        <td className="p-3">{new Date(t.date).toLocaleDateString()}</td>
                                        {currentUser.role === 'admin' && <td className="p-3">{t.personName}</td>}
                                        <td className="p-3"><Badge>{t.groupHead}</Badge></td>
                                        <td className="p-3">{t.reason}</td>
                                        <td className="p-3"><Badge variant="secondary">{t.mode}</Badge></td>
                                        <td className="p-3 text-right text-green-600 font-medium">{t.incoming > 0 ? `₹${t.incoming.toLocaleString('en-IN', {minimumFractionDigits: 2})}` : '-'}</td>
                                        <td className="p-3 text-right text-red-600 font-medium">{t.outgoing > 0 ? `₹${t.outgoing.toLocaleString('en-IN', {minimumFractionDigits: 2})}` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>All Transactions ({filteredTransactions.length})</CardTitle></CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-auto max-h-[400px]">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-100 sticky top-0">
                                <tr>
                                    <th className="p-3 text-left font-medium text-slate-600">Date</th>
                                    {currentUser.role === 'admin' && <th className="p-3 text-left font-medium text-slate-600">Person</th>}
                                    <th className="p-3 text-left font-medium text-slate-600">Group Head</th>
                                    <th className="p-3 text-left font-medium text-slate-600">Reason</th>
                                    <th className="p-3 text-left font-medium text-slate-600">Mode</th>
                                    <th className="p-3 text-right font-medium text-slate-600">Income</th>
                                    <th className="p-3 text-right font-medium text-slate-600">Expense</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(t => (
                                    <tr key={t.id} className="border-b last:border-b-0 border-slate-200 hover:bg-purple-50/60">
                                        <td className="p-3">{new Date(t.date).toLocaleDateString()}</td>
                                        {currentUser.role === 'admin' && <td className="p-3">{t.personName}</td>}
                                        <td className="p-3"><Badge>{t.groupHead}</Badge></td>
                                        <td className="p-3">{t.reason}</td>
                                        <td className="p-3"><Badge variant="secondary">{t.mode}</Badge></td>
                                        <td className="p-3 text-right text-green-600 font-medium">{t.incoming > 0 ? `₹${t.incoming.toLocaleString('en-IN', {minimumFractionDigits: 2})}` : '-'}</td>
                                        <td className="p-3 text-right text-red-600 font-medium">{t.outgoing > 0 ? `₹${t.outgoing.toLocaleString('en-IN', {minimumFractionDigits: 2})}` : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default DashboardView;