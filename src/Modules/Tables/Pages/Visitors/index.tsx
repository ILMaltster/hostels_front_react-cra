import { AlertProps, TextField } from "@mui/material";
import { GridActionsCellItem, GridColDef, GridDeleteIcon, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { IFilter, ISearch } from "Common/Models";
import { TablePage } from "Modules/Tables/Components/TablePage";
import { IStaff, IVisitor } from "Modules/Tables/Models/models";
import { parseGridSortModel } from "Modules/Tables/Utils/parseGridSortModel";
import { FormEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetVisitors } from "./Utils/Queries/getStaff";
import { useEditVisitor } from "./Utils/Queries/editStaff";
import { useDeleteVisitor } from "./Utils/Queries/deleteStaff";
import { useAddVisitor } from "./Utils/Queries/addStaff";

const getDataGridColumns = (handleDeleteClick:any): GridColDef<IVisitor>[] => [
    { 
        field: 'id',
        headerName: 'id',   
        type: 'number',
        width: 80,
        sortable: true,
    },
    { 
        field: 'additional_info',
        headerName: 'additional_info',    
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'rating',
        headerName: 'rating',   
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'phone',
        headerName: 'phone',   
        editable: true,
        flex: 0.3,
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

export const VisitorsTablePage = () => {
    const paginationModelState = useState<GridPaginationModel>({page: 0, pageSize: PAGE_LIMIT_DEFAULT});
    const [paginationModel] = paginationModelState;

    const orderModelState = useState<GridSortModel>([]);
    const [orderModel] = orderModelState;

    const searchModelState = useState<ISearch<keyof IVisitor>>({field: "id", value: ""});
    const [searchModel] = searchModelState;

    const filterModelState = useState<IFilter<keyof IVisitor> | undefined>(undefined);
    const [filterModel] = filterModelState;

    const snackbarState = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    const [snackbar, setSnackbar] = snackbarState;

    const [forManualUpdateQuery, setForManualUpdateQuery] = useState<boolean>(true);
    let { data, isLoading: isGetHostelsLoading } = useGetVisitors({
        limit: paginationModel.pageSize, 
        offset: paginationModel.pageSize * paginationModel.page, 
        order: parseGridSortModel(orderModel),
        search: searchModel,
        filter: filterModel,
        forManualUpdateQuery
    });
    
    const onEditError = async () => { setSnackbar({ children: 'Не удалось изменить строку', severity: 'error' }); setForManualUpdateQuery((v)=>!v);};
    const onSuccesEdit = () => setSnackbar({ children: 'Строка успешно изменилась', severity: 'success' });
    
    const {mutate: editVisitor} = useEditVisitor(onEditError, onSuccesEdit);
    const {mutate: deleteVisitor} = useDeleteVisitor();
    const {mutate: addVisitor} = useAddVisitor();

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        handleSubmit((body) => addVisitor(body))();
    }; 

    const processRowUpdate = (updatedRow: IVisitor, originalRow: IVisitor) => {
        editVisitor({body: updatedRow, id: originalRow.id});
        return updatedRow;
    };

    const deleteHandler = (row: IVisitor) => {
        deleteVisitor(row.id);
    };

    const columns = getDataGridColumns(deleteHandler);

    const { register, handleSubmit } = useForm<Omit<IVisitor, "id">>()

    return (
        <TablePage<IVisitor> 
            title="Visitors"
            columns={columns}
            fieldsToAdd={(
                <>
                    <TextField label="Имя" size="small" {...register('first_name')}/>
                    <TextField label="Фамилия" size="small" {...register('second_name')}/>
                    <TextField label="Отчество" size="small" {...register('third_name')}/>
                    <TextField label="Номер телефона" size="small" {...register('phone')}/>
                    <TextField label="Рейтинг" size="small" {...register('rating')}/>
                    <TextField label="Доп. информация" size="small" {...register('additional_info')}/>
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
