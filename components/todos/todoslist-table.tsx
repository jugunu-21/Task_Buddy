import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
    Card,
    CardContent,
} from "../../components/ui/card";
import { addTaskAsync, deleteTaskAsync, ITask } from "@/lib/redux/features/taskSlice";
import { Input } from "../../components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { createDateFromISO } from "../../helpers/date-formator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DatePicker } from "./data-picker";
import { ITaskCategory, ITaskStatus } from '@/type/todo';
import toast from 'react-hot-toast';
import { BsArrowReturnLeft } from "react-icons/bs";


interface TodosListTableProps {
    data: ITask[];
    selectedTasks: string[];

    handleTaskSelect: (taskId: string) => void;
    handleBulkDelete: () => void;
    handleBulkStatusUpdate: (status: string) => void;
    expandedSections: {
        todo: boolean;
        inProgress: boolean;
        completed: boolean;
    };
    handleUpdateTask: (task: ITask) => void;
    toggleSection: (section: 'todo' | 'inProgress' | 'completed') => void;
    loading: boolean;

  dispatch:any
}

export function TodosListTable({
    handleUpdateTask,
    data,
    selectedTasks,
    handleTaskSelect,
    handleBulkDelete,
    handleBulkStatusUpdate,
    expandedSections,
    toggleSection,
    loading,
    dispatch
}: TodosListTableProps & { setAddOpen: (open: boolean) => void }) {
    const [showaddTaskAsyncForm, setShowaddTaskAsyncForm] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskStatus, setNewTaskStatus] = useState<string>();
    const [newTaskDueDate, setNewTaskDueDate] = useState<Date>();
    const [newTaskCategory, setNewTaskCategory] = useState<string>();
  
    const handleaddTaskAsync = () => {
        if (!newTaskTitle || !newTaskStatus || !newTaskDueDate || !newTaskCategory) {
            toast.error("All fields are required");
            return;
        }

        const formData = {
            title: newTaskTitle,
            status: newTaskStatus as ITaskStatus,
            dueDate: newTaskDueDate.toISOString(),
            category: newTaskCategory as ITaskCategory,
            description: ""
        };

        dispatch(addTaskAsync(formData));
        setNewTaskTitle("");
        setNewTaskStatus(undefined);
        setNewTaskDueDate(undefined);
        setNewTaskCategory(undefined);
        setShowaddTaskAsyncForm(false);
    };

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const columns: ColumnDef<ITask>[] = [
        // {
        //     id: "select",
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={false}
        //             // onCheckedChange={(value) => {
        //             //     if (value) {
        //             //         updatetodosReducer(updateTask({
        //             //             id: row.original.id,
        //             //             completed: true
        //             //         }));
        //             //     } else {
        //             //         updatetodosReducer(updateTask({
        //             //             id: row.original.id,
        //             //             completed: false
        //             //         }));
        //             //     }
        //             // }}
        //             aria-label="Select row"
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            accessorKey: "title",
            header: "title",
            cell: ({ row }) => (< div className='flex gap-2'>
             <Checkbox
                    checked={selectedTasks.includes(row.original.id)}
                    onCheckedChange={() => handleTaskSelect(row.original.id)}
                    aria-label="Select row"
                />
                   <div className="capitalize">{row.getValue("title")}</div>
                </div>
             
            ),
        },

        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        status
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <Badge variant="secondary" className='p-2'>
                {row.getValue("status")}
            </Badge>
        },
       

        {
            accessorKey: "dueDate",
            header: ({ column }) => {
                return (
                    <Button
                        className="align-left ml-0 pl-0"
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        due date
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">
                {createDateFromISO(row.getValue("dueDate"))}</div>,
        },
        {
            accessorKey: "category",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        className="align-left ml-0 pl-0"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        category
                        <ArrowUpDown />
                    </Button>
                )
            },
            cell: ({ row }) =>
                // <Badge className={`lowercase ${getBadgeVariant(row.getValue("category"))}`}>
                //     {row.getValue("category")}
                // </Badge>
                <div >{row.getValue("category")}</div>
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const payment = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
onClick={() => dispatch(deleteTaskAsync (payment.id))}
                            >
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={()=>handleUpdateTask(payment)}>
                                Update
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu >
                )
            },
        },
    ]
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <Card className="h-full">
            <CardContent>
                <div className="w-full h-full">
                    {/* <FiltersAndSearch VALUESEARCH={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                            ONCHANGESEARCH={(event) =>
                                table.getColumn("title")?.setFilterValue(event.target.value)
                            } 
                            ONCLICKBUTTON={() => setAddOpen(true)}
                            /> */}
                    
                    <div className="">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            
                            <TableBody>
                                {/* TO-DO Section */}
                              
                                <TableRow 
                                    className="bg-[#FAC3FF] cursor-pointer  rounded-t-xl hover:bg-[#f7d1fb]  "
                                    onClick={() => toggleSection('todo')}
                                >
                                    <TableCell colSpan={columns.length} className="py-2 rounded-t-xl ">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">To Do</h3>
                                               
                                                   ({table.getRowModel().rows.filter(row => row.original.status === "TO-DO").length})
                                                
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleSection('todo'); }}>
                                                <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.todo ? '' : '-rotate-180'}`} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expandedSections.todo && (
                                    <>
                                        <TableRow className="bg-muted/90">
                                            <TableCell colSpan={5}>
                                                <Button 
                                                    variant="ghost" 
                                                    onClick={() => setShowaddTaskAsyncForm(true)}
                                                    className="text-xs"
                                                    suppressHydrationWarning
                                                >
                                                    Add Task
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {showaddTaskAsyncForm && (
                                            <TableRow className="bg-muted/90">
                                                <TableCell colSpan={5} className='w-full'>
                                                    <div className="flex items-center  justify-between   px-20   ">
                                                        <div className=' flex-col gap-4'>
                                                        <Input
                                                            placeholder="Task Title"
                                                            className="w-full border-none shadow-none text-xs"
                                                            value={newTaskTitle}
                                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                                        />
                                                            <div className='flex-row mt-2'>
                                                            <Button variant="default" size="sm" onClick={handleaddTaskAsync} className='bg-purple-600 text-white rounded-3xl  hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-200'>ADD <BsArrowReturnLeft /></Button>

                                                            
                                                            <Button variant="ghost" size="sm" onClick={() => {
                                                                setNewTaskTitle("");
                                                                setNewTaskStatus(undefined);
                                                                setNewTaskDueDate(undefined);
                                                                setNewTaskCategory(undefined);
                                                                setShowaddTaskAsyncForm(false);
                                                            }}>CANCEL</Button>
                                                            </div>
                                                        </div>
                                                      
                                                                                                                <div className="flex gap-2">
                                                            
                                                        </div>

                                                         <div className="w-[150px]">
                                                            <DatePicker dueDate={newTaskDueDate} setDueDate={setNewTaskDueDate} />
                                                        </div>
                                                        <Select value={newTaskStatus} onValueChange={setNewTaskStatus}>
                                                        <SelectTrigger className="w-10  aspect-square rounded-full">
                                                                <SelectValue placeholder="+" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="TO-DO">To Do</SelectItem>
                                                                <SelectItem value="IN-PROGRESS">In Progress</SelectItem>
                                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                       
                                                        <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                                                            <SelectTrigger className="w-10  aspect-square rounded-full">
                                                                <SelectValue placeholder="+" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="work">Work</SelectItem>
                                                                <SelectItem value="personal">Personal</SelectItem>
                                                              
                                                            </SelectContent>
                                                        </Select>

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </>
                                )}
                                {expandedSections.todo && table.getRowModel().rows
                                    .filter(row => row.original.status === "TO-DO")
                                    .map((row, index, array) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className={`rounded-b-xl bg-muted/90 ${index === array.length - 1 ? 'border-b-0' : ''}`}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className=''>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                    
                                    <TableRow className='h-4 border-none'>
    <TableCell colSpan={columns.length}></TableCell>
</TableRow>
                                {/* IN-PROGRESS Section */}
                                <TableRow className="bg-[#85D9F1]  cursor-pointer hover:bg-[#a3e2f4]">
                                    <TableCell colSpan={columns.length} className="py-2 rounded-t-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">In Progress</h3>
                                                (
                                                    {table.getRowModel().rows.filter(row => row.original.status === "IN-PROGRESS").length}
                                               )
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleSection('inProgress'); }}>
                                                <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.inProgress ? '' : '-rotate-180'}`} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expandedSections.inProgress && table.getRowModel().rows
                                    .filter(row => row.original.status === "IN-PROGRESS")
                                    .map((row ,index,array) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className={` rounded-b-xl bg-muted/90 ${index === array.length - 1 ? 'border-b-0' : ''}`}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className=''>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                 <TableRow className='h-4 border-none'>
    <TableCell colSpan={columns.length}></TableCell>
</TableRow>
                              
                                <TableRow className="bg-[#CEFFCC] cursor-pointer hover:bg-[#d7fad6] ">
                                    <TableCell colSpan={columns.length} className="py-2 rounded-t-xl">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">Completed</h3>
                                             (
                                                    {table.getRowModel().rows.filter(row => row.original.status === "COMPLETED").length}
                                             )
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleSection('completed'); }}>
                                                <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.completed ? '' : '-rotate-180'}`} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expandedSections.completed && table.getRowModel().rows
                                    .filter(row => row.original.status === "COMPLETED")
                                    .map((row , index, array) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className={` rounded-b-xl bg-muted/90 ${index === array.length - 1 ? 'border-b-0' : ''}`}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className=''>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                
                                {/* Loading and Empty States */}
                                {(!table.getRowModel().rows?.length || loading) &&
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            {loading ? (
                                                <div className="flex justify-center items-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                                                </div>
                                            ) : (
                                                <div className="text-gray-500">No tasks found</div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </div>
                  

                </div>
                {selectedTasks.length > 0 && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black p-4 rounded-lg shadow-lg border flex items-center gap-4 z-50">
                        <span className="text-sm font-medium text-white">{selectedTasks.length} task(s) selected</span>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const menu = e.currentTarget.nextElementSibling;
                                        if (menu) {
                                            menu.classList.toggle('hidden');
                                        }
                                    }}
                                >
                                    Change Status
                                </Button>
                                <div className="hidden absolute left-0 bottom-full mb-1 w-40 bg-black border rounded-md shadow-lg z-50">
                                    <div className="py-1">
                                        <button
                                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
                                            onClick={() => {
                                                handleBulkStatusUpdate("TO-DO");
                                                const menu = document.querySelector('.status-menu');
                                                if (menu) menu.classList.add('hidden');
                                            }}
                                        >
                                            Mark as Todo
                                        </button>
                                        <button
                                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
                                            onClick={() => {
                                                handleBulkStatusUpdate("IN-PROGRESS");
                                                const menu = document.querySelector('.status-menu');
                                                if (menu) menu.classList.add('hidden');
                                            }}
                                        >
                                            Mark as In Progress
                                        </button>
                                        <button
                                            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-800"
                                            onClick={() => {
                                                handleBulkStatusUpdate("COMPLETED");
                                                const menu = document.querySelector('.status-menu');
                                                if (menu) menu.classList.add('hidden');
                                            }}
                                        >
                                            Mark as Completed
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                            >
                                Delete Selected
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
            
        </Card >
    )
}

