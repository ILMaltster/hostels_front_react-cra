import { AlertProps, Box, FormControl, TextField, Typography } from "@mui/material";
import { GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { useState } from "react";
import { useGetProfitableRooms } from "./Utils/Queries/getFrequentCustomer";
import { Table } from "Common/Components/Table";

const getDataGridColumns = (): GridColDef[] => [
    { 
        field: 'sum',
        headerName: 'sum',   
        type: 'number',
        width: 80,
    },
    { 
        field: 'description',
        headerName: 'description',    
        flex: 0.3,
    },
    { 
        field: 'hotel_room_id',
        headerName: 'hotel_room_id',    
        type: 'number',
        width: 80,
    },
    { 
        field: 'hotel_id',
        headerName: 'hotel_id',    
        type: 'number',
        flex: 0.3,
    },
]

export const ProfitableRoomsTablePage = () => {
    const paginationModelState = useState<GridPaginationModel>({page: 0, pageSize: PAGE_LIMIT_DEFAULT});
    const [paginationModel] = paginationModelState;

    const [filter, setFilter] = useState<{from: Date, to:Date}>({from: new Date(), to: new Date()});

    const snackbarState = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);

    let { data, isLoading: isGetHostelsLoading } = useGetProfitableRooms({
        limit: paginationModel.pageSize,
        offset: paginationModel.pageSize * paginationModel.page,
        filter: filter,
    });

    const onChangeFromFilter: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        console.log(event.target.value)
        setFilter((prev) => ({...prev, from: new Date(event.target.value)}));
    }
    const onChangeToFilter: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        setFilter((prev) => ({...prev, to: new Date(event.target.value)}));
    }

    const columns = getDataGridColumns();

    return (
        <>
            <Typography variant="h2">
                Прибыльные номера
            </Typography>
            <Box sx={{marginTop: 2}}>
                <FormControl sx={{flexDirection: "row", alignItems: 'center', gap: 2}}>
                    <TextField 
                        label="from" 
                        value={filter.from.toISOString().substr(0, 10)} 
                        onChange={onChangeFromFilter} 
                        size="small" 
                        type="date" 
                    />
                    <TextField 
                        label="to" 
                        value={filter.to.toISOString().substr(0, 10)} 
                        onChange={onChangeToFilter} 
                        size="small" 
                        type="date" 
                    />
                </FormControl>
            </Box>
            <Table 
                columns={columns}
                isGetHostelsLoading={isGetHostelsLoading}
                paginationModelState={paginationModelState}
                snackbarState={snackbarState}
                dataTable={data}
                getRowId={(row) => row.hotel_room_id + row.hotel_id}
            />
        </>
    )
}
