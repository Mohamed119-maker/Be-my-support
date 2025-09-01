
export interface IUsers {
    _id: string;
    userName: string;
    email: string;
    password: string;
    mobileNumber: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    status: string;
    address: string;
    otpCode: null;
    otpExpire: null;
    createdAt: string;
    updatedAt: string;
    image: Image;
    wishlist: string[];
    id: string;
}

export interface Image {
    secure_url: string;
    public_id: string;
}