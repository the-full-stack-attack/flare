type VenueTag = {
    tag: string;
    source: 'google' | 'foursquare';
    count: number;
}

type FSQData = {
    name?: string;
    description?: string;
    location?: {
        region?: string;
        address?: string;
        formatted_address?: string;
        dma?: string;
    };
    categories?: Array<{
        name?: string;
        short_name?: string;
    }>;
    tel?: string;
    website?: string;
    rating?: number;
    stats?: {
        total_ratings?: number;
    };
    price?: number | string;
    photos?: Array<{
        prefix?: string;
        suffix?: string;
    }>;
    tastes?: string[];
    features?: {
        food_and_drink?: {
            alcohol?: Record<string, boolean>;
        };
    };
    additionalInfo?: {
        Accessibility?: Array<Record<string, boolean>>;
    };
};

type GoogleData = {
    title?: string;
    description?: string;
    categoryName?: string;
    street?: string;
    city?: string;
    state?: string;
    phone?: string;
    phoneUnformatted?: string;
    website?: string;
    totalScore?: number;
    reviewsCount?: number;
    price?: string;
    imageUrl?: string;
    popularTimesHistogram?: Record<string, Array<{
        hour?: number;
        occupancyPercent?: number;
    }>>;
    reviewsTags?: Array<{
        title?: string;
        count?: number;
    }>;
    placesTags?: Array<{
        title?: string;
        count?: number;
    }>;
    categories?: string[];
    additionalInfo?: {
        Highlights?: Record<string, boolean>;
        Offerings?: Record<string, boolean>;
        Accessibility?: Array<Record<string, boolean>>;
        Amenities?: Record<string, boolean>;
    };
};

type AlcoholData = {
    [key: string]: boolean | string;
};

type VenueImage = {
    path: string;
    source: 'google' | 'foursquare';
}

type VenueType = {
    id: number | null;
    name?: string | null;
    description?: string | null;
    category?: string | null;
    street_address?: string | null;
    city_name?: string | null;
    state_name?: string | null;
    phone?: string | null;
    website?: string | null;
    rating?: string | number | null | undefined;
    total_reviews?: number | null;
    pricing?: string | null
    popularTime?: Date | null;
    peak_hour?: Date | null;
    wheelchair_accessible?: boolean | null;
    serves_alcohol?: boolean | null;
    fsq_id?: string | null;
    google_place_id?: string | null;
};


export { type VenueType, type VenueImage, type AlcoholData, type GoogleData, type FSQData, type VenueTag, }