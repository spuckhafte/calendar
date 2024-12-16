import { useAtom } from "jotai";
import Calendar from "./components/Calendar"
import { dayAtom, showCreateEventAtom } from "./lib/atoms"
import Day from "./components/Day";
import CreateEvent from "./components/CreateEvent";
import { Toaster } from "./components/ui/sonner";

function App() {
    const [day, setDay] = useAtom(dayAtom);
    const [showCreateEvent, setShowCreateEvent] = useAtom(showCreateEventAtom);

    return (
        <div className="bg-zinc-950 text-white w-screen h-screen">
            <Calendar />
            <Day open={day.show} onOpenChange={() => {
                setDay({
                    show: false,
                    day: day.day,
                })
            }} />
            <CreateEvent open={showCreateEvent} onOpenChange={() => setShowCreateEvent(false)}/>
            <Toaster />
        </div>
    )
}

export default App
