declare namespace EventTypes {
  interface EventRecord {
    id: number;
    title: string;
    start_time: Date;
    end_time: Date;
    address: string;
    city: string;
    description: string;
    venue_id: number;
    category_id: number;
    created_by: number;
    hour_before_notif: number;
    Users?: UserTypes.UserRecord[];
  }
}