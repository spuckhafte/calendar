import { AllEvents } from "@/types";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const eventsAtom = atomWithStorage<AllEvents>("all-events", {});
export const dayAtom = atom({
    show: false,
    day: "",
});
export const showCreateEventAtom = atom(false);
