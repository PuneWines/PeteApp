"use client"

import React from "react"
// These are placeholder components to make the example runnable.
// In your project, you'd use your actual shadcn/ui components.
// The styling reflects a typical shadcn/ui setup with Tailwind CSS.

const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`border rounded-xl shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-6 border-b ${className}`}>{children}</div>
)

const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={`text-xl font-semibold tracking-tight ${className}`}>{children}</h3>
)

const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
)

const Button = ({ onClick, variant, className, children }: { onClick?: () => void; variant?: string; className?: string; children: React.ReactNode }) => (
  <button onClick={onClick} className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'} ${className}`}>
    {children}
  </button>
)

const Badge = ({ variant, className, children }: { variant?: string; className?: string; children: React.ReactNode }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variant === 'outline' ? 'text-foreground' : ''} ${className}`}>
    {children}
  </span>
)

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
)

// Mock data interfaces for demonstration
interface Transaction {
  id: string
  personName: string
  userId: string
  date: string
  incoming: number
  outgoing: number
  mode: string
  groupHead: string
  reason: string
  photo?: string
}

interface AppUser {
  id: string
  name: string
  role: "user" | "admin"
}

// The main component with updated UI layout
function ReportDetailView({
  detail,
  onBack,
  currentUser,
}: {
  detail: { type: string; value:string; data: Transaction[] }
  onBack: () => void
  currentUser: AppUser
}) {
  const totalIncoming = detail.data.reduce((sum, t) => sum + t.incoming, 0)
  const totalOutgoing = detail.data.reduce((sum, t) => sum + t.outgoing, 0)
  const balance = totalIncoming - totalOutgoing

  // Tailwind's JIT compiler needs to see the full class names.
  // This ensures dynamic classes for balance are generated correctly.
  const balanceBorderColor = balance >= 0 ? "border-blue-200" : "border-orange-200";
  const balanceBgColor = balance >= 0 ? "bg-blue-50" : "bg-orange-50";
  const balanceTextColor = balance >= 0 ? "text-blue-700" : "text-orange-700";
  const balanceSubTextColor = balance >= 0 ? "text-blue-600" : "text-orange-600";

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50/50 min-h-screen">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" className="border-slate-300 bg-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {detail.type === "groupHead" && "Group Head: "}
              {detail.type === "mode" && "Payment Mode: "}
              {detail.type === "month" && "Month: "}
              {detail.type === "person" && "Person: "}
              <span className="text-blue-600">{detail.value}</span>
            </h1>
            <p className="text-slate-500">{detail.data.length} transactions found</p>
          </div>
        </div>

        {/* Summary Cards: Vertically Aligned and Stretched */}
        <div className="flex flex-col gap-4">
          <Card className="border-green-200 bg-green-50/70">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="text-green-800 font-medium">Total Income</div>
              <div className="text-2xl font-bold text-green-700">₹{totalIncoming.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/70">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="text-red-800 font-medium">Total Expense</div>
              <div className="text-2xl font-bold text-red-700">₹{totalOutgoing.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className={`${balanceBorderColor} ${balanceBgColor}/70`}>
            <CardContent className="p-4 flex justify-between items-center">
              <div className={`${balanceSubTextColor} font-medium`}>
                {balance >= 0 ? "Net Balance" : "Net Deficit"}
              </div>
              <div className={`text-2xl font-bold ${balanceTextColor}`}>
                ₹{Math.abs(balance).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Transactions Table */}
        <Card className="border-slate-200 bg-white">
          <CardHeader className="p-4 bg-slate-50/80 border-b border-slate-200">
            <CardTitle className="text-slate-800 text-lg">Detailed Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100/80">
                  <tr>
                    <th className="p-3 text-left text-slate-600 font-semibold">Date</th>
                    {currentUser.role === "admin" && <th className="p-3 text-left text-slate-600 font-semibold">Person</th>}
                    <th className="p-3 text-left text-slate-600 font-semibold">Group Head</th>
                    <th className="p-3 text-left text-slate-600 font-semibold">Reason</th>
                    <th className="p-3 text-left text-slate-600 font-semibold">Mode</th>
                    <th className="p-3 text-right text-slate-600 font-semibold">Income</th>
                    <th className="p-3 text-right text-slate-600 font-semibold">Expense</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.data.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-3 text-slate-700">{new Date(transaction.date).toLocaleDateString()}</td>
                      {currentUser.role === "admin" && <td className="p-3 text-slate-700">{transaction.personName}</td>}
                      <td className="p-3">
                        <Badge variant="outline" className="border-blue-300 bg-blue-100/80 text-blue-800 font-medium">
                          {transaction.groupHead}
                        </Badge>
                      </td>
                      <td className="p-3 text-slate-700">{transaction.reason}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="border-slate-300 bg-slate-100/80 text-slate-800 font-medium">
                          {transaction.mode}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-green-600 font-medium">
                        {transaction.incoming > 0 ? `₹${transaction.incoming.toFixed(2)}` : "-"}
                      </td>
                      <td className="p-3 text-right text-red-600 font-medium">
                        {transaction.outgoing > 0 ? `₹${transaction.outgoing.toFixed(2)}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ReportDetailView
