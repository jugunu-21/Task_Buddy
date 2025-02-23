import * as React from "react";
import { addTaskAsync } from "@/lib/redux/features/taskSlice";
import { Button } from "@/components/ui/button";
import { AppDispatch } from "@/lib/redux/store";
import {
    Card,
    CardContent,
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
import {IAddTask, ITaskCategory, ITaskStatus, } from "@/type/todo";
import toast from "react-hot-toast";

import { MdOutlineSelfImprovement } from "react-icons/md";
import { MdLocalPostOffice } from "react-icons/md";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
export function CardWithForm({ sheetOpen, setSheetOpen, dispatch }: { dispatch: AppDispatch, sheetOpen?: boolean, setSheetOpen?: ((n: boolean) => void) }) {

    const [dueDate, setDueDate] = React.useState<Date>();
    const [title, setTitle] = React.useState<string>("");
    const [description, setDescription] = React.useState<string>("");
    const [category, setCategory] = React.useState<ITaskCategory>();
    const [status, setStatus] = React.useState<ITaskStatus>("TO-DO");
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
        if (!status) {
            toast.error("Category is required");
            return;
        }
        const formData: IAddTask = {
            dueDate:dueDate.toISOString(),
            title,
            description,
            category,
            status
           
            // TODO: Replace with actual user ID from auth context
        };
        if (setSheetOpen !== undefined) {
            setSheetOpen(!sheetOpen);
        }
        console.log("FormData:", formData);
        dispatch(addTaskAsync(formData));
        setTitle('');
        setDescription('');
        setDueDate(new Date());
        setCategory(undefined);
    };
    return (<>
     <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
        <Card className="w-full text-slate-500">
            <CardHeader>
                <CardTitle>Create Task</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        {/* <Label htmlFor="title">Task title</Label> */}
                        <Input
                            id="title"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        {/* <Label htmlFor="description">Description</Label> */}
                        <Input
                            id="description"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[80px] placeholder:top-0 placeholder:absolute placeholder:text-sm placeholder:text-gray-500 pt-4"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col space-y-1.5 text-xs">
                            <Label htmlFor="category" className="text-xs " >Task Category*</Label>
                            <Select
                                onValueChange={(value: ITaskCategory) => setCategory(value)}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectItem value="work">
                                        <div className="flex items-center gap-2">
                                            <MdLocalPostOffice className="text-blue-500" />
                                            <span>Work</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="personal">
                                        <div className="flex items-center gap-2">
                                            <MdOutlineSelfImprovement className="text-purple-500" />
                                            <span>Personal</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="due_date" className="text-xs ">Due on*</Label>
                                <DatePicker dueDate={dueDate} setDueDate={setDueDate} />
                            </div>
                        
                            
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="status" className="text-xs "> Task Status*</Label>
                                <Select
                                    defaultValue="TO-DO"
                                    onValueChange={(value:ITaskStatus) => setStatus(value)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="TO-DO">To-Do</SelectItem>
                                        <SelectItem value="IN-PROGRESS">In-Progress</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        
                    </div>
                    {/* <div className="flex flex-col space-y-1.5">
                        <Label>Attachment</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                            <p className="text-sm text-gray-500">Drop your files here or Update</p>
                        </div>
                    </div> */}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button onClick={handleSubmit} className="bg-[#7B1984] hover:bg-[#77397d]">Create task</Button>
            </CardFooter>
        </Card>
        </form>


    </>
    );
}
