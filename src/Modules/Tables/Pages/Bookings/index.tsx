import { AlertProps, TextField } from "@mui/material";
import { GridActionsCellItem, GridColDef, GridDeleteIcon, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { IFilter, ISearch } from "Common/Models";
import { TablePage } from "Modules/Tables/Components/TablePage";
import { IBooking } from "Modules/Tables/Models/models";
import { parseGridSortModel } from "Modules/Tables/Utils/parseGridSortModel";
import { FormEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetBookings } from "./Utils/Queries/getBookings";
import { useEditBooking } from "./Utils/Queries/editBooking";
import { useDeleteBooking } from "./Utils/Queries/deleteBooking";
import { useAddBooking } from "./Utils/Queries/addBooking";

const getDataGridColumns = (handleDeleteClick:any): GridColDef<IBooking>[] => [
    { 
        field: 'id',
        headerName: 'id',   
        type: 'number',
        width: 80,
        sortable: true,
    },
    { 
        field: 'hotel_room_id',
        headerName: 'hotel_room_id',    
        type: 'number',
        editable: true,
        width: 80,
        sortable: true,
    },
    { 
        field: 'hotel_id',
        headerName: 'hotel_id',    
        type: 'number',
        editable: true,
        width: 80,
        sortable: true,
    },
    { 
        field: 'arrival_date',
        headerName: 'arrival_date',  
        valueGetter: (value) => {
            return new Date(value.value)
        }, 
        type: 'date',
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'departure_date',
        headerName: 'departure_date',   
        valueGetter: (value) => {
            return new Date(value.value)
        },
        type: 'date',
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'visitor_id',
        headerName: 'visitor_id',    
        type: 'number',
        editable: true,
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

export const BookingsTablePage = () => {
    const paginationModelState = useState<GridPaginationModel>({page: 0, pageSize: PAGE_LIMIT_DEFAULT});
    const [paginationModel] = paginationModelState;

    const orderModelState = useState<GridSortModel>([]);
    const [orderModel] = orderModelState;

    const searchModelState = useState<ISearch<keyof IBooking>>({field: "id", value: ""});
    const [searchModel] = searchModelState;

    const filterModelState = useState<IFilter<keyof IBooking> | undefined>(undefined);
    const [filterModel] = filterModelState;

    const snackbarState = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    const [snackbar, setSnackbar] = snackbarState;

    const [forManualUpdateQuery, setForManualUpdateQuery] = useState<boolean>(true);
    let { data, isLoading: isGetHostelsLoading } = useGetBookings({
        limit: paginationModel.pageSize, 
        offset: paginationModel.pageSize * paginationModel.page, 
        order: parseGridSortModel(orderModel),
        search: searchModel,
        filter: filterModel,
        forManualUpdateQuery
    });
    
    const onEditError = async () => { setSnackbar({ children: 'Не удалось изменить строку', severity: 'error' }); setForManualUpdateQuery((v)=>!v);};
    const onSuccesEdit = () => setSnackbar({ children: 'Строка успешно изменилась', severity: 'success' });
    
    const {mutate: editVisitor} = useEditBooking(onEditError, onSuccesEdit);
    const {mutate: deleteVisitor} = useDeleteBooking();
    const {mutate: addVisitor} = useAddBooking();

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        handleSubmit((body) => addVisitor(body))();
    }; 

    const processRowUpdate = (updatedRow: IBooking, originalRow: IBooking) => {
        editVisitor({body: updatedRow, id: originalRow.id});
        return updatedRow;
    };

    const deleteHandler = (row: IBooking) => {
        deleteVisitor(row.id);
    };

    const columns = getDataGridColumns(deleteHandler);

    const { register, handleSubmit } = useForm<IBooking>()

    return (
        <TablePage<IBooking> 
            title="Hotel rooms"
            columns={columns}
            fieldsToAdd={(
                <>
                    <TextField label="Комната" size="small" {...register('hotel_room_id')}/>
                    <TextField label="Отель" size="small" {...register('hotel_id')}/>
                    <TextField type="date" label="Дата прибытия" {...register('arrival_date')}/>
                    <TextField type="date" label="Дата отбытия" size="small" {...register('departure_date')}/>
                    <TextField label="Посетитель" size="small" {...register('visitor_id')}/>
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
            getRowId={(row) => row.hotel_id}
        />
    )
}
