"use client"
import Header from "@/components/Header";
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
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
