'use client'

import { createEmployee, deleteEmployee, getEmployeeByRole, updateEmployee } from "@/lib/employee";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select";
import { Box, Button } from "@mui/material";
import {
   GridRowsProp,
   GridRowModesModel,
   GridRowModes,
   DataGrid,
   GridColDef,
   GridToolbarContainer,
   GridActionsCellItem,
   GridEventListener,
   GridRowId,
   GridRowModel,
   GridRowEditStopReasons,
   GridSlotProps,
   GridAddIcon,
} from '@mui/x-data-grid';
import { Pencil, Save, Trash, X } from "lucide-react";
import { customAlphabet } from "nanoid";
import { useEffect, useState } from "react";

const nanoid = customAlphabet('1234567890', 10) // id

declare module '@mui/x-data-grid' {
   interface ToolbarPropsOverrides {
      setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
      setRowModesModel: (
         newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
      ) => void;
      setMode: (mode: string) => void
   }
}

// setup add record button here!
function EditToolbar(props: GridSlotProps['toolbar']) {
   const { setRows, setRowModesModel, setMode } = props;
 
   const handleClick = () => {
      const id = nanoid();
      setRows((oldRows) => [
         ...oldRows,
         { id, name: '', email: '', target_deal: 0, isNew: true },
      ]);
      setRowModesModel((oldModel) => ({
         ...oldModel,
         [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
      setMode('create')
   };

   return (
      <GridToolbarContainer>
         <Button color="primary" startIcon={<GridAddIcon />} onClick={handleClick}>
            Tambah Agent
         </Button>
      </GridToolbarContainer>
   );
}

// Page UI
export default function Agents() {
   const [rows, setRows] = useState<GridRowsProp>([]); // set data here!
   const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({}); // for inserting new row
   const [role, setRole] = useState("sales")
   const [mode, setMode] = useState("") // mode create or update

   useEffect(() => {
      const fetchData = async () => {
         const data = await getEmployeeByRole(role)
         if (data) {
            setRows(data)
         }
      }
      fetchData()
   }, [role])

   const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
         event.defaultMuiPrevented = true;
      }
   };

   const handleEditClick = (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
      setMode('update')
   };
   
   const handleSaveClick = (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
   };

   const handleDeleteClick = (id: GridRowId) => () => {
      setRows(rows.filter((row) => row.id !== id));
      void (async () => {
         await deleteEmployee(id.toString())
      })()
   };

   const handleCancelClick = (id: GridRowId) => () => {
      setRowModesModel({
         ...rowModesModel,
         [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
      setMode('')

      const editedRow = rows.find((row) => row.id === id);
      if (editedRow!.isNew) {
         setRows(rows.filter((row) => row.id !== id));
      }
   };

   const processRowUpdate = (newRow: GridRowModel) => {
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      // create and update user
      if (mode === 'create') {
         void (async () => {
            await createEmployee(newRow.id, newRow.name, newRow.name, role, newRow.email)
         })()
      }
      if (mode === 'update') {
         void (async () => {
            await updateEmployee(newRow.id, newRow.name, newRow.target_deal, newRow.email)
         })()
      }
      return updatedRow;
   };

   const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel);
   };

   // set table header here!
   const column: GridColDef[] = [
      { 
         field: 'name', 
         headerName: 'Nama', 
         width: 220, 
         editable: true 
      }, 
      { 
         field: 'email', 
         headerName: 'Email', 
         width: 220, 
         editable: true 
      }, 
      ...(role === 'sales' ? [{
         field: 'target_deal', 
         headerName: 'Target Bulanan', 
         width: 150,
         editable: true
      }] : []),
      {
         field: 'last_login', 
         headerName: 'Terakhir Diakses', 
         width: 190
      },
      {
         field: 'actions',
         type: 'actions',
         headerName: 'Tindakan',
         width: 100,
         cellClassName: 'actions',
         getActions: ({ id }) => {
         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

         if (isInEditMode) {
            return [
               <GridActionsCellItem
                  key={nanoid()}
                  icon={<Save />}
                  label="Save"
                  sx={{
                     color: 'primary.main',
                  }}
                  onClick={handleSaveClick(id)}
               />,
               <GridActionsCellItem
                  key={nanoid()}
                  icon={<X />}
                  label="Cancel"
                  className="textPrimary"
                  onClick={handleCancelClick(id)}
                  color="inherit"
               />,
            ];
         }

            return [
               <GridActionsCellItem
                  key={nanoid()}
                  icon={<Pencil />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
               />,
               <GridActionsCellItem
                  key={nanoid()}
                  icon={<Trash />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
               />,
            ];
         },
      },
   ];

   return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
         <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
         </div>
         <div className="w-44">
            <Select value={role} onValueChange={setRole}>
               <SelectTrigger className="w-full rounded">
                  <SelectValue placeholder="Set priority" />
               </SelectTrigger>
               <SelectContent>
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
               <SelectItem value="tech" className="pt-2 pb-2 mr-1 pr-7">
                  <span className="flex items-center">
                     Technical Support
                  </span>
               </SelectItem>
               </SelectContent>
            </Select>
         </div>
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
               editMode="row"
               rowModesModel={rowModesModel}
               onRowModesModelChange={handleRowModesModelChange}
               onRowEditStop={handleRowEditStop}
               processRowUpdate={processRowUpdate}
               slots={{ toolbar: EditToolbar }}
               slotProps={{
                  toolbar: { setRows, setRowModesModel, setMode },
               }}
               pageSizeOptions={[10, 25, 50]}
               initialState={{
                  sorting: {
                     sortModel: [{ field: 'name', sort: 'asc' }],
                  },
                  pagination: { 
                     paginationModel: { pageSize: 10, page: 0 } 
                  }, // Default 10 rows per page
               }}
               pagination
            />
         </Box>
      </div>
   );
}