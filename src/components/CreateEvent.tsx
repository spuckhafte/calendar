import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "./ui/dialog";
import { dayAtom, eventsAtom } from "@/lib/atoms";
import { numericToTextDate } from "@/lib/utils";
import { DialogTitle } from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { AllEvents, Event } from "@/types";
import { toast } from "sonner";
import { v4 } from "uuid";

type CreateEventProps = {
    open: boolean;
    onOpenChange: () => void;
};

export default function CreateEvent(props: CreateEventProps) {
    const setEvents = useSetAtom(eventsAtom);
    const [day, _setDay] = useAtom(dayAtom);

    const [name, setName] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [description, setDescription] = useState("");

    const dayString = numericToTextDate(day.day, true);
    
    const handleSaveEvent = () => {
        if (!name) {
            toast.error("Missing Name", {
                description: "Please provide a name for the event.",
                action: {
                    label: "OK",
                    onClick: () => console.log("OK clicked"),
                },
            });
            return;
        }

        if (!startTime) {
            toast.error("Missing Start Time", {
                description: "Please provide a start time for the event.",
                action: {
                    label: "OK",
                    onClick: () => console.log("OK clicked"),
                },
            });
            return;
        }

        if (!endTime) {
            toast.error("Missing End Time", {
                description: "Please provide an end time for the event.",
                action: {
                    label: "OK",
                    onClick: () => console.log("OK clicked"),
                },
            });
            return;
        }

        const newEvent: Event = {
            id: v4(),
            name,
            date: dayString,
            start_time: startTime,
            end_time: endTime,
            description,
        };

        setEvents((prevEvents: AllEvents) => {
            const existingEvents = prevEvents[day.day] || [];
            const hasConflict = existingEvents.some(event => {
                return (
                    (startTime >= event.start_time && startTime < event.end_time) ||
                    (endTime > event.start_time && endTime <= event.end_time) ||
                    (startTime <= event.start_time && endTime >= event.end_time)
                );
            });

            if (hasConflict) {
                toast.error("Time Conflict Detected", {
                    description: "This event overlaps with an existing event. Please choose a different time.",
                    action: {
                        label: "OK",
                        onClick: () => console.log("OK clicked"),
                    },
                });
                return prevEvents; // Do not close the form or update events
            }

            toast.success("Event Created", {
                description: `${name} on ${dayString} from ${startTime} to ${endTime} has been successfully created.`,
                action: {
                    label: "OK",
                    onClick: () => console.log("OK clicked"),
                },
            });

            return {
                ...prevEvents,
                [day.day]: [...existingEvents, newEvent],
            };
        });

        setName("");
        setStartTime("");
        setEndTime("");
        setDescription("");
        props.onOpenChange(); // This will only be called if there is no conflict
    };
   

    return (
        <Dialog open={props.open} onOpenChange={props.onOpenChange}>
            <DialogContent className="bg-zinc-900 text-white border-black">
                <DialogHeader>
                    <DialogTitle className="font-bold">New Event</DialogTitle>
                    <DialogDescription>{dayString}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-start gap-4">
                    
                    <div className="flex flex-col items-start gap-2 w-full">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-zinc-600"
                            placeholder="Event Name"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2 w-full">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                            id="start-time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border-zinc-600"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2 w-full">
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                            id="end-time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="border-zinc-600"
                        />
                    </div>

                    <div className="flex flex-col items-start gap-2 w-full">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Event Description (optional)"
                            className="border-zinc-600"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        className="bg-white text-black hover:bg-white hover:text-black"
                        type="button"
                        onClick={handleSaveEvent}
                    >
                        Save Event
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

