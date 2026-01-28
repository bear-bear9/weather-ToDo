import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { WeatherData } from './types';
import WiComp from './WiComp';
import { cityNameJp } from './utils';
import './layout.css'

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

function WeatherPage({
    totalCount,
    uncompletedCount
}: {
    totalCount: number,
    uncompletedCount: number
}) {
    const [city, setCity] = useState(localStorage.getItem('defaultCity') || '埼玉');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState('');
    // バグ発生個所：高知県がインドのkochinを参照してしまう問題への対策済み
    const fetchWeather = async (cityName: string) => {
        const pureName = cityName.replace(/[都府県道]$/, "");
        const englishName = cityNameJp[pureName] || cityNameJp[cityName] || pureName;

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${englishName},jp&appid=${API_KEY}&units=metric&lang=ja`;
            const response = await axios.get(url);
            setWeather(response.data);
            localStorage.setItem('defaultCity', cityName);
            setError('');
        } catch (err) {
            setError('都市名が見つかりません');
            setWeather(null);
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, [city, totalCount, uncompletedCount])

    return (
        <div className="weather-container" style={{ padding: '10px' }}>
            <div className="weather-upper-section" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '4px',
            }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>天気検索</span>
                <input
                    type="text"
                    className="weather-input"
                    placeholder="入力してEnter"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchWeather(city); }}
                    style={{
                        width: '100px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        fontSize: '0.9rem'
                    }}
                />
                <Link to="/list" className="nationwide-mini-button" style={{
                    fontSize: '0.7rem',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    backgroundColor: '#fff',
                    border: '1px solid #007bff',
                    color: '#007bff',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                }}>
                    全国の天気や詳細はこちらから
                </Link>
            </div>
            <div style={{ minHeight: '14px', marginBottom: '8px' }}>
                {error ? (
                    <p style={{ color: 'red', fontSize: '10px', margin: 0, textAlign: 'center', fontWeight: 'bold' }}>
                        ⚠️ {error}
                    </p>) : (
                    <p style={{
                        color: '#555',
                        fontSize: '9px',
                        margin: 0,
                        padding: '2px 10px',
                        backgroundColor: '#fff9db', 
                        borderRadius: '10px',
                        display: 'inline-block',
                        border: '1px solid #ffec99'
                    }}>
                        💡 <span style={{ fontWeight: 'bold' }}>便利な機能:</span> 検索した都市が次回から自動で表示されます
                    </p>
                )}
            </div>
            {weather && (
                <div className="weather-lower-section" style={{
                    textAlign: 'center',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '10px',
                    padding: '8px'
                }}>
                    <div className="weather-result-row" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1rem' }}>{weather.name}</p>
                        <div style={{ transform: 'scale(0.8)', margin: '-10px' }}>
                            <WiComp key={weather.name} weather={weather.weather[0].main} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(weather.main.temp)}℃</p>
                            <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.7 }}>{weather.weather[0].description}</p>
                        </div>
                    </div>

                    <div className="weather-message-area" style={{ marginTop: '4px' }}>
                        {totalCount > 0 && uncompletedCount === 0 ? (
                            <div className="celebration-message" style={{
                                fontSize: '0.85rem',
                                color: '#f39c12',
                                fontWeight: 'bold',
                                border: '1px dashed #f39c12',
                                padding: '2px 8px',
                                display: 'inline-block',
                                borderRadius: '8px',
                                backgroundColor: '#fff'
                            }}>
                                ✨ タスク全部完了！！
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {weather.main.temp < 10 && <span style={{ color: '#5dade2' }}>❄️ 今日は寒いよ！！</span>}
                                {weather.main.temp >= 25 && <span style={{ color: '#e74c3c' }}>☀️ 今日は暑い！！！</span>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(WeatherPage, (prevProps, nextProps) => {
    return (
        prevProps.totalCount === nextProps.totalCount &&
        prevProps.uncompletedCount === nextProps.uncompletedCount
    );
});