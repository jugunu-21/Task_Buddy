"use client"
import Header from "@/components/Header";
import FiltersAndSearch from "@/components/FiltersAndSearch";
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
export default function Home() {
  return (
    <Provider store={store}>
    <div className="min-h-screen ">
      <Header />
      <FiltersAndSearch />
    </div></Provider>
  );
}
