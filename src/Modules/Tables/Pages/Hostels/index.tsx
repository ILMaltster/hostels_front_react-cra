import { AlertProps, TextField } from "@mui/material";
import { GridActionsCellItem, GridColDef, GridDeleteIcon, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { IFilter, ISearch } from "Common/Models";
import { TablePage } from "Modules/Tables/Components/TablePage";
import { IHostel } from "Modules/Tables/Models/hostels";
import { useAddHostel } from "Modules/Tables/Utils/Queries/addHostel";
import { useDeleteHostel } from "Modules/Tables/Utils/Queries/deleteHostel";
import { useEditHostel } from "Modules/Tables/Utils/Queries/editHostel";
import { useGetHostels } from "Modules/Tables/Utils/Queries/getHostels";
import { parseGridSortModel } from "Modules/Tables/Utils/parseGridSortModel";
import { FormEventHandler, useState } from "react";
import { useForm } from "react-hook-form";

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
                icon={<GridDeleteIcon />}
                label="Delete"
                onClick={()=>handleDeleteClick(row)}
                color="inherit"
              />,
            ];
          },
    },
]

export const HostelsTablePage = () => {
    const paginationModelState = useState<GridPaginationModel>({page: 0, pageSize: PAGE_LIMIT_DEFAULT});
    const [paginationModel, setPageNumber] = paginationModelState;

    const orderModelState = useState<GridSortModel>([]);
    const [orderModel, setOrderModel] = orderModelState;

    const searchModelState = useState<ISearch<keyof IHostel>>({field: "id", value: ""});
    const [searchModel, setSearchModel] = searchModelState;

    const filterModelState = useState<IFilter<keyof IHostel> | undefined>(undefined);
    const [filterModel, setFilterModel] = filterModelState;

    const snackbarState = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    const [snackbar, setSnackbar] = snackbarState;

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

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        handleSubmit((body) => addHostel(body))();
    }; 

    const processRowUpdate = (updatedRow: IHostel, originalRow: IHostel) => {
        editHostel({body: updatedRow, tin: originalRow.tin});
        return updatedRow;
    };

    const deleteHandler = (row: IHostel) => {
        deleteHostel(row.tin);
    };

    const columns = getDataGridColumns(deleteHandler);

    const { register, handleSubmit } = useForm<Omit<IHostel, "id">>()

    return (
        <TablePage 
            columns={columns}
            fieldsToAdd={(
                <>
                    <TextField label="Имя" size="small" {...register('name')}/>
                    <TextField label="ИНН" size="small" {...register('tin')}/>
                    <TextField label="Адрес" size="small" {...register('address')}/>
                </>
            )}
            filterModelState={filterModelState}
            isGetHostelsLoading={isGetHostelsLoading}
            onSubmit={onSubmit}
            orderModelState={orderModelState}
            paginationModelState={paginationModelState}
            processRowUpdate={processRowUpdate}
            searchModelState={searchModelState}
            snackbarState={snackbarState}
            dataTable={data}
        />
    )
}
