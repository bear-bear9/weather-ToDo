import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { CloudSun, Menu, Search, NotebookPen } from 'lucide-react';
import TodoPage from './todo/page';
import WeatherList from './weather/nationwide-list';
import WeatherDetail from './weather/weather-detail';
import Sidebar from './weather/sidebar';
import './App.css';

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // サイドバーから都市を受け取る
  const handleCitySelect = (city: string) => {
    // サイドバーを閉じる
    setIsSidebarOpen(false);
    // URLを /detail/所沢 のように書き換えて移動！
    navigate(`/detail/${city}`);
  };

  return (
    <div className="App">
      {/* 🌟 共通ヘッダー：どの画面でも一番上に表示される */}
      <header className="app-header">
        <Menu
          className="menu-icon"
          size={26}
          onClick={() => setIsSidebarOpen(true)}
        />

        <div className="header-logo-capsule">
          <CloudSun size={20} color="#ffa726" strokeWidth={2.5} />
          <span className="header-title">お天気TODO</span>
          <NotebookPen size={20} color="#78909c" strokeWidth={2.5} />
        </div>

        <Search className="search-icon" size={22} />
      </header>

      {/* 🌟 サイドバー本体　*/}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCitySelect={handleCitySelect}
      />

      {/* Routes で囲むことで、URLに応じて中身を入れ替える */}
      <Routes>
        {/* 1. TOP画面 (/) の時は TodoPage を出す */}
        <Route path="/" element={<TodoPage />} />

        {/* 2. (/list) の時は 全国一覧画面 を出す */}
        <Route path="/list" element={<WeatherList />} />

        {/* 3. (/detail/都市名) の時は 詳細画面 を出す */}
        <Route path="/detail/:cityName" element={<WeatherDetail />} />
      </Routes>
    </div>
  );
}

export default App;
