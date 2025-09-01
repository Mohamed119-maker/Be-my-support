
export interface ICategory {
    _id: string;
    name: string;
    image: Image;
    createdBy: CreatedBy;
    slug: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

export interface CreatedBy {
    _id: string;
    userName: string;
    mobileNumber: string;
    image: Image;
    address: string;
    id: string;
}

export interface Image {
    secure_url: string;
    public_id: string;
}