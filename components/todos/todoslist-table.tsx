import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import * as React from "react"
import { RootState } from "../../lib/redux/store"
import { useEffect, } from 'react'
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Loader2 } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
    Card,
    CardContent,
} from "../../components/ui/card";
import { useDispatch, useSelector, } from "react-redux"
import type { Task } from '@prisma/client'
import { addTask,
    updateTask,
    removeTask,
    // toggleTaskComplete,

    clearFilters,
    UpdateIntialTasks,
    ITask} from "@/lib/redux/features/taskSlice";
import { Input } from "../../components/ui/input"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table"
import { useState } from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import { Updatecard } from "./update-todos"
import { Badge } from "../ui/badge"
import { createDateFromISO } from "../../helpers/date-formator"
import { getBadgeVariant } from "../../helpers/get-badges-varient"
import { getAllTasks } from '@/lib/db/tasks';
interface FilterType {
    value: string;
    label: string;
}
const filters: FilterType[] = [
    { value: 'all', label: 'All Tasks' },
    { value: 'completed', label: 'Completed Tasks' },
    { value: 'todo', label: 'Pending Tasks' },

];

export function TodosListTable({data}:{data:ITask[]}) {
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState({
        todo: true,
        inProgress: false,
        completed: false
    });

    const toggleSection = (section: 'todo' | 'inProgress' | 'completed') => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    const dispatch = useDispatch();
    useEffect(() => {
        getAllTasks("USERID").then((tasks) => {
            console.log("tasks ",tasks)
            dispatch(UpdateIntialTasks(tasks));
        }).catch((error) => {
            console.error("Error fetching tasks:", error);
        });
    }, [dispatch]);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setLoading(false); // Replace 'Welcome!' with your desired message
        }, 2000);

        return () => clearTimeout(timerId);
    }, []);
    // const [data, setData] = useState<ITodos[]>([])


    console.log("dataaa", data)
    const [checkedFilters, setCheckedFilters] = useState<string[]>(["all"]);
    const [toDo, setTodo] = useState<Task>()
    const updatetodosReducer = useDispatch()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [updateOpen, setUpdateOpen] = useState<boolean>(false)
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const columns: ColumnDef<Task>[] = [
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
                    checked={false}
                    // onCheckedChange={(value) => {
                    //     if (value) {
                    //         updatetodosReducer(updateTask({
                    //             id: row.original.id,
                    //             completed: true
                    //         }));
                    //     } else {
                    //         updatetodosReducer(updateTask({
                    //             id: row.original.id,
                    //             completed: false
                    //         }));
                    //     }
                    // }}
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
                                onClick={() => updatetodosReducer(removeTask(payment.id))}
                            >
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setUpdateOpen(true); setTodo(payment)

                            }}>
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
    const toggleFilter = (filterValue: string) => {
        const newFilters = [...checkedFilters]; // Create a copy of the current filters

        if (newFilters.includes(filterValue)) {
            // Remove the filter if it already exists
            newFilters.splice(newFilters.indexOf(filterValue), 1);
        } else {
            // Add the filter if it doesn't exist
            newFilters.push(filterValue);
        }
        setCheckedFilters(newFilters);
        console.log("Updated filters:", newFilters);
        return newFilters
    };
    return (
        <Card className="h-full">
            <CardContent>
                <div className="w-full h-full">
                    <div className="flex items-center py-4 justify-between ">
                        <Input
                            placeholder="Search for title..."
                            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("title")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                        
                    </div>
                    <div className="rounded-md border">
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
                                    className="bg-blue-50 cursor-pointer hover:bg-blue-100"
                                    onClick={() => toggleSection('todo')}
                                >
                                    <TableCell colSpan={columns.length} className="py-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">To Do</h3>
                                                <Badge variant="secondary">
                                                    {table.getRowModel().rows.filter(row => row.original.status === "TO-DO").length}
                                                </Badge>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleSection('todo'); }}>
                                                <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.todo ? '' : '-rotate-180'}`} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expandedSections.todo && table.getRowModel().rows
                                    .filter(row => row.original.status === "TO-DO")
                                    .map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                
                                {/* IN-PROGRESS Section */}
                                <TableRow className="bg-yellow-50 cursor-pointer hover:bg-yellow-100">
                                    <TableCell colSpan={columns.length} className="py-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">In Progress</h3>
                                                <Badge variant="secondary">
                                                    {table.getRowModel().rows.filter(row => row.original.status === "IN-PROGRESS").length}
                                                </Badge>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleSection('inProgress'); }}>
                                                <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.inProgress ? '' : '-rotate-180'}`} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expandedSections.inProgress && table.getRowModel().rows
                                    .filter(row => row.original.status === "IN-PROGRESS")
                                    .map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                
                                {/* COMPLETED Section */}
                                <TableRow className="bg-green-50 cursor-pointer hover:bg-green-100">
                                    <TableCell colSpan={columns.length} className="py-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">Completed</h3>
                                                <Badge variant="secondary">
                                                    {table.getRowModel().rows.filter(row => row.original.status === "COMPLETED").length}
                                                </Badge>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toggleSection('completed'); }}>
                                                <ChevronDown className={`h-4 w-4 transform transition-transform ${expandedSections.completed ? '' : '-rotate-180'}`} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expandedSections.completed && table.getRowModel().rows
                                    .filter(row => row.original.status === "COMPLETED")
                                    .map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                
                                {/* Loading and Empty States */}
                                {!table.getRowModel().rows?.length && (
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
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 pt-2 pb-0">
                        <div className="space-x-2">
                            <Button

                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>

                </div>
            </CardContent>
            <AlertDialog open={updateOpen} onOpenChange={setUpdateOpen}>
                <AlertDialogContent >
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {toDo !== undefined &&
                                <Updatecard
                                    todos={toDo}
                                    sheetOpen={updateOpen}
                                    setSheetOpen={setUpdateOpen}
                                />}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card >
    )
}

