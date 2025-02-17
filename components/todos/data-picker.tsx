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

// export function DatePicker({ dueDate setDueDate }: { setDueDate: (gvj: Date) => void })

export function DatePicker({ dueDate, setDueDate }: { dueDate: Date | undefined; setDueDate: (date: Date) => void }) {
    const [date, setDate] = React.useState<Date>()
    React.useEffect(() => {
        if (dueDate !== date && date != undefined) {
            setDueDate(date);
            console.log()
        }
    }, [date]);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        " justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
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
