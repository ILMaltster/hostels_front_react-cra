export interface IPaginationModel<T>{
    rows: T[];
    count: number;
    limit: number;
}