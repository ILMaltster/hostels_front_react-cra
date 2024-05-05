import { AlertProps, TextField } from "@mui/material";
import { GridActionsCellItem, GridColDef, GridDeleteIcon, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { IFilter, ISearch } from "Common/Models";
import { TablePage } from "Modules/Tables/Components/TablePage";
import { IPost } from "Modules/Tables/Models/models";
import { useGetHostels } from "Modules/Tables/Pages/Hostels/Utils/Queries/getHostels";
import { parseGridSortModel } from "Modules/Tables/Utils/parseGridSortModel";
import { FormEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { useEditPost } from "./Utils/Queries/editPost";
import { useDeletePost } from "./Utils/Queries/deletePost";
import { useAddPost } from "./Utils/Queries/addPost";

const getDataGridColumns = (handleDeleteClick:any): GridColDef<IPost>[] => [
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
    const [paginationModel] = paginationModelState;

    const orderModelState = useState<GridSortModel>([]);
    const [orderModel] = orderModelState;

    const searchModelState = useState<ISearch<keyof IPost>>({field: "id", value: ""});
    const [searchModel] = searchModelState;

    const filterModelState = useState<IFilter<keyof IPost> | undefined>(undefined);
    const [filterModel] = filterModelState;

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
    
    const {mutate: editHostel} = useEditPost(onEditError, onSuccesEdit);
    const {mutate: deleteHostel} = useDeletePost();
    const {mutate: addHostel} = useAddPost();

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        handleSubmit((body) => addHostel(body))();
    }; 

    const processRowUpdate = (updatedRow: IPost, originalRow: IPost) => {
        editHostel({body: updatedRow, id: originalRow.id});
        return updatedRow;
    };

    const deleteHandler = (row: IPost) => {
        deleteHostel(row.id);
    };

    const columns = getDataGridColumns(deleteHandler);

    const { register, handleSubmit } = useForm<Omit<IPost, "id">>()

    return (
        <TablePage 
            title="Posts"
            columns={columns}
            fieldsToAdd={(
                <>
                    <TextField label="ИНН" size="small" {...register('name')}/>
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
