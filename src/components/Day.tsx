import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { dayAtom, eventsAtom, showCreateEventAtom } from "@/lib/atoms";
import { PlusCircle, XCircle } from "lucide-react";
import { numericToTextDate } from "@/lib/utils";
import { useEffect } from "react";

type DayProps = {
    open: boolean,
    onOpenChange: () => void,
};

export default function Day(props: DayProps) {
    const [events, setEvents] = useAtom(eventsAtom);
    const day = useAtomValue(dayAtom);
    const setShowCreateEvent = useSetAtom(showCreateEventAtom);

    function handleAddEvent() {
        setShowCreateEvent(true);
    }

    function handleRemoveEvent(eventId: string) {
        setEvents((prevEvents) => {
            const updatedEvents = { ...prevEvents };
            updatedEvents[day.day] = updatedEvents[day.day].filter(
                (event) => event.id !== eventId
            );
            if (updatedEvents[day.day].length == 0)
                delete updatedEvents[day.day];
            return updatedEvents;
        });
    }

    useEffect(() => console.log(events), [events]);

    return (
        <Drawer open={props.open} onOpenChange={props.onOpenChange}>
            <DrawerContent className="bg-zinc-950 border-black text-white h-[700px]">
                <DrawerHeader className="text-left">
                    <DrawerTitle className="flex gap-3">
                        {numericToTextDate(day.day)}
                        <PlusCircle
                            className="text-zinc-400 cursor-pointer hover:text-white transition-colors ease-in-out"
                            onClick={handleAddEvent}
                        />
                    </DrawerTitle>
                    {Object.keys(events).length === 0 ? (
                        <DrawerDescription className="text-zinc-600">
                            No events for the day!
                        </DrawerDescription>
                    ) : null}
                </DrawerHeader>

                <div className="p-4">
                    {events[day.day] && events[day.day].length > 0 ? (
                        <ul className="space-y-4">
                            {events[day.day].map((event) => (
                                <li key={event.id} className="flex items-center justify-between">
                                    <div className="flex flex-col text-white">
                                        <span className="font-bold">{event.name}</span>
                                        <span className="text-sm text-zinc-400">{event.start_time} - {event.end_time}</span>
                                        {event.description && (
                                            <span className="text-xs text-zinc-500">{event.description}</span>
                                        )}
                                    </div>
                                    <XCircle
                                        className="text-red-500 cursor-pointer hover:text-red-400 transition-colors ease-in-out"
                                        onClick={() => handleRemoveEvent(event.id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

