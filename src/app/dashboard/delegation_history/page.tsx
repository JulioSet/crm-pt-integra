'use client'

import { DelegationHistory } from "@/lib/definitions";
import { fetchAllDelegationHistory } from "@/lib/delegation";
import { getSession } from "@/lib/employee";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { formatFullDate } from "@/utils/date";
import { Box } from "@mui/material";
import {
   GridRowsProp,
   DataGrid,
   GridColDef,
} from '@mui/x-data-grid';
import { useEffect, useState } from "react";

// Page UI
export default function DelagationHistory() {
   const [loading, setLoading] = useState(true)
   const [agentRole, setAgentRole] = useState("")
   const [delegationHistory, setDelegationHistory] = useState<DelegationHistory[]>([])
   // table
   const [rows, setRows] = useState<GridRowsProp>([]); // set data here!
   const [role, setRole] = useState("all")

   // init data
   useEffect(() => {
      setLoading(true)
      const fetchData = async () => {
         const session = await getSession()
         setAgentRole(session?.role)
         if (session?.role !== 'admin') {
            setRole(agentRole)
         }

         const data = await fetchAllDelegationHistory()
         if (data) {
            setDelegationHistory(data)
         }
      }
      fetchData()
      setLoading(false)
   }, [agentRole])

   // change based on role
   useEffect(() => {
      if (role === 'all') {
         setRows(delegationHistory)
         
      } else {
         setRows(delegationHistory.filter(history => history.role === role))
      }
   }, [delegationHistory, role])

   // set table header here!
   const column: GridColDef[] = [
      { 
         field: 'telepon', 
         headerName: 'Telepon', 
         width: 150, 
         valueGetter: (data) => `+${data}`
      },
      { 
         field: 'nama', 
         headerName: 'Nama', 
         width: 150,
      },
      { 
         field: 'agent', 
         headerName: 'Agent', 
         width: 150, 
         valueGetter: (data) => data ?? ""
      },
      { 
         field: 'role', 
         headerName: 'Role', 
         width: 150,
         valueGetter: (data) => {
            if (data === 'cs') {
               return 'Customer Service'
            }
            if (data === 'sales') {
               return 'Sales'
            }
         }
      },
      { 
         field: 'waktu', 
         headerName: 'Waktu', 
         width: 200,
         valueGetter: (data) => formatFullDate(data)
      },
      { 
         field: 'status', 
         headerName: 'Status', 
         width: 100,
         renderCell: ({ value }) => {
            if (value === 0) {
               return (
                  <div className="w-full h-full flex items-center justify-center">
                     <div className="p-1 pl-2 pr-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm">
                        DITOLAK
                     </div>
                  </div>
               )
            }
            if (value === 1) {
               return (
                  <div className="w-full h-full flex items-center justify-center">
                     <div className="p-1 pl-2 pr-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm">
                        DITERIMA
                     </div>
                  </div>
               )
            }
            if (value === 2) {
               return (
                  <div className="w-full h-full flex items-center justify-center">
                     <div className="p-1 pl-2 pr-2 rounded bg-yellow-400 hover:bg-yellow-500 text-black text-sm">
                        REQUESTED
                     </div>
                  </div>
               )
            }
         }
      },
   ];

   return (
      <div>
         {loading ? (
            <div className="flex items-center justify-center h-screen">
               <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            </div>
         ) : (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
               <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-tight">Riwayat Izin Delegasi</h2>
               </div>
               {agentRole === 'admin' && (
                  <div className="w-44">
                     <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="w-full rounded">
                           <SelectValue placeholder="Pasang Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="all" className="pt-2 pb-2 mr-1 pr-7">
                              <span className="flex items-center">
                                 Semua
                              </span>
                           </SelectItem>
                           <SelectItem value="sales" className="pt-2 pb-2 mr-1 pr-7">
                              <span className="flex items-center">
                                 Sales
                              </span>
                           </SelectItem>
                           <SelectItem value="cs" className="pt-2 pb-2 mr-1 pr-7">
                              <span className="flex items-center">
                                 Customer Service
                              </span>
                           </SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               )}
               <Box
                  sx={{
                     maxHeight: 500,
                     '& .actions': {
                        color: 'text.secondary',
                     },
                     '& .textPrimary': {
                        color: 'text.primary',
                     },
                  }}
               >
                  <DataGrid
                     rows={rows}
                     columns={column}
                     pageSizeOptions={[10, 25, 50]}
                     initialState={{
                        sorting: {
                           sortModel: [{ field: 'waktu', sort: 'desc' }],
                        },
                        pagination: { 
                           paginationModel: { pageSize: 10, page: 0 } 
                        }, // Default 10 rows per page
                     }}
                     pagination
                  />
               </Box>
            </div>
         )}
      </div>
   );
}