export interface IHostel {
    id: number,
    name: string,
    tin: string,
    address: string,
}

export interface IPost {
    id: number,
    name: string,
}

export interface IStaff {
    hostel_id: number,
    name: string,
    second_name: string,
    third_name: string,
    tin: string,
    post: number,
}
