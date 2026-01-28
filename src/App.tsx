import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TodoPage from './todo/page';
import WeatherList from './weather/nationwide-list';
import WeatherDetail from './weather/weather-detail';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* Routes で囲むことで、URLに応じて中身を入れ替えます */}
        <Routes>
          {/* 1. TOP画面 (/) の時は TodoPage を出す */}
          <Route path="/" element={<TodoPage />} />

          {/* 2. (/list) の時は 全国一覧画面 を出す */}
          <Route path="/list" element={<WeatherList />} />

          {/* 3. (/detail/都市名) の時は 詳細画面 を出す */}
          <Route path="/detail/:cityName" element={<WeatherDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
