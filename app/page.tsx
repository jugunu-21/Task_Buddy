"use client"
import Header from "@/components/Header";
import FiltersAndSearch from "@/components/FiltersAndSearch";
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/lib/redux/store';
import { CardWithForm } from "@/components/todos/add-todos-form";
import Table from "@/components/todos/tables";
export default function Home() {
  return (
    <Provider store={store}>
    <div className="min-h-screen ">
      <Header />
      {/* <CardWithForm /> */}
     <Table />
    </div></Provider>
  );
}
