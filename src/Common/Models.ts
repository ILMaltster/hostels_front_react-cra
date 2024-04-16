export interface IPaginationModel<T>{
    rows: T[];
    count: number;
    limit: number;
}

export interface IOrder<T = any> {
    field: T;
    type: 'desc' | 'asc';
}

export interface ISearch<T extends string = any>{
    value: string;
    field: T;
}