export interface IUserData {
    _id: string;
    userName: string;
    email: string;
    mobileNumber: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    status: string;
    image: Image;
    address: string;
    createdAt: string;
    updatedAt: string;
    wishlist: string[];
    products: Product[];
    id: string;
}

export interface Product {
    _id: string;
    title: string;
    description: string;
    imageCover: Image;
    subImages: Image[];
    price: number;
    discount: number;
    stock: number;
    category: string;
    createdBy: string;
    rate: number;
    createdAt: string;
    updatedAt: string;
    finalPrice: number;
    id: string;
}

export interface Image {
    secure_url: string;
    public_id: string;
}

