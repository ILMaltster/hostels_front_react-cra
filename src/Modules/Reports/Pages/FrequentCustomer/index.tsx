import { AlertProps, Box, FormControl, TextField, Typography } from "@mui/material";
import { GridColDef, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { PAGE_LIMIT_DEFAULT } from "Common/Consts";
import { useState } from "react";
import { useGetFrequentCustomer } from "./Utils/Queries/getFrequentCustomer";
import { Table } from "Common/Components/Table";

const getDataGridColumns = (): GridColDef[] => [
    { 
        field: 'visitor_id',
        headerName: 'visitor_id',   
        type: 'number',
        width: 80,
    },
    { 
        field: 'fio',
        headerName: 'fio',    
        type: 'number',
        flex: 0.3,
    },
    { 
        field: 'orders',
        headerName: 'orders',    
        type: 'number',
        width: 80,
    },
    { 
        field: 'sum',
        headerName: 'sum',    
        type: 'number',
        flex: 0.3,
    },
]

export const FrequentCustomerTablePage = () => {
    const paginationModelState = useState<GridPaginationModel>({page: 0, pageSize: PAGE_LIMIT_DEFAULT});
    const [paginationModel] = paginationModelState;

    const [hostelId, setHostelId] = useState<number | string>('');;

    const snackbarState = useState<Pick<
        AlertProps,
        'children' | 'severity'
    > | null>(null);

    let { data, isLoading: isGetHostelsLoading } = useGetFrequentCustomer({
        limit: paginationModel.pageSize, 
        offset: paginationModel.pageSize * paginationModel.page, 
        hostelId: hostelId,
    });

    const onChangeSearchText: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        setHostelId(event.target.value);
    }

    const columns = getDataGridColumns();

    return (
        <>
            <Typography variant="h2">
                Постоянные покупатели
            </Typography>
            <Box>
                {
                    <Typography sx={{marginBottom: 1, color: '#d50000', opacity: !hostelId ? 1 : 0}}>
                        Необходимо заполнить поля
                    </Typography>
                }
                <FormControl sx={{flexDirection: "row", alignItems: 'center', gap: 2}}>
                    <TextField 
                        id="table-search" 
                        label="HostelId" 
                        value={hostelId} 
                        onChange={onChangeSearchText} 
                        size="small" 
                        type="search" 
                    />
                </FormControl>
            </Box>
            <Table 
                columns={columns}
                isGetHostelsLoading={isGetHostelsLoading}
                paginationModelState={paginationModelState}
                snackbarState={snackbarState}
                dataTable={data}
                getRowId={(row) => row.visitor_id}
            />
        </>
    )
}
