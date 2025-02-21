"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover"

export function DatePicker({ dueDate, setDueDate }: { dueDate: Date | undefined; setDueDate: (date: Date) => void }) {
    const [date, setDate] = React.useState<Date | undefined>(undefined);

    React.useEffect(() => {
        if (dueDate) {
            setDate(dueDate);
        }
    }, [dueDate]);

    React.useEffect(() => {
        if (date) {
            setDueDate(date);
        }
    }, [date, setDueDate]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "justify-start text-left font-normal truncate max-w-[200px] overflow-hidden",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    <div className="truncate">
                        {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
