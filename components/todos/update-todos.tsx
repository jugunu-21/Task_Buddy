import * as React from "react";
import { useDispatch } from "react-redux";
import { ITask, updateTaskAsync } from "@/lib/redux/features/taskSlice";
import { Button } from "@/components/ui/button";
import { AlertDialogCancel } from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import toast from "react-hot-toast";
import { AppDispatch } from "@/lib/redux/store";
import { MdLocalPostOffice, MdOutlineSelfImprovement } from "react-icons/md";

export function Updatecard({ todos, setSheetOpen }: { todos: ITask, setSheetOpen: ((n: boolean) => void) }) {
    const dispatch = useDispatch<AppDispatch>();
    const [dueDate, setDueDate] = React.useState<Date>(new Date(todos.dueDate));
    const [title, setTitle] = React.useState<string>(todos.title);
    const [description, setDescription] = React.useState<string>(todos.description);
    const [status, setStatus] = React.useState<string>(todos.status);
    const [category, setCategory] = React.useState<string>(todos.category);
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
     
        dispatch(updateTaskAsync({
            data: { id:todos.id,dueDate,  description, status, category, title},
            id: todos.id,
        }));
        setSheetOpen(false)
        setTitle('');
        setDescription('');
        setDueDate(new Date());
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmituUpdate();
        }}>
        <Card className="w-[800px] text-slate-500">
            <CardHeader>
                <CardTitle>Update Task</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Input
                            id="title"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col space-y-1.5">
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
                            <Label htmlFor="category" className="text-xs">Task Category*</Label>
                            <Select value={category} onValueChange={setCategory}>
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
                            <Label htmlFor="due_date" className="text-xs">Due on*</Label>
                            <DatePicker dueDate={dueDate} setDueDate={setDueDate} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="status" className="text-xs">Task Status*</Label>
                            <Select value={status} onValueChange={setStatus}>
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
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button onClick={handleSubmituUpdate}>Update task</Button>
            </CardFooter>
        </Card> </form>
    );
}