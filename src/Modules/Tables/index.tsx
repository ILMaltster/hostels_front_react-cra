import { FC, FormEventHandler, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react"
import { DataGrid, GridActionsCellItem, GridCallbackDetails, GridCellEditStopParams, GridColDef, GridPaginationModel, GridSortModel, MuiEvent } from '@mui/x-data-grid';
import { IHostel } from "./Models/hostels";
import { useGetHostels } from "./Utils/Queries/getHostels";
import { PAGE_LIMITS, PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import { Alert, AlertProps, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useAddHostel } from "./Utils/Queries/addHostel";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useDeleteHostel } from "./Utils/Queries/deleteHostel";
import { useEditHostel } from "./Utils/Queries/editHostel";


const getDataGridColumns = (handleDeleteClick:any): GridColDef<IHostel>[] => [
    { 
        field: 'id',
        headerName: 'id',   
        type: 'number',
        width: 80,
        sortable: true,
    },
    { 
        field: 'name',
        headerName: 'name',    
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'tin',
        headerName: 'tin',   
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'address',
        headerName: 'address',  
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'actions',
        type: 'actions',
        headerName: 'actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ row }) => {    
            return [
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={()=>handleDeleteClick(row)}
                color="inherit"
              />,
            ];
          },
    },
]

const tableInitialState: GridInitialStateCommunity = {
    pagination: {
        paginationModel: {
            pageSize: PAGE_LIMIT_DEFAULT
        }
    }
}


export const Tables: FC = () => {
    const [paginationModel, setPageNumber] = useState<GridPaginationModel>({page: 0, pageSize: PAGE_LIMIT_DEFAULT});

    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const theme = useTheme()

    const [forManualUpdateQuery, setForManualUpdateQuery] = useState<boolean>(true);
    let {data, isPending, error } = useGetHostels({limit: paginationModel.pageSize, offset: paginationModel.pageSize * paginationModel.page, forManualUpdateQuery});
    
    const onEditError = async () => { setSnackbar({ children: 'Не удалось изменить строку', severity: 'error' }); setForManualUpdateQuery((v)=>!v);};
    const onSuccesEdit = () => setSnackbar({ children: 'Строка успешно изменилась', severity: 'success' });
    
    const {mutate: editHostel} = useEditHostel(onEditError, onSuccesEdit);
    const {mutate: deleteHostel} = useDeleteHostel();
    const {mutate: addHostel} = useAddHostel();

    const { register, handleSubmit } = useForm<Omit<IHostel, "id">>()

    // -- snackbar --
    const [snackbar, setSnackbar] = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);

     const handleCloseSnackbar = () => setSnackbar(null);
    // -- snackbar --

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        handleSubmit((body) => addHostel(body))();
    }; 

    const onPaginationModelChange = (model: GridPaginationModel) => {
        setPageNumber(model);
    };

    const processRowUpdate = (updatedRow: IHostel, originalRow: IHostel) => {
        editHostel({body: updatedRow, tin: originalRow.tin});
        return updatedRow;
    };

    const deleteHandler = (row: IHostel) => {
        deleteHostel(row.tin);
    };

    const onSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
        console.log(model, details);
    }

    const columns = getDataGridColumns(deleteHandler);

    return (
        <>
            <Typography variant="h2">
                Hostels
            </Typography>
            {
                showAddForm && (
                <form onSubmit={onSubmit}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: theme.spacing(2), maxWidth: "400px"}}>
                        <TextField label="Имя" size="small" {...register('name')}/>
                        <TextField label="ИНН" size="small" {...register('tin')}/>
                        <TextField label="Адрес" size="small" {...register('address')}/>
                    </Box>
                    <Button variant={'contained'} sx={{marginTop: theme.spacing(2)}} type="submit">
                        Добавить
                    </Button>
                </form>
                )
            }
            <Button variant={'text'} onClick={() => setShowAddForm((prev) => !prev)}  sx={{marginTop: theme.spacing(2)}}>
                    { (showAddForm ? 'Скрыть' : 'Показать') + ' форму добавления'}
            </Button>
            {/* <div>
                <FormControl>
                    <InputLabel id="filterFieldSelectLabel">Age</InputLabel>
                    <Select
                        labelId="filterFieldSelectLabel"
                        id="filterFieldSelect"
                        value={columns.fiel}
                        label="Age"
                        onChange={handleChange}
                    >
                        {
                            columns.map(({field})=> (
                                <MenuItem value={field}>field</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div> */}
            <div style={{height: "400px", marginTop: theme.spacing(2)}}>
                {
                    data ? 
                    <DataGrid 
                        columns={columns} 
                        rows={data?.rows || []} 
                        rowCount={data?.count-1}
                        paginationMode="server"
                        pageSizeOptions={PAGE_LIMITS} 
                        initialState={tableInitialState}  
                        onPaginationModelChange={onPaginationModelChange}
                        processRowUpdate={processRowUpdate}
                        sortingMode="server"
                        onSortModelChange={onSortModelChange}
                        paginationModel={paginationModel}
                    />
                    :
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <CircularProgress/>
                    </Box>
                }
            </div>
            {!!snackbar && 
            <Snackbar
                open
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={handleCloseSnackbar}
                autoHideDuration={6000}
                >
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
            </Snackbar>
            }
        </>
    )
}