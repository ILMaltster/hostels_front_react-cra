import { FC, FormEventHandler, MouseEventHandler, useCallback, useEffect, useRef, useState } from "react"
import { DataGrid, GridActionsCellItem, GridCallbackDetails, GridCellEditStopParams, GridColDef, GridFilterModel, GridPaginationModel, GridSortModel, MuiEvent } from '@mui/x-data-grid';
import { IHostel } from "./Models/hostels";
import { useGetHostels } from "./Utils/Queries/getHostels";
import { PAGE_LIMITS, PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import { Alert, AlertProps, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import { useAddHostel } from "./Utils/Queries/addHostel";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useDeleteHostel } from "./Utils/Queries/deleteHostel";
import { useEditHostel } from "./Utils/Queries/editHostel";
import { IFilter, IOperatorMark, IOrder, ISearch } from "Common/Models";


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

function parseGridSortModel([model]: GridSortModel): IOrder | undefined {
    if(model && (model.sort === 'asc' || model.sort === 'desc'))
        return {field: model.field, type: model.sort}
    else return undefined;
}

function OmitActionFromLiteral<T extends Record<string | symbol, any>>(object: GridColDef<T>[]): (keyof T)[] {
    // @ts-ignore
    return object.reduce<keyof T>((acc, curr) => curr.field !== 'actions' ? [...acc, curr.field] : acc, []);
}

const notNeedValueOperators: Array<IOperatorMark> = ['isNotEmpty', 'isEmpty'];

export const Tables: FC = () => {
    const [paginationModel, setPageNumber] = useState<GridPaginationModel>({page: 0, pageSize: PAGE_LIMIT_DEFAULT});
    const [orderModel, setOrderModel] = useState<GridSortModel>([]);
    const [searchModel, setSearchModel] = useState<ISearch<keyof IHostel>>({field: "id", value: ""});
    const [filterModel, setFilterModel] = useState<IFilter<keyof IHostel> | undefined>(undefined);

    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const theme = useTheme()

    const [forManualUpdateQuery, setForManualUpdateQuery] = useState<boolean>(true);
    let { data, isLoading: isGetHostelsLoading } = useGetHostels({
        limit: paginationModel.pageSize, 
        offset: paginationModel.pageSize * paginationModel.page, 
        order: parseGridSortModel(orderModel),
        search: searchModel,
        filter: filterModel,
        forManualUpdateQuery
    });
    
    const onEditError = async () => { setSnackbar({ children: 'Не удалось изменить строку', severity: 'error' }); setForManualUpdateQuery((v)=>!v);};
    const onSuccesEdit = () => setSnackbar({ children: 'Строка успешно изменилась', severity: 'success' });
    
    const {mutate: editHostel} = useEditHostel(onEditError, onSuccesEdit);
    const {mutate: deleteHostel} = useDeleteHostel();
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

    const onSortModelChange = (model: GridSortModel) => {
        setOrderModel(model);
    }

    const columns = getDataGridColumns(deleteHandler);

    const onChangeSearchSelect = (event: SelectChangeEvent<keyof IHostel>) => {
        const field = event.target.value as keyof IHostel;
        setSearchModel(prev => ({...prev, field}))
    }

    const onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchModel(prev => ({...prev, value: event.target.value}))
    }

    const onFilterChange = (model: GridFilterModel, details: GridCallbackDetails<"filter">) => {
        console.log(model, details);
        if (details.reason && details.reason !== 'deleteFilterItem'){
            const filter = model.items[0];
            const operator = filter.operator as IOperatorMark;
            const value = filter.value as string || [];
            const field = filter.field as keyof IHostel;

            console.log((value === '' || value.length === 0 || !value), value);

            if(!notNeedValueOperators.some((currOper) => currOper === operator) && (value === '' || value.length === 0 || !value)){
                setFilterModel(undefined)
            }

            setFilterModel({field, operator, value})
        }
        else if (details.reason === 'deleteFilterItem') {
            setFilterModel(undefined)
        }
    }

    const columnsWithoutAction =  OmitActionFromLiteral<IHostel>(columns);

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
            <Box sx={{marginTop: 2}}>
                <FormControl sx={{flexDirection: "row", alignItems: 'center', gap: 2}}>
                    <TextField id="table-search" label="Поиск" onChange={onChangeSearchText} size="small" type="search" />
                    по
                    <FormControl>
                        <InputLabel id="searchFieldSelect">Поле</InputLabel>
                        <Select<keyof IHostel>
                            id="searchFieldSelect"
                            value={searchModel.field}
                            label="Поле"
                            size="small"
                            onChange={onChangeSearchSelect}
                        >
                            {
                                columnsWithoutAction.map((field)=> (
                                    <MenuItem value={field}>{field}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </FormControl>
            </Box>
            <div style={{height: "400px", marginTop: theme.spacing(2)}}>
                <DataGrid 
                    loading={!data && isGetHostelsLoading}
                    columns={columns} 
                    rows={data?.rows || []} 
                    rowCount={data ? data?.count-1 : 0}
                    paginationMode="server"
                    pageSizeOptions={PAGE_LIMITS} 
                    initialState={tableInitialState}  
                    onPaginationModelChange={onPaginationModelChange}
                    processRowUpdate={processRowUpdate}
                    sortingMode="server"
                    onSortModelChange={onSortModelChange}
                    sortModel={orderModel}
                    paginationModel={paginationModel}
                    filterMode="server"
                    onFilterModelChange={onFilterChange}
                />
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