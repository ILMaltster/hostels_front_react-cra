import { AlertProps, TextField } from "@mui/material";
import { GridActionsCellItem, GridColDef, GridDeleteIcon, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { IFilter, ISearch } from "Common/Models";
import { TablePage } from "Modules/Tables/Components/TablePage";
import { IHotelRoom } from "Modules/Tables/Models/models";
import { parseGridSortModel } from "Modules/Tables/Utils/parseGridSortModel";
import { FormEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetHotelRooms } from "./Utils/Queries/getHotelRooms";
import { useEditHotelRoom } from "./Utils/Queries/editHotelRoom";
import { useDeleteHotelRoom } from "./Utils/Queries/deleteHotelRoom";
import { useAddHotelRoom } from "./Utils/Queries/addHotelRoom";

const getDataGridColumns = (handleDeleteClick:any): GridColDef<IHotelRoom>[] => [
    { 
        field: 'hotel_room_number',
        headerName: 'hotel_room_number',   
        type: 'number',
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
        field: 'description',
        headerName: 'description',   
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'capacity',
        headerName: 'capacity',   
        type: 'number',
        editable: true,
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'price_per_day',
        headerName: 'price_per_day',
        type: 'number',
        editable: true,   
        flex: 0.3,
        sortable: true,
    },
    { 
        field: 'active',
        headerName: 'active',  
        type: 'boolean',
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

export const HotelRoomsTablePage = () => {
    const paginationModelState = useState<GridPaginationModel>({page: 0, pageSize: PAGE_LIMIT_DEFAULT});
    const [paginationModel] = paginationModelState;

    const orderModelState = useState<GridSortModel>([]);
    const [orderModel] = orderModelState;

    const searchModelState = useState<ISearch<keyof IHotelRoom>>({field: "capacity", value: ""});
    const [searchModel] = searchModelState;

    const filterModelState = useState<IFilter<keyof IHotelRoom> | undefined>(undefined);
    const [filterModel] = filterModelState;

    const snackbarState = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);
    const [snackbar, setSnackbar] = snackbarState;

    const [forManualUpdateQuery, setForManualUpdateQuery] = useState<boolean>(true);
    let { data, isLoading: isGetHostelsLoading } = useGetHotelRooms({
        limit: paginationModel.pageSize, 
        offset: paginationModel.pageSize * paginationModel.page, 
        order: parseGridSortModel(orderModel),
        search: searchModel,
        filter: filterModel,
        forManualUpdateQuery
    });
    
    const onEditError = async () => { setSnackbar({ children: 'Не удалось изменить строку', severity: 'error' }); setForManualUpdateQuery((v)=>!v);};
    const onSuccesEdit = () => setSnackbar({ children: 'Строка успешно изменилась', severity: 'success' });
    
    const {mutate: editVisitor} = useEditHotelRoom(onEditError, onSuccesEdit);
    const {mutate: deleteVisitor} = useDeleteHotelRoom();
    const {mutate: addVisitor} = useAddHotelRoom();

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        handleSubmit((body) => addVisitor(body))();
    }; 

    const processRowUpdate = (updatedRow: IHotelRoom, originalRow: IHotelRoom) => {
        editVisitor({body: updatedRow, identityObj: {
            hotel_id: originalRow.hotel_id, 
            hotel_room_number: originalRow.hotel_room_number
        }});
        return updatedRow;
    };

    const deleteHandler = (row: IHotelRoom) => {
        deleteVisitor({hotel_id: row.hotel_id, hotel_room_number: row.hotel_room_number});
    };

    const columns = getDataGridColumns(deleteHandler);

    const { register, handleSubmit } = useForm<IHotelRoom>()

    return (
        <TablePage<IHotelRoom> 
            title="Hotel rooms"
            columns={columns}
            fieldsToAdd={(
                <>
                    <TextField label="Номер комнаты" size="small" {...register('hotel_room_number')}/>
                    <TextField label="Номер отеля" size="small" {...register('hotel_id')}/>
                    <TextField label="Описание" size="small" {...register('description')}/>
                    <TextField label="Вместимость" size="small" {...register('capacity')}/>
                    <TextField label="Цена за сутки" size="small" {...register('price_per_day')}/>
                    <TextField label="Доступность" size="small" {...register('active')}/>
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
