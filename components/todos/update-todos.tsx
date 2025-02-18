import * as React from "react";
import { useDispatch } from "react-redux";
import {  updateTask } from "@/lib/redux/features/taskSlice";
import { Button } from "@/components/ui/button";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./data-picker";

import { Task } from "@prisma/client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
export function Updatecard({ todos, sheetOpen, setSheetOpen }: { todos: Task, sheetOpen?: boolean, setSheetOpen: ((n: boolean) => void) }) {
    const dispatch = useDispatch();
    const [dueDate, setDueDate] = React.useState<Date>(new Date(todos.dueDate));
    const [title, setTitle] = React.useState<string>(todos.title);
    const [description, setDescription] = React.useState<string>(todos.description);
    const handleSubmituUpdate = () => {
        if (!title) {
            toast.error("Title is required");
            return;
        }

        if (!dueDate) {
            toast.error("Due date is required");
            return;
        }
        if (!description) {
            toast.error("Description is required");
            return;
        }
     
        dispatch(updateTask({
            dueDate: dueDate,
            title,
            description,
            id: todos.id,
            status: todos.status
        }));
        setSheetOpen(false)
        setTitle('');
        setDescription('');
        setDueDate(new Date());
    };

    return (
        <Card className=" ">
            <CardHeader>
                <CardTitle>Update Todos</CardTitle>
            </CardHeader>
            <CardContent className=" grid">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmituUpdate();
                }}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Task description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="due_date">Due Date</Label>
                            <DatePicker dueDate={dueDate} setDueDate={setDueDate} />
                        </div>
                       

                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-1">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button onClick={handleSubmituUpdate}>Update task</Button>
            </CardFooter>
        </Card>
    );
}