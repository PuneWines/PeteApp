"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// --- Interfaces ---
interface Transaction {
  date: string
  incoming: number
  outgoing: number
  mode: string
  groupHead: string
  reason: string
  photoLink?: string
}

interface AppUser {
  id: string
  name: string
  role: "User" | "Admin" // Changed to match your localStorage
}

interface DropdownOptions {
  personName: string[]
  mode: string[]
  groupHead: string[]
  reason: string[]
}

interface FormViewProps {
  onAddTransaction?: (transaction: Omit<Transaction, "id" | "personName" | "userId">) => void
}

// --- Constants ---
const APP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx5dryxS1R5zp6myFfUlP1QPimufTqh5hcPcFMNcAJ-FiC-hyQL9mCkgHSbLkOiWTibeg/exec"
const GOOGLE_DRIVE_FOLDER_ID = "1khKpwllobekR5yCeDXMUyz-hY_MwFWyv"
const PUBLIC_SHEET_ID = "1-NTfh3VGrhEImrxNVSbDdBmFxTESegykHslL-t3Nf8I"
const PUBLIC_SHEET_MASTER_NAME = "Master"

// --- Column INDICES in the "Master" sheet for adding new values ---
const PERSON_NAME_COLUMN_INDEX = 0 // Column A (0-indexed) - For adding new person names
const GROUP_HEAD_COLUMN_INDEX = 2 // Column C (0-indexed)
const REASON_COLUMN_INDEX = 6 // Column G (0-indexed)

const isNonEmptyString = (value: any): value is string => typeof value === "string" && value.trim().length > 0

const FormView: React.FC<FormViewProps> = ({ onAddTransaction }) => {
  const { toast } = useToast()
  
  // Get currentUser from localStorage
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [formData, setFormData] = useState({
    personName: "",
    date: new Date().toISOString().split("T")[0],
    incoming: "",
    outgoing: "",
    mode: "",
    groupHead: "",
    reason: "",
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(Date.now())
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOptions>({
    personName: [],
    mode: [],
    groupHead: [],
    reason: [],
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [isGroupHeadModalOpen, setIsGroupHeadModalOpen] = useState(false)
  const [newGroupHead, setNewGroupHead] = useState("")
  const [isAddingGroupHead, setIsAddingGroupHead] = useState(false)
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false)
  const [newReason, setNewReason] = useState("")
  const [isAddingReason, setIsAddingReason] = useState(false)
  const [isPersonNameModalOpen, setIsPersonNameModalOpen] = useState(false)
  const [newPersonName, setNewPersonName] = useState("")
  const [isAddingPersonName, setIsAddingPersonName] = useState(false)

  // Load currentUser from localStorage on component mount
  useEffect(() => {
    const loadCurrentUser = () => {
      try {
        const raw = localStorage.getItem("currentUser");
        if (raw) {
          const user = JSON.parse(raw);
          setCurrentUser(user);
          // For regular users, set their name as default
          if (user.role === "User") { // Changed to "User"
            setFormData(prev => ({ ...prev, personName: user.name }));
          }
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
      }
    };

    loadCurrentUser();
  }, []);

  const fetchDropdownOptions = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const url = `https://docs.google.com/spreadsheets/d/${PUBLIC_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(PUBLIC_SHEET_MASTER_NAME)}`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to fetch dropdown data: ${response.status} - ${response.statusText}`)

      let text = await response.text()
      text = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"))
      const jsonData = JSON.parse(text)

      if (!jsonData.table || !jsonData.table.rows) throw new Error("Dropdown data is not in the expected format.")

      const dataRows = jsonData.table.rows
      const personNameSet = new Set<string>()
      const modeSet = new Set<string>()
      const groupHeadSet = new Set<string>()
      const reasonSet = new Set<string>()

      for (let i = 1; i < dataRows.length; i++) {
        const row = dataRows[i]
        if (row.c?.[0]?.v != null) personNameSet.add(String(row.c[0].v).trim())
        if (row.c?.[1]?.v != null) modeSet.add(String(row.c[1].v).trim())
        if (row.c?.[2]?.v != null) groupHeadSet.add(String(row.c[2].v).trim())
        if (row.c?.[6]?.v != null) reasonSet.add(String(row.c[6].v).trim())
      }

      setDropdownOptions({
        personName: Array.from(personNameSet).filter(isNonEmptyString),
        mode: Array.from(modeSet).filter(isNonEmptyString),
        groupHead: Array.from(groupHeadSet).filter(isNonEmptyString),
        reason: Array.from(reasonSet).filter(isNonEmptyString),
      })
    } catch (err: unknown) {
      console.error("Error fetching dropdown data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
      toast({
        title: "Error loading dropdowns",
        description: err instanceof Error ? err.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDropdownOptions()
  }, [toast])

  const handleAddNewOption = async (
    newValue: string,
    columnIndex: number,
    setAdding: (isAdding: boolean) => void,
    setModalOpen: (isOpen: boolean) => void,
    clearInput: () => void,
    optionType: string,
  ) => {
    if (!newValue.trim()) {
      toast({ title: "Error", description: `${optionType} name cannot be empty.`, variant: "destructive" })
      return
    }

    setAdding(true)
    try {
      const url = `https://docs.google.com/spreadsheets/d/${PUBLIC_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(PUBLIC_SHEET_MASTER_NAME)}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch sheet data: ${response.status}`)
      }

      let text = await response.text()
      text = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"))
      const jsonData = JSON.parse(text)

      if (!jsonData.table || !jsonData.table.rows) {
        throw new Error("Sheet data is not in the expected format.")
      }

      const dataRows = jsonData.table.rows
      let lastRowWithDataInColumn = 1

      for (let i = 1; i < dataRows.length; i++) {
        const row = dataRows[i]
        if (row.c && row.c[columnIndex] && row.c[columnIndex].v != null && String(row.c[columnIndex].v).trim() !== "") {
          lastRowWithDataInColumn = i
        }
      }

      const targetRowIndex = lastRowWithDataInColumn + 1
      const targetRowNumber = targetRowIndex + 1

      let existingRowData: (string | number)[] = []
      const maxColumns = Math.max(PERSON_NAME_COLUMN_INDEX, GROUP_HEAD_COLUMN_INDEX, REASON_COLUMN_INDEX) + 1
      if (targetRowIndex < dataRows.length && dataRows[targetRowIndex]) {
        const existingRow = dataRows[targetRowIndex]
        for (let i = 0; i < maxColumns; i++) {
          existingRowData[i] = (existingRow.c && existingRow.c[i] && existingRow.c[i].v != null) ? String(existingRow.c[i].v) : ""
        }
      } else {
        existingRowData = Array(maxColumns).fill("")
      }

      existingRowData[columnIndex] = newValue.trim()

      const requestBody = new URLSearchParams({
        action: "update",
        sheetName: PUBLIC_SHEET_MASTER_NAME,
        rowIndex: targetRowNumber.toString(),
        rowData: JSON.stringify(existingRowData),
      }).toString()

      const updateResponse = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: requestBody,
      })

      const result = await updateResponse.json()
      if (result.success) {
        toast({
          title: "Success",
          description: `${optionType} "${newValue.trim()}" added successfully.`,
        })
        clearInput()
        setModalOpen(false)
        await fetchDropdownOptions()
      } else {
        throw new Error(result.error || `Failed to add ${optionType}.`)
      }
    } catch (err: unknown) {
      console.error(`Error adding ${optionType}:`, err)
      toast({
        title: `Error adding ${optionType}`,
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  // Update formData when currentUser changes
  useEffect(() => {
    if (currentUser?.name && currentUser.role === "User") { // Changed to "User"
      setFormData(prev => ({ ...prev, personName: currentUser.name }))
    }
  }, [currentUser])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setPhotoFile(e.target.files[0])
    else setPhotoFile(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is logged in
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "Please login again.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true);
    const loadingToast = toast({
      title: "Submitting Transaction...",
      description: "Please wait.",
      duration: 900000,
    })

    try {
      let photoLink = ""
      if (photoFile) {
        const reader = new FileReader()
        reader.readAsDataURL(photoFile)
        photoLink = await new Promise<string>((resolve, reject) => {
          reader.onload = async () => {
            const base64Data = reader.result?.toString().split(",")[1]
            if (!base64Data) {
              reject(new Error("Failed to read file data."))
              return
            }

            try {
              const uploadBody = new URLSearchParams({
                action: "uploadFile",
                fileName: photoFile.name,
                base64Data: base64Data,
                mimeType: photoFile.type,
                folderId: GOOGLE_DRIVE_FOLDER_ID,
              }).toString()

              const uploadResponse = await fetch(APP_SCRIPT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: uploadBody,
              })

              const uploadResult = await uploadResponse.json()
              if (uploadResult.success) resolve(uploadResult.fileUrl)
              else reject(new Error(uploadResult.error || "File upload failed."))
            } catch (uploadError: any) {
              reject(uploadError)
            }
          }
          reader.onerror = (error) => reject(error)
        })
      }

      const currentDateTime = new Date()
      const formattedTimestamp = `${String(currentDateTime.getDate()).padStart(2, "0")}/${String(currentDateTime.getMonth() + 1).padStart(2, "0")}/${currentDateTime.getFullYear()} ${String(currentDateTime.getHours()).padStart(2, "0")}:${String(currentDateTime.getMinutes()).padStart(2, "0")}:${String(currentDateTime.getSeconds()).padStart(2, "0")}`
      const monthName = currentDateTime.toLocaleDateString("en-US", { year: "numeric", month: "long" })

      const rowDataArray = [
        formattedTimestamp,
        formData.personName,
        formData.date,
        Number.parseFloat(formData.incoming) || 0,
        Number.parseFloat(formData.outgoing) || 0,
        formData.mode,
        formData.groupHead,
        formData.reason,
        photoLink,
        monthName,
        currentUser.id
      ]

      const submitBody = new URLSearchParams({
        action: "insert",
        sheetName: "Data",
        rowData: JSON.stringify(rowDataArray),
      }).toString()

      const submitResponse = await fetch(APP_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: submitBody,
      })

      const submitResult = await submitResponse.json()
      if (submitResult.success) {
        toast({ title: "Transaction Added!", description: "Your transaction has been recorded.", variant: "default" })
        onAddTransaction?.({
          date: formData.date,
          incoming: Number.parseFloat(formData.incoming) || 0,
          outgoing: Number.parseFloat(formData.outgoing) || 0,
          mode: formData.mode,
          groupHead: formData.groupHead,
          reason: formData.reason,
          photoLink: photoLink,
        })

        setFormData({
          personName: currentUser.role === "User" ? currentUser.name : "", // Changed to "User"
          date: new Date().toISOString().split("T")[0],
          incoming: "",
          outgoing: "",
          mode: "",
          groupHead: "",
          reason: "",
        })
        setPhotoFile(null)
        setFileInputKey(Date.now())
      } else {
        throw new Error(submitResult.error || "Failed to add transaction to Google Sheet.")
      }
    } catch (error: unknown) {
      console.error("Submission error:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      loadingToast.dismiss()
      setIsSubmitting(false);
    }
  }

  // Show loading state while checking user
  if (!currentUser) {
    return (
      <Card className="border-slate-200/80 rounded-xl">
        <CardHeader className="bg-purple-50/70 border-b border-purple-200/80">
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" /> Add New Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-2 text-slate-700">Loading user data...</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-slate-200/80 rounded-xl">
        <CardHeader className="bg-purple-50/70 border-b border-purple-200/80">
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" /> Add New Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
          <p className="mt-2 text-slate-700">Loading form options...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 rounded-xl">
        <CardHeader className="border-b border-red-200/80">
          <CardTitle className="text-red-800 flex items-center gap-2">
            <FileText className="h-5 w-5" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-red-600 font-semibold">Error loading form:</p>
          <p className="text-red-500 mt-1">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-slate-200/80 rounded-xl">
        <CardHeader className="bg-purple-50/70 border-b border-purple-200/80">
          <CardTitle className="text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" /> Add New Transaction
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Person Name Field - Different behavior based on role */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Person Name</Label>
              {currentUser.role === "User" ? ( // Changed to "User"
                // For regular users - show disabled input with their name
                <Input 
                  value={formData.personName} 
                  disabled 
                  className="bg-slate-100"
                />
              ) : (
                // For admins - show dropdown with add button
                <div className="flex items-end space-x-2">
                  <Select
                    value={formData.personName}
                    onValueChange={(value) => handleSelectChange("personName", value)}
                  >
                    <SelectTrigger className="flex-grow">
                      <SelectValue placeholder="Select Person" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.personName.map((name, index) => (
                        <SelectItem key={`person-${index}`} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline" 
                    onClick={() => setIsPersonNameModalOpen(true)} 
                    className="flex-shrink-0"
                  >
                    <PlusCircle className="h-4 w-4 text-purple-600" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Date</Label>
              <Input type="date" value={formData.date} onChange={handleInputChange} name="date" required />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Income (Credit)</Label>
              <Input type="number" step="0.01" placeholder="0.00" value={formData.incoming} onChange={handleInputChange} name="incoming" />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Expense (Debit)</Label>
              <Input type="number" step="0.01" placeholder="0.00" value={formData.outgoing} onChange={handleInputChange} name="outgoing" />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Payment Mode</Label>
              <Select value={formData.mode} onValueChange={(value) => handleSelectChange("mode", value)}>
                <SelectTrigger><SelectValue placeholder="Select Mode" /></SelectTrigger>
                <SelectContent>
                  {dropdownOptions.mode.map((mode, index) => (
                    <SelectItem key={`mode-${index}`} value={mode}>{mode}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Group Head</Label>
              <div className="flex items-end space-x-2">
                <Select value={formData.groupHead} onValueChange={(value) => handleSelectChange("groupHead", value)}>
                  <SelectTrigger className="flex-grow"><SelectValue placeholder="Select Group Head" /></SelectTrigger>
                  <SelectContent>
                    {dropdownOptions.groupHead.map((group, index) => (
                      <SelectItem key={`group-${index}`} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" size="icon" variant="outline" onClick={() => setIsGroupHeadModalOpen(true)} className="flex-shrink-0">
                  <PlusCircle className="h-4 w-4 text-purple-600" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-700 font-medium">Reason/Description</Label>
              <div className="flex items-end space-x-2">
                <Select value={formData.reason} onValueChange={(value) => handleSelectChange("reason", value)}>
                  <SelectTrigger className="flex-grow"><SelectValue placeholder="Select Reason" /></SelectTrigger>
                  <SelectContent>
                    {dropdownOptions.reason.map((reason, index) => (
                      <SelectItem key={`reason-${index}`} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" size="icon" variant="outline" onClick={() => setIsReasonModalOpen(true)} className="flex-shrink-0">
                  <PlusCircle className="h-4 w-4 text-purple-600" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-700 font-medium">Photo (Optional)</Label>
              <Input key={fileInputKey} type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Add Transaction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Add Person Name Modal (Only for Admin) */}
      <Dialog open={isPersonNameModalOpen} onOpenChange={setIsPersonNameModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Person Name</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label htmlFor="newPersonName">Person Name</Label>
            <Input 
              id="newPersonName" 
              value={newPersonName} 
              onChange={(e) => setNewPersonName(e.target.value)} 
              placeholder="Enter new person name" 
              className="mt-1" 
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPersonNameModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700" 
              onClick={() => handleAddNewOption(
                newPersonName, 
                PERSON_NAME_COLUMN_INDEX, 
                setIsAddingPersonName, 
                setIsPersonNameModalOpen, 
                () => setNewPersonName(""), 
                "Person Name"
              )} 
              disabled={isAddingPersonName}
            >
              {isAddingPersonName ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Add Person Name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isGroupHeadModalOpen} onOpenChange={setIsGroupHeadModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Group Head</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label htmlFor="newGroupHead">Group Head Name</Label>
            <Input id="newGroupHead" value={newGroupHead} onChange={(e) => setNewGroupHead(e.target.value)} placeholder="Enter new group head" className="mt-1" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGroupHeadModalOpen(false)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => handleAddNewOption(newGroupHead, GROUP_HEAD_COLUMN_INDEX, setIsAddingGroupHead, setIsGroupHeadModalOpen, () => setNewGroupHead(""), "Group Head")} disabled={isAddingGroupHead}>
              {isAddingGroupHead ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Add Group Head
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReasonModalOpen} onOpenChange={setIsReasonModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Reason</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label htmlFor="newReason">Reason / Description</Label>
            <Input id="newReason" value={newReason} onChange={(e) => setNewReason(e.target.value)} placeholder="Enter new reason" className="mt-1" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReasonModalOpen(false)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => handleAddNewOption(newReason, REASON_COLUMN_INDEX, setIsAddingReason, setIsReasonModalOpen, () => setNewReason(""), "Reason")} disabled={isAddingReason}>
              {isAddingReason ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Add Reason
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default FormView