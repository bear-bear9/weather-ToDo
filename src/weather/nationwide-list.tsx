import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { allPrefectures, regionData, cityNameJp } from './utils';
import WiComp from './WiComp';
import './layout.css';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

/**
 * WeatherRow: 各県の天気を1行分管理するコンポーネント
 * 絞り込み ＋ 低気圧アラート ＋ 雨予報バッジ（詳細への誘導）付き
 */
const WeatherRow = ({ pref, weatherFilter, isFavorite }: { pref: string, weatherFilter: string, isFavorite: boolean }) => {
  const [data, setData] = useState<{ temp: number, main: string, pressure: number, willRain: boolean } | null>(null);

  useEffect(() => {
    const fetchSmallWeather = async () => {
      // バグ発生個所：高知県がインドのkochinを参照してしまう問題への対策済み
      const pureName = pref.replace(/[都府県道]$/, "");
      const englishName = cityNameJp[pureName] || cityNameJp[pref] || pureName;

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${englishName},jp&appid=${API_KEY}&units=metric`;
        const res = await axios.get(url);
        let willRainSoon = false;

        // お気に入り都市のみ雨予報を呼び出す
        if (isFavorite) {
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${englishName},jp&appid=${API_KEY}&units=metric`;
          const fRes = await axios.get(forecastUrl);
          // 直近3〜6時間（index 0〜1）に雨があるか判定
          willRainSoon = fRes.data.list.slice(0, 2).some((item: any) =>
            item.weather[0].main === 'Rain'
          );
        }

        setData({
          temp: Math.round(res.data.main.temp),
          main: res.data.weather[0].main,
          // 自分が低気圧でしんどいので、気圧機能を追加
          pressure: res.data.main.pressure,
          willRain: willRainSoon
        });
      } catch (e) {
        console.error(`${pref}のデータ取得に失敗:`, e);
      }
    };
    fetchSmallWeather();
  }, [pref]);

  // フィルタリング: 一致しない場合はnullを返して行ごと非表示
  if (data && weatherFilter !== "All" && data.main !== weatherFilter) {
    return null;
  }

  // アラート判定（1010hPa以下を注意に設定）
  const isLowPressure = data && data.pressure <= 1010;
  // 雨、または詳細を見てほしい天候
  const needsDetailAlert = isFavorite && data && (
    data.main === 'Rain' ||
    data.main === 'Drizzle' ||
    data.main === 'Thunderstorm' ||
    data.willRain
  );
  return (
    <div className="list-item-row" style={{
      backgroundColor: isFavorite ? '#fff9c4' : 'transparent',
      borderLeft: isFavorite ? '4px solid #2196f3' : '4px solid transparent',
      padding: '12px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      animation: 'fadeIn 0.3s ease'
    }}>
      {/* 左側：県名 ＋ 雨アラートバッジ */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '6px',
        // flexWrap: 'wrap',
        minWidth: 0,
        overflow: 'hidden'
      }}>
        <span style={{
          fontWeight: 'bold',
          color: '#333',
          whiteSpace: 'nowrap',
          fontSize: '0.95rem',
          flexShrink: 0,
          maxWidth: 'none'
        }}>
          {pref}
        </span>

        {needsDetailAlert && (
          <span style={{
            fontSize: '0.65rem',
            backgroundColor: '#fff1f0',
            color: '#cf1322',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #ffa39e',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            width: 'fit-content'
          }}>
            ☔ 雨注意！
          </span>
        )}
      </div>

      {/* 右側：数値・アイコン・詳細ボタン */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginLeft: 'auto',
        flexShrink: 0
      }}>
        {data ? (
          <>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              lineHeight: '1.2'
            }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{data.temp}℃</span>
              <span style={{
                fontSize: '0.7rem',
                color: isLowPressure ? '#e53935' : '#888',
                fontWeight: isLowPressure ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
                gap: '1px'
              }}>
                {isLowPressure && <span style={{ fontSize: '0.6rem' }}>⚠️</span>}
                {data.pressure}<span style={{ fontSize: '0.6rem' }}>hPa</span>
              </span>
            </div>
            <WiComp weather={data.main} size={24} />
          </>
        ) : (
          <span style={{ fontSize: '0.8rem', color: '#ccc' }}>...</span>
        )}

        <Link to={`/detail/${pref}`} className="detail-link" style={{
          padding: '4px 8px',
          fontSize: '0.75rem',
          whiteSpace: 'nowrap'
        }}>
          詳細
        </Link>
      </div>
    </div>
  );
};

/**
 * WeatherList: 全国一覧画面のメイン
 */
const WeatherList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherFilter, setWeatherFilter] = useState("All");

  const favoriteCity = localStorage.getItem('defaultCity');

  // 1. まず全県から「検索条件に合うもの」を抽出
  const matchedPrefectures = allPrefectures.filter(pref => {
    const isPrefMatch = pref.includes(searchTerm);
    const isRegionMatch = Object.keys(regionData).some(region =>
      region.includes(searchTerm) && regionData[region].includes(pref)
    );
    return isPrefMatch || isRegionMatch;
  });

  // 2. お気に入りを一番上に、かつリスト内の重複を消すロジック
  let finalDisplayList = [...matchedPrefectures];

  if (favoriteCity) {
    const listWithoutFavorite = matchedPrefectures.filter(pref => pref !== favoriteCity);
    const isFavoriteHit = favoriteCity.includes(searchTerm);

    if (searchTerm === "" || isFavoriteHit) {
      finalDisplayList = [favoriteCity, ...listWithoutFavorite];
    } else {
      finalDisplayList = listWithoutFavorite;
    }
  }

  const filterOptions = [
    { label: "すべて", value: "All" },
    { label: "晴れ", value: "Clear" },
    { label: "曇り", value: "Clouds" },
    { label: "雨", value: "Rain" },
    { label: "雪", value: "Snow" },
  ];

  return (
    <div className="nationwide-container" style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ textAlign: 'left', marginBottom: '15px' }}>
        <Link to="/" className="nationwide-mini-button" style={{ backgroundColor: '#fff', color: '#546e7a' }}>
          🏠 TODOに戻る
        </Link>
      </div>
      <h2 style={{ color: '#546e7a', marginBottom: '20px' }}>全国の天気一覧</h2>

      <input
        type="text"
        className="weather-list-input"
        placeholder="都道府県名や地方名を入力（例:東京、関東）"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '0 15px',
          width: '85%',
          maxWidth: '350px',
          height: '40px',
          borderRadius: '20px',
          border: '1px solid #ddd',
          marginBottom: '15px',
          fontSize: '16px',
          outline: 'none',
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          WebkitAppearance: 'none'
        }}
      />

      <div className="filter-container" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '4px',
        flexWrap: 'nowrap',
        overflowX: 'hidden',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto 15px'
      }}>
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            className={`filter-btn ${weatherFilter === opt.value ? 'active' : ''}`}
            onClick={() => setWeatherFilter(opt.value)}
            style={{
              flex: 1,
              padding: '6px 2px',
              fontSize: '11px',
              whiteSpace: 'nowrap',
              minWidth: '0'
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="simple-list" style={{
        textAlign: 'left',
        maxWidth: '480px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        {finalDisplayList.map(pref => (
          <WeatherRow key={pref} pref={pref} weatherFilter={weatherFilter} isFavorite={pref === favoriteCity} />
        ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <Link to="/" className="back-link">
          🏠 TODOに戻る
        </Link>
      </div>
    </div>
  );
};

export default WeatherList;