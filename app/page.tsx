"use client"
import Header from "@/components/Header";
import FiltersAndSearch from "@/components/FiltersAndSearch";
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/lib/redux/store';
import { CardWithForm } from "@/components/todos/add-todos-form";

import { TodoContainer } from "@/components/todos/todo-container";
import { useState } from "react";
export default function Home() {
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  return (
    <Provider store={store}>
    <div className="min-h-screen ">
      <Header viewMode={viewMode} setViewMode={setViewMode} />
      {/* <CardWithForm /> */}
      <TodoContainer viewMode={viewMode} />
    </div></Provider>
  );
}
