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
import { ArrowUpDown, MoreHorizontal, Loader2 } from "lucide-react";
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
import { Card, CardContent } from "../../components/ui/card";
import { deleteTaskAsync, ITask } from "@/lib/redux/features/taskSlice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../ui/badge";
import { createDateFromISO } from "../../helpers/date-formator";
import { AppDispatch } from "@/lib/redux/store";
import { TaskSection } from "./list/TaskSection";

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
    dispatch: AppDispatch;
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
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const columns: ColumnDef<ITask>[] = [
        {
            accessorKey: "title",
            header: "title",
            cell: ({ row }) => (
                <div className='flex gap-2'>
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
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    status
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="secondary" className='p-2'>
                    {row.getValue("status")}
                </Badge>
            ),
        },
        {
            accessorKey: "dueDate",
            header: ({ column }) => (
                <Button
                    className="align-left ml-0 pl-0"
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    due date
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="lowercase">
                    {createDateFromISO(row.getValue("dueDate"))}
                </div>
            ),
        },
        {
            accessorKey: "category",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="align-left ml-0 pl-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    category
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("category")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const task = row.original;
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
                            <DropdownMenuItem onClick={() => dispatch(deleteTaskAsync(task.id))}>
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUpdateTask(task)}>
                                Update
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

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
    });

    return (
        <Card className="h-full">
            <CardContent>
                <div className="w-full h-full">
                    <div className="">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                <TaskSection
                                    title="To Do"
                                    status="TO-DO"
                                    bgColor="bg-[#FAC3FF]"
                                    hoverColor="bg-[#f7d1fb]"
                                    tasks={table.getRowModel().rows}
                                    columns={columns}
                                    expandedSections={expandedSections}
                                    sectionKey="todo"
                                    toggleSection={toggleSection}
                                    showAddForm={true}
                                    dispatch={dispatch}
                                />

                                <TaskSection
                                    title="In Progress"
                                    status="IN-PROGRESS"
                                    bgColor="bg-[#85D9F1]"
                                    hoverColor="bg-[#a3e2f4]"
                                    tasks={table.getRowModel().rows}
                                    columns={columns}
                                    expandedSections={expandedSections}
                                    sectionKey="inProgress"
                                    toggleSection={toggleSection}
                                />

                                <TaskSection
                                    title="Completed"
                                    status="COMPLETED"
                                    bgColor="bg-[#CEFFCC]"
                                    hoverColor="bg-[#d7fad6]"
                                    tasks={table.getRowModel().rows}
                                    columns={columns}
                                    expandedSections={expandedSections}
                                    sectionKey="completed"
                                    toggleSection={toggleSection}
                                />

                                {(!table.getRowModel().rows?.length || loading) && (
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
                                variant="outline"
                                size="sm"
                                onClick={handleBulkDelete}
                                className="text-red-500 hover:text-red-600"
                            >
                                Delete Selected
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

