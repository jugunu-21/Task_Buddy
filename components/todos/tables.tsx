import { useSelector } from "react-redux";
import { TodosListTable } from "./todoslist-table";
import { RootState } from "@/lib/redux/store";

export default function Table(){
    const data = useSelector((state: RootState) => state.tasks.tasks)
    return (
        <>
         <TodosListTable data={data} />
        </>
    )

}