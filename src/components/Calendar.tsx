import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, add, isSameDay, isSameMonth } from "date-fns";
import { PaginationNext, PaginationPrevious } from "./ui/pagination";
import useInnerWidth from "@/lib/hooks/useInnerWidth";
import { getScreenSize } from "@/lib/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { dayAtom, eventsAtom } from "@/lib/atoms";
import { DownloadIcon } from "lucide-react";

export default function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const events = useAtomValue(eventsAtom);

    const setDay = useSetAtom(dayAtom);

    const innerWidth = useInnerWidth();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const generateCalendar = () => {
        const startDate = startOfWeek(startOfMonth(currentMonth));
        const endDate = endOfWeek(endOfMonth(currentMonth));

        let date = startDate;
        const calendar: Date[] = [];

        while (date <= endDate) {
            calendar.push(date);
            date = add(date, { days: 1 });
        }

        return calendar;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(add(currentMonth, { months: -1 }));
    };

    const handleNextMonth = () => {
        setCurrentMonth(add(currentMonth, { months: 1 }));
    };

    const handleAddEvent = (date: Date) => {
        setDay({
            show: true,
            day: format(date, "dd/MM/yyyy"),
        });
    };

    const handleMonthDownload = () => {
        const eventsInCurrentMonth = Object.values(events)
            .flat()  // Flatten all the events (assuming events are grouped by day)
            .filter(event => {
                const eventDate = new Date(event.date);
                return isSameMonth(eventDate, currentMonth);  // Filter events in the current month
            });

        const eventsJson = JSON.stringify(eventsInCurrentMonth, null, 2);  // Format the JSON with indentation

        const blob = new Blob([eventsJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `events-${format(currentMonth, "yyyy-MM")}.json`;  // Use the current month's name for the file
        a.click();
        URL.revokeObjectURL(url);  // Cleanup the object URL after download
    };

    const calendar = generateCalendar();

    return (
        <div className="max-w-3xl mx-auto py-10">
            <div className="flex justify-between items-center mb-4">
                <PaginationPrevious 
                    hideText={innerWidth <= getScreenSize("sm")}
                    className="cursor-pointer hover:bg-transparent hover:text-white w-fit p-0 pl-2" 
                    onClick={handlePrevMonth} 
                />
                
                <h2 className="text-xl font-bold flex items-center gap-4">
                    {format(
                        currentMonth, 
                        innerWidth > getScreenSize("sm") ? "MMMM yyyy" : "MMM yyyy"
                    )}
                    <DownloadIcon className="text-zinc-500 cursor-pointer" onClick={handleMonthDownload}/>
                </h2>
                
                <PaginationNext 
                    hideText={innerWidth <= getScreenSize("sm")}
                    className="cursor-pointer hover:bg-transparent hover:text-white w-fit p-0 pr-2" 
                    onClick={handleNextMonth} 
                />
            </div>
            <div className="grid grid-cols-7 text-center border-b border-zinc-700 pb-2">
                {days.map((day) => (
                    <div key={day} className="text-zinc-400 font-semibold">
                        {innerWidth > getScreenSize("sm") ? day : day.at(0)}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-4">
                {calendar.map((date, index) => {
                    const eventForDay = events[format(date, "dd/MM/yyyy")];
                    const hasEvent = eventForDay && eventForDay.length > 0;

                    return (
                        <div
                            key={index}
                            className={`p-2 sm:p-4 rounded cursor-pointer text-center font-semibold 
                                ${isSameDay(date, new Date()) ? "bg-zinc-800" : "hover:bg-zinc-800"}
                                ${isSameMonth(date, currentMonth) ? "text-white" : "text-zinc-600 hover:bg-transparent cursor-default"}
                                ${hasEvent ? "border-2 border-yellow-400" : "border-none"} 
                            `}
                            onClick={() => handleAddEvent(date)}
                        >
                            <div>{format(date, "d")}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

