import { FC, FormEventHandler, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react"
import { DataGrid, GridActionsCellItem, GridCellEditStopParams, GridColDef, GridPaginationModel, MuiEvent } from '@mui/x-data-grid';
import { IHostel } from "./Models/hostels";
import { useGetHostels } from "./Utils/Queries/getHostels";
import { PAGE_LIMITS, PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import { Alert, AlertProps, Box, Button, CircularProgress, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useAddHostel } from "./Utils/Queries/addHostel";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useDeleteHostel } from "./Utils/Queries/deleteHostel";
import { useEditHostel } from "./Utils/Queries/editHostel";
import { resolve } from "path";


const getDataGridColumns = (handleDeleteClick:any): GridColDef<IHostel>[] => [
    { 
        field: 'id',
        headerName: 'id',   
        type: 'number',
        width: 80,
        sortable: false,
    },
    { 
        field: 'name',
        headerName: 'name',    
        editable: true,
        flex: 0.3,
        sortable: false,
    },
    { 
        field: 'tin',
        headerName: 'tin',   
        editable: true,
        flex: 0.3,
        sortable: false,
    },
    { 
        field: 'address',
        headerName: 'address',  
        editable: true,
        flex: 0.3,
        sortable: false,
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

    const {data, isPending, error, refetch} = useGetHostels({limit: paginationModel.pageSize, offset: paginationModel.pageSize * paginationModel.page});
    
    const onEditError = () =>  {setSnackbar({ children: 'Не удалось изменить строку', severity: 'error' }); refetch()};
    const onSuccesEdit = () =>  setSnackbar({ children: 'Строка успешно изменилась', severity: 'success' });
    const {mutate: editHostel, ...editInfo} = useEditHostel(onEditError, onSuccesEdit);

    const {mutate: deleteHostel} = useDeleteHostel()
    const {mutate: addHostel} = useAddHostel();

    const { register, handleSubmit } = useForm<Omit<IHostel, "id">>()

    const [snackbar, setSnackbar] = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        handleSubmit((body) => addHostel(body))();
    } 

    const onPaginationModelChange = (model: GridPaginationModel) => {
        setPageNumber(model);
    }

    const processRowUpdate = (updatedRow: IHostel, originalRow: IHostel) => {
        editHostel({body: updatedRow, tin: originalRow.tin});
        return updatedRow;
    };

    const deleteHandlet = (row: IHostel) => {
        deleteHostel(row.tin);
    }

    const columns = getDataGridColumns(deleteHandlet);

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