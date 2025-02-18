"use client"
import Header from "@/components/Header";
import FiltersAndSearch from "@/components/FiltersAndSearch";
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/lib/redux/store';
import { TodosListTable } from "@/components/todos/todoslist-table";
import { CardWithForm } from "@/components/todos/add-todos-form";
export default function Home() {
  return (
    <Provider store={store}>
    <div className="min-h-screen ">
      
      <Header />
      <FiltersAndSearch />
      <CardWithForm />
      <TodosListTable />
    </div></Provider>
  );
}
