import * as React from "react";
import { useDispatch } from "react-redux";
import { ITask, updateTask } from "@/lib/redux/features/taskSlice";
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

export function Updatecard({ todos, sheetOpen, setSheetOpen }: { todos: ITask, sheetOpen?: boolean, setSheetOpen: ((n: boolean) => void) }) {
    const dispatch = useDispatch();
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
     
        dispatch(updateTask({
            dueDate: dueDate.toISOString(),
            title,
            description,
            id: todos.id,
            status,
            category
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
        <Card className=" ">
            
            <CardHeader>
                <CardTitle>Update Task</CardTitle>
            </CardHeader>
            <CardContent className=" grid">
               
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
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TO-DO">To Do</SelectItem>
                                    <SelectItem value="IN-PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="category">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="work">Work</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
               
            </CardContent>
            <CardFooter className="flex justify-end gap-1">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button onClick={handleSubmituUpdate}>Update task</Button>
            </CardFooter>
           
        </Card> </form>
    );
}