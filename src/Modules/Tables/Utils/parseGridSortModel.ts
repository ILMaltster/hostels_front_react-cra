import { GridSortModel } from "@mui/x-data-grid";
import { IOrder } from "Common/Models";

export const parseGridSortModel = ([model]: GridSortModel): IOrder | undefined => {
    if(model && (model.sort === 'asc' || model.sort === 'desc'))
        return {field: model.field, type: model.sort}
    else return undefined;
}