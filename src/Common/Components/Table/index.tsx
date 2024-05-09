import { Alert, AlertProps, Snackbar, useTheme } from "@mui/material"
import { DataGrid, GridCallbackDetails, GridColDef, GridFilterModel, GridPaginationModel, GridRowIdGetter, GridSortModel, GridValidRowModel } from "@mui/x-data-grid"
import { GridInitialStateCommunity } from "@mui/x-data-grid/models/gridStateCommunity";
import { PAGE_LIMITS, PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { IFilter, IOperatorMark, IPaginationModel } from "Common/Models";
import { TTableModels } from "Modules/Tables/Models/general";

const tableInitialState: GridInitialStateCommunity = {
    pagination: {
        paginationModel: {
            pageSize: PAGE_LIMIT_DEFAULT
        }
    }
}

const notNeedValueOperators: Array<IOperatorMark> = ['isNotEmpty', 'isEmpty'];

interface ITableProps<T extends GridValidRowModel = GridValidRowModel>{
    columns: GridColDef[];
    dataTable?: IPaginationModel;
    isGetHostelsLoading: boolean;
    snackbarState: [Pick<AlertProps, "children" | "severity"> | null, React.Dispatch<React.SetStateAction<Pick<AlertProps, "children" | "severity"> | null>>];
    paginationModelState: [GridPaginationModel, React.Dispatch<React.SetStateAction<GridPaginationModel>>],
    orderModelState?: [GridSortModel, React.Dispatch<React.SetStateAction<GridSortModel>>],
    filterModelState?: [IFilter | undefined, React.Dispatch<React.SetStateAction<IFilter | undefined>>],
    processRowUpdate?: (updatedRow: any, originalRow: any) => any,
    getRowId?: GridRowIdGetter<T> | undefined
}

export function Table<T extends GridValidRowModel = GridValidRowModel> (
    { 
        columns,
        dataTable,
        isGetHostelsLoading,
        snackbarState,
        paginationModelState,
        orderModelState,
        filterModelState,
        processRowUpdate,
        getRowId,
    }: ITableProps<T>) {
    const theme = useTheme()
    const [paginationModel, setPageNumber] = paginationModelState;
    const [orderModel, setOrderModel] = orderModelState || [];
    const [, setFilterModel] = filterModelState || [];
    const [snackbar, setSnackbar] = snackbarState;

    const onPaginationModelChange = (model: GridPaginationModel) => {
        setPageNumber(model);
    };

    const onSortModelChange = (model: GridSortModel) => {
        if(setOrderModel)
            setOrderModel(model);
    }


    const onFilterChange = (model: GridFilterModel, details: GridCallbackDetails<"filter">) => {
        if(!setFilterModel) return;
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

    const handleCloseSnackbar = () => setSnackbar(null);


    return (
        <>
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
                    sortingMode="server"
                    onSortModelChange={onSortModelChange}
                    sortModel={orderModel}
                    paginationModel={paginationModel}
                    filterMode="server"
                    onFilterModelChange={onFilterChange}
                    processRowUpdate={processRowUpdate}
                    getRowId={getRowId}
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