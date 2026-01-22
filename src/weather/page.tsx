import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { WeatherData } from './types';
import WiComp from './WiComp';
import { cityNameJp } from './utils';
import './layout.css'

// 個人のAPI_KEYを使用
// スマホでも使えるようにアップロードするためAPI_KEYをマスク
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function WeatherPage({
    totalCount,
    uncompletedCount
}: {
    totalCount: number,
    uncompletedCount: number
}) {
    const [city, setCity] = useState('埼玉');
    // APIから取得したお天気データを保持する
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState('');

    const fetchWeather = async (cityName: string) => {
        const cityNameJpMatch = cityNameJp[cityName] || cityName;
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityNameJpMatch}&appid=${API_KEY}&units=metric&lang=ja`;
            const response = await axios.get(url);

            setWeather(response.data);
            setError('');
        } catch (err) {
            setError('都市名が見つかりません');
            setWeather(null);
        }
    };

    // バグ発生個所
    // 依存配列を追加することにより
    // 都市が切り替わって天気APIで取得するデータが切り替わらないバグを解消
    useEffect(() => {
        fetchWeather(city);
    }, [city, totalCount, uncompletedCount])

    return (
        <div className="weather-container">
            <div className="weather-upper-section">
                <h3 className="weather-title">天気検索</h3>
                <div className="weather-search-group">
                    <input
                        type="text"
                        className="weather-input"
                        placeholder="都市名を入力してEnter"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // Enterで瞬間にAPIを叩きに行く
                                fetchWeather(city);
                            }
                        }}
                    />
                </div>
            </div>

            {weather && (
                <div className="weather-lower-section">
                    <div className="weather-result-row">
                        <p className="city-name">{weather.name}</p>

                        <WiComp
                            key={weather.name}
                            weather={weather.weather[0].main}
                        />

                        <div className="temp-group">
                            <p className="weather-temp">{Math.round(weather.main.temp)}℃</p>
                            <p className="weather-description">{weather.weather[0].description}</p>
                        </div>
                    </div>

                    <div className="weather-message-area">
                        {/* 最新の温度を元に判定 */}
                        {weather.main.temp < 10 && <p style={{ color: '#5dade2', fontWeight: 'bold' }}>❄️ 今日は寒い！！</p>}
                        {weather.main.temp >= 25 && <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>☀️ 今日は暑い！！！</p>}
                        {weather.main.temp >= 20 && weather.main.temp < 25 && <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>☀️ 気温上昇注意！！！</p>}
                        {weather.main.temp >= 10 && weather.main.temp < 20 && <p style={{ color: '#2ecc71', fontWeight: 'bold' }}>🌿 過ごしやすい気温！！</p>}
                        {totalCount > 0 && uncompletedCount === 0 && (
                            <div className="celebration-message">
                                TODO消化完了！！
                            </div>
                        )}
                    </div>
                </div>
            )}
            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
        </div>
    );
}

export default memo(WeatherPage, (prevProps, nextProps) => {
    // バグ対応箇所：天気だけリアルタイムで更新できなくなるバグを解消
    return (
        prevProps.totalCount === nextProps.totalCount &&
        prevProps.uncompletedCount === nextProps.uncompletedCount
    );
});