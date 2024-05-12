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
    first_name: string,
    second_name: string,
    third_name: string,
    tin: string,
    post: number,
}

export interface IVisitor {
    id: number,
    additional_info: string;
    rating: number;
    phone: string;
    first_name: string;
    second_name: string;
    third_name: string;
}

export interface IHotelRoom {
    hotel_room_number: number;    
    hotel_id: number;    
    description: string;    
    capacity: number;    
    price_per_day: string;    
    active: boolean;
}

export interface IBooking {
    id: number;
    hotel_room_id: number;
    hotel_id: number;
    arrival_date: string;
    departure_date: string;
    visitor_id: number;
}