import { AlertProps, TextField } from "@mui/material";
import { GridActionsCellItem, GridColDef, GridDeleteIcon, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { IFilter, ISearch } from "Common/Models";
import { TablePage } from "Modules/Tables/Components/TablePage";
import { IStaff } from "Modules/Tables/Models/models";
import { parseGridSortModel } from "Modules/Tables/Utils/parseGridSortModel";
import { FormEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetStaff } from "./Utils/Queries/getStaff";
import { useEditStaff } from "./Utils/Queries/editStaff";
import { useDeleteStaff } from "./Utils/Queries/deleteStaff";
import { useAddStaff } from "./Utils/Queries/addStaff";

const getDataGridColumns = (handleDeleteClick:any): GridColDef<IStaff>[] => [
    { 
        field: 'hostel_id',
        headerName: 'hostel_id',
        editable: true,
        type: 'number',
        width: 80,
        sortable: true,
    },
    { 
        field: 'first_name',
        headerName: 'first_name',    
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'second_name',
        headerName: 'second_name',   
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'third_name',
        headerName: 'third_name',   
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
        field: 'post',
        headerName: 'post',  
        editable: true, 
        type: 'number',
        width: 80,
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

export const StaffTablePage = () => {
    const paginationModelState = useState<GridPaginationModel>({page: 0, pageSize: PAGE_LIMIT_DEFAULT});
    const [paginationModel] = paginationModelState;

    const orderModelState = useState<GridSortModel>([]);
    const [orderModel] = orderModelState;

    const searchModelState = useState<ISearch<keyof IStaff>>({field: "hostel_id", value: ""});
    const [searchModel] = searchModelState;

    const filterModelState = useState<IFilter<keyof IStaff> | undefined>(undefined);
    const [filterModel] = filterModelState;

    const snackbarState = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    const [snackbar, setSnackbar] = snackbarState;

    const [forManualUpdateQuery, setForManualUpdateQuery] = useState<boolean>(true);
    let { data, isLoading: isGetHostelsLoading } = useGetStaff({
        limit: paginationModel.pageSize, 
        offset: paginationModel.pageSize * paginationModel.page, 
        order: parseGridSortModel(orderModel),
        search: searchModel,
        filter: filterModel,
        forManualUpdateQuery
    });
    
    const onEditError = async () => { setSnackbar({ children: 'Не удалось изменить строку', severity: 'error' }); setForManualUpdateQuery((v)=>!v);};
    const onSuccesEdit = () => setSnackbar({ children: 'Строка успешно изменилась', severity: 'success' });
    
    const {mutate: editStaff} = useEditStaff(onEditError, onSuccesEdit);
    const {mutate: deleteStaff} = useDeleteStaff();
    const {mutate: addStaff} = useAddStaff();

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        handleSubmit((body) => addStaff(body))();
    }; 

    const processRowUpdate = (updatedRow: IStaff, originalRow: IStaff) => {
        editStaff({body: updatedRow, tin: originalRow.tin});
        return updatedRow;
    };

    const deleteHandler = (row: IStaff) => {
        deleteStaff(row.tin);
    };

    const columns = getDataGridColumns(deleteHandler);

    const { register, handleSubmit } = useForm<Omit<IStaff, "id">>()

    return (
        <TablePage<IStaff> 
            title="Staff"
            columns={columns}
            fieldsToAdd={(
                <>
                    <TextField label="Отель" size="small" {...register('hostel_id')}/>
                    <TextField label="Имя" size="small" {...register('first_name')}/>
                    <TextField label="Фамилия" size="small" {...register('second_name')}/>
                    <TextField label="Отчество" size="small" {...register('third_name')}/>
                    <TextField label="Инн" size="small" {...register('tin')}/>
                    <TextField label="Должность" size="small" {...register('post')}/>
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
            getRowId={(row) => row.tin}
        />
    )
}
