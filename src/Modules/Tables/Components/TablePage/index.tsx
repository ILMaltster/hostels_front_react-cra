import { Alert, AlertProps, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField, Typography, useTheme } from "@mui/material"
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridPaginationModel, GridSortModel } from "@mui/x-data-grid"
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import { PAGE_LIMITS, PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { IFilter, IOperatorMark, IPaginationModel, ISearch } from "Common/Models";
import { TTableModels } from "Modules/Tables/Models/general";
import { IHostel } from "Modules/Tables/Models/hostels";
import { FormEventHandler, ReactElement, useState } from "react";

const tableInitialState: GridInitialStateCommunity = {
    pagination: {
        paginationModel: {
            pageSize: PAGE_LIMIT_DEFAULT
        }
    }
}

const notNeedValueOperators: Array<IOperatorMark> = ['isNotEmpty', 'isEmpty'];

interface ITablePageProps{
    columns: GridColDef[];
    onSubmit: FormEventHandler<HTMLFormElement>;
    searchModelState: [ISearch<keyof TTableModels>, React.Dispatch<React.SetStateAction<ISearch<keyof TTableModels>>>];
    fieldsToAdd: ReactElement;
    dataTable?: IPaginationModel;
    isGetHostelsLoading: boolean;
    snackbarState: [Pick<AlertProps, "children" | "severity"> | null, React.Dispatch<React.SetStateAction<Pick<AlertProps, "children" | "severity"> | null>>];
    paginationModelState: [GridPaginationModel, React.Dispatch<React.SetStateAction<GridPaginationModel>>],
    processRowUpdate: (updatedRow: TTableModels, originalRow: TTableModels) => TTableModels,
    orderModelState: [GridSortModel, React.Dispatch<React.SetStateAction<GridSortModel>>],
    filterModelState: [IFilter<keyof TTableModels> | undefined, React.Dispatch<React.SetStateAction<IFilter<keyof TTableModels> | undefined>>]
}

export function TablePage (
    { 
        columns,
        onSubmit,
        searchModelState,
        fieldsToAdd,
        dataTable,
        isGetHostelsLoading,
        snackbarState,
        paginationModelState,
        processRowUpdate,
        orderModelState,
        filterModelState,
    }: ITablePageProps) {
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const theme = useTheme()
    const [searchModel, setSearchModel] = searchModelState;
    const [snackbar, setSnackbar] = snackbarState;
    const [paginationModel, setPageNumber] = paginationModelState;
    const [orderModel, setOrderModel] = orderModelState;
    const [filterModel, setFilterModel] = filterModelState;

    const onPaginationModelChange = (model: GridPaginationModel) => {
        setPageNumber(model);
    };

    const onSortModelChange = (model: GridSortModel) => {
        setOrderModel(model);
    }

    const onChangeSearchSelect = (event: SelectChangeEvent) => {
        const field = event.target.value;
        setSearchModel(prev => ({...prev, field}))
    }

    const onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchModel(prev => ({...prev, value: event.target.value}))
    }

    const columnsWithoutAction =  OmitActionFromLiteral(columns);

    const handleCloseSnackbar = () => setSnackbar(null);

    function OmitActionFromLiteral<T extends Record<string | symbol, any>>(object: GridColDef<T>[]): (keyof T)[] {
        // @ts-ignore
        return object.reduce<keyof T>((acc, curr) => curr.field !== 'actions' ? [...acc, curr.field] : acc, []);
    }

    const onFilterChange = (model: GridFilterModel, details: GridCallbackDetails<"filter">) => {
        if (details.reason && details.reason !== 'deleteFilterItem'){
            const filter = model.items[0];
            const operator = filter.operator as IOperatorMark;
            const value = filter.value as string || [];
            const field = filter.field as keyof TTableModels;

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

    return (
        <>
            <Typography variant="h2">
                Hostels
            </Typography>
            {
                showAddForm && (
                <form onSubmit={onSubmit}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: theme.spacing(2), maxWidth: "400px"}}>
                        {
                            fieldsToAdd
                        }
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
                    <TextField 
                        id="table-search" 
                        label="Поиск" 
                        value={searchModel} 
                        onChange={onChangeSearchText} 
                        size="small" 
                        type="search" 
                    />
                    по
                    <FormControl>
                        <InputLabel id="searchFieldSelect">Поле</InputLabel>
                        <Select
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
                    loading={!dataTable && isGetHostelsLoading}
                    columns={columns} 
                    rows={dataTable?.rows || []} 
                    rowCount={dataTable ? dataTable?.count-1 : 0}
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