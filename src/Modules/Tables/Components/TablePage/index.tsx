import { AlertProps, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography, useTheme } from "@mui/material"
import {GridColDef, GridPaginationModel, GridRowIdGetter, GridSortModel, GridValidRowModel } from "@mui/x-data-grid"
import { IFilter, IPaginationModel, ISearch } from "Common/Models";
import { TTableModels } from "Modules/Tables/Models/general";
import { FormEventHandler, ReactElement, useState } from "react";
import { Table } from "../../../../Common/Components/Table";

interface ITablePageProps<T extends GridValidRowModel = GridValidRowModel>{
    title: string;
    columns: GridColDef[];
    onSubmit: FormEventHandler<HTMLFormElement>;
    searchModelState: [ISearch, React.Dispatch<React.SetStateAction<ISearch>>];
    fieldsToAdd: ReactElement;
    dataTable?: IPaginationModel;
    isGetHostelsLoading: boolean;
    snackbarState: [Pick<AlertProps, "children" | "severity"> | null, React.Dispatch<React.SetStateAction<Pick<AlertProps, "children" | "severity"> | null>>];
    paginationModelState: [GridPaginationModel, React.Dispatch<React.SetStateAction<GridPaginationModel>>],
    processRowUpdate: (updatedRow: any, originalRow: any) => any,
    orderModelState: [GridSortModel, React.Dispatch<React.SetStateAction<GridSortModel>>],
    filterModelState: [IFilter | undefined, React.Dispatch<React.SetStateAction<IFilter | undefined>>],
    getRowId?: GridRowIdGetter<T> | undefined
}

export function TablePage<T extends GridValidRowModel = GridValidRowModel> (
    { 
        title,
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
        getRowId,
    }: ITablePageProps<T>) {
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const theme = useTheme()
    const [searchModel, setSearchModel] = searchModelState;

    const onChangeSearchSelect = (event: SelectChangeEvent) => {
        const field = event.target.value as keyof TTableModels;
        setSearchModel(prev => ({...prev, field}))
    }

    const onChangeSearchText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchModel(prev => ({...prev, value: event.target.value}))
    }

    function omitActionFromLiteral<T extends Record<string | symbol, any>>(object: GridColDef<T>[]): (keyof T)[] {
        // @ts-ignore
        return object.reduce<keyof T>((acc, curr) => curr.field !== 'actions' ? [...acc, curr.field] : acc, []);
    }

    const columnsWithoutAction =  omitActionFromLiteral<TTableModels>(columns);

    return (
        <>
            <Typography variant="h2">
                {title}
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
                        value={searchModel.value} 
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
                                columnsWithoutAction.map((field) => (
                                    <MenuItem value={field}>{field}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </FormControl>
            </Box>
            <Table
                columns={columns}
                dataTable={dataTable}
                filterModelState={filterModelState}
                isGetHostelsLoading={isGetHostelsLoading}
                orderModelState={orderModelState}
                paginationModelState={paginationModelState}
                processRowUpdate={processRowUpdate}
                snackbarState={snackbarState}
                getRowId={getRowId}
            />
            
        </>
    )
}