export interface Iproducts {
    _id: string;
    title: string;
    description: string;
    imageCover: ImageCover;
    subImages: ImageCover[];
    price: number;
    discount: number;
    stock: number;
    category: Category;
    createdBy: CreatedBy;
    updatedBy: string;
    rate: number;
    createdAt: string;
    updatedAt: string;
    finalPrice: number;
    id: string;
}

interface CreatedBy {
    _id: string;
    userName: string;
    mobileNumber: string;
    address: string;
    id: string;
}

interface Category {
    _id: string;
    name: string;
    image: ImageCover;
    createdBy: string;
    slug: string;
    id: string;
}

interface ImageCover {
    secure_url: string;
    public_id: string;
}