import * as React from "react";
import { useDispatch } from "react-redux";
import { addTask } from "@/lib/redux/features/taskSlice";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "./data-picker";
import {IAddTask, ITaskCategory, } from "@/type/todo";
import toast from "react-hot-toast";
import { SiComma } from "react-icons/si";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineSelfImprovement } from "react-icons/md";
import { MdLocalPostOffice } from "react-icons/md";
export function CardWithForm({ sheetOpen, setSheetOpen }: { sheetOpen?: boolean, setSheetOpen?: ((n: boolean) => void) }) {

    const dispatch = useDispatch();
    const [dueDate, setDueDate] = React.useState<Date>();
    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [category, setCategory] = React.useState<ITaskCategory>();
    const handleSubmit = () => {


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

        if (!category) {
            toast.error("Category is required");
            return;
        }
        const formData: IAddTask = {
            dueDate,
            title,
            description,
            category,
            status: "TO-DO",
           
            // TODO: Replace with actual user ID from auth context
        };
        if (setSheetOpen !== undefined) {
            setSheetOpen(!sheetOpen);
        }
        console.log("FormData:", formData);
        dispatch(addTask(formData));
        setTitle('');
        setDescription('');
        setDueDate(new Date());
        setCategory(undefined);


    };

    return (<>
        <Card className="">
            <CardHeader>
                <CardTitle>Create Todos</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}>
                    <div className="grid grid-cols-1  items-center gap-4">
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
                        <div className=" flex flex-col space-y-1.5">
                            <Label htmlFor="due_date">Due Date</Label>
                            <DatePicker dueDate={dueDate} setDueDate={setDueDate} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                onValueChange={(value: ITaskCategory) => setCategory(value)}

                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="work">
                                        <div className="flex gap-1 justify-center items-center">
                                            <MdLocalPostOffice />
                                            <div>work </div>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="personal">
                                        <div className="flex gap-1 justify-center items-center">
                                            <MdOutlineSelfImprovement />
                                            <div>personal</div>

                                        </div>


                                    </SelectItem>
                                    <SelectItem value="home">
                                        <div className="flex gap-1 justify-center items-center">
                                            <FaHome /> <div>home</div>
                                        </div>

                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={handleSubmit}>Add Task</Button>
            </CardFooter>
        </Card>
       


    </>
    );
}
