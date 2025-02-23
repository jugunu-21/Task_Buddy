import React, {

    useState,
  } from "react";
import { useSelector, } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { ITask} from "@/lib/redux/features/taskSlice";
import { Column } from "./board/Column";
interface TodoBoardTableProps {
  handleUpdateTask: (task: ITask) => void;
}
  export const CustomKanban = (
    { 
      handleUpdateTask,
  }: TodoBoardTableProps& { setAddOpen: (open: boolean) => void }
  ) => {

    return (
      <div className="h-screen w-full  text-neutral-50">
        <Board handleUpdateTask={handleUpdateTask} />
      </div>
    );
  };
  const Board = ({handleUpdateTask}:{handleUpdateTask:(task: ITask) => void}) => {
    const data = useSelector((state: RootState) => state.tasks.tasks);
  
    const [cards, setCards] = useState<ITask[]>(data || []);
  
    return (
      <div className="flex justify-center  h-full gap-3  p-12">
        <Column
          title="To Do"
          column="TO-DO"
          headingColor="bg-[#FAC3FF]"
          cards={cards}
          setCards={setCards}
    
          handleUpdateTask={handleUpdateTask}
        />
        <Column
          title="In Progress"
          column="IN-PROGRESS"
          headingColor="bg-[#85D9F1]"
          cards={cards}
          setCards={setCards}
     
          handleUpdateTask={handleUpdateTask}
        />
        <Column
          title="Completed"
          column="COMPLETED"
          headingColor="bg-[#CEFFCC]"
          cards={cards}
          setCards={setCards}

          handleUpdateTask={handleUpdateTask}
        />
        {/* <BurnBarrel setCards={setCards} dispatch={dispatch} /> */}
      </div>
    );
  };
  