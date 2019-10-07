import { User } from "./user";

export interface SellOffer {
    id?: number,
    number_of_tokens: string,
    sell_price_per_token: string,
    offer_starts_utc_date: string,
    offer_expires_at_utc_date: string,
    project: string,
    seller: User,
    remaining_tokens: number
};

export interface SellToExistingOffer {
    id?: number,
    number_of_tokens: string,
    sell_price_per_token: string,
    offer_starts_utc_date: string,
    offer_expires_at_utc_date: string,
    project: string,
    seller: User,
    remaining_tokens: number,
    selling_offer,
};