export type Event = {
    id: string,
    name: string,
    date: string,
    start_time: string,
    end_time: string,
    description?: string
}

export type AllEvents = {
    [date: string]: Event[]
};
