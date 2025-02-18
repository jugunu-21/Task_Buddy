import { useSelector } from "react-redux";
import { TodosListTable } from "./todoslist-table";
import { RootState } from "@/lib/redux/store";
import { TodoBoardTable } from "./todoboard-table";

export default function Table(){
    const data = useSelector((state: RootState) => state.tasks.tasks)
    return (
        <>
         <TodosListTable data={data} />
         <TodoBoardTable data={data} />
        </>
    )

}