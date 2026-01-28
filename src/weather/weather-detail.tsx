import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { cityNameJp } from './utils';
import WiComp from './WiComp';
import './layout.css';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

/**
 * WeatherDetail: 特定の都道府県の現在の天気と3時間ごとの予報を表示
 * 特徴：低気圧アラート、PCマウスホイールの横スクロール変換、バグ対策済み
 */
const WeatherDetail = () => {
    const { cityName: prefName } = useParams<{ cityName: string }>();
    const [weather, setWeather] = useState<any>(null);
    const [forecast, setForecast] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // PCでの横スクロール操作を直接制御するためのRef
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAllWeatherData = async () => {
            if (!prefName) return;
            // バグ発生個所：高知県がインドのkochinを参照してしまう問題への対策済み
            const pureName = prefName.replace(/[都府県道]$/, "");
            const englishName = cityNameJp[pureName] || cityNameJp[prefName] || pureName;

            try {
                setLoading(true);
                // 現在の天気を取得
                const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${englishName},jp&appid=${API_KEY}&units=metric&lang=ja`;
                const currentRes = await axios.get(currentUrl);
                setWeather(currentRes.data);

                // 機能追加
                // 課題外だが必要機能と感じたので追加
                // 3時間ごとの予報を取得（直近24時間分＝8件）
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${englishName},jp&appid=${API_KEY}&units=metric&lang=ja&cnt=8`;
                const forecastRes = await axios.get(forecastUrl);

                if (forecastRes.data && forecastRes.data.list) {
                    setForecast(forecastRes.data.list);
                }
            } catch (e) {
                console.error("データの取得に失敗しました", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAllWeatherData();
    }, [prefName]);

    /**
     * 【UX向上】マウスホイールの「上下」を「横スクロール」に変換
     * バグ対応時にも活用していたaddEventListenerを使用
     * 同時に画面全体のガタつき（縦揺れ）を防止し、疲れにくい操作感を実現
     */
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            }
        };

        // 直接EventListenerを登録することでブラウザのPassive制約を回避
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [forecast]);

    if (loading) return <div className="loading-text">読み込み中...</div>;
    if (!weather) return <div className="error-text">データが見つかりませんでした</div>;

    return (
        <div className="nationwide-container detail-page">
            <h2 className="detail-title">{prefName} の現在の天気</h2>

            {/* 現在の天気メイン表示 */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <WiComp weather={weather.weather[0].main} size={100} />
                <p className="detail-description" style={{ fontSize: '1rem', color: '#555', margin: '5px 0' }}>
                    {weather.weather[0].description}
                </p>
            </div>a

            {/* 基本情報グリッド */}
            <div className="detail-info-grid">
                <div className="info-item">
                    <span className="label">気温</span>
                    <span className="value">{Math.round(weather.main.temp)}<span className="unit">℃</span></span>
                    <span style={{ fontSize: '1.2rem' }}>🌡️</span>
                </div>
                <div className="info-item">
                    <span className="label">湿度</span>
                    <span className="value">{weather.main.humidity}<span className="unit">%</span></span>
                    <span style={{ fontSize: '1.2rem' }}>💧</span>
                </div>
                <div className="info-item">
                    <span className="label">気圧</span>
                    {/* 気圧表示 */}
                    <span className="value">{weather.main.pressure}<span className="unit">hPa</span></span>
                    <span style={{ fontSize: '1.2rem' }}>📉</span>
                </div>
            </div>

            {/* 1010hpa以下の場合、 */}
            {weather.main.pressure <= 1010 && (
                <div className="health-advice" style={{
                    backgroundColor: '#fff3e0', padding: '8px 12px', borderRadius: '12px',
                    margin: '10px 0', borderLeft: '5px solid #ff9800', textAlign: 'left'
                }}>
                    <p style={{ margin: 0, color: '#e65100', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        ⚠️ 少し気圧が低めです
                    </p>
                </div>
            )}
            {/* 予報 */}
            <div className="forecast-section" style={{ width: '100%', marginTop: '10px' }}>
                <h3 style={{ fontSize: '1rem', color: '#546e7a', marginBottom: '8px', textAlign: 'left' }}>
                    🕒 3時間ごとの変化
                </h3>
                <div
                    className="forecast-scroll-container"
                    ref={scrollRef}
                    style={{
                        display: 'flex', overflowX: 'auto', gap: '12px',
                        padding: '10px 5px 20px 5px', width: '100%',
                        WebkitOverflowScrolling: 'touch', scrollBehavior: 'smooth'
                    }}
                >
                    {forecast.map((item, index) => {
                        const date = new Date(item.dt * 1000);
                        const hour = date.getHours();
                        const day = date.getDate();
                        const month = date.getMonth() + 1;

                        // 日付またぎの判定ロジック
                        const showDayLabel = index === 0 || new Date(forecast[index - 1].dt * 1000).getDate() !== day;
                        const isToday = new Date().getDate() === day;
                        const dayText = isToday ? "今日" : "明日";

                        const isRain = item.weather[0].main === 'Rain' || item.weather[0].main === 'Drizzle';
                        const isLow = item.main.pressure <= 1010;

                        return (
                            <div key={index} style={{ position: 'relative', paddingTop: '28px', flexShrink: 0 }}>
                                {showDayLabel && (
                                    <div style={{
                                        position: 'absolute', top: '0', left: '0',
                                        fontSize: '0.7rem', fontWeight: 'bold', color: '#00796b',
                                        backgroundColor: '#e0f2f1', padding: '2px 10px', borderRadius: '10px',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {index === 0 ? `${month}/${day} (${dayText})` : dayText}
                                    </div>
                                )}

                                <div style={{
                                    width: '105px', padding: '15px 10px',
                                    background: isRain ? '#e3f2fd' : '#ffffff',
                                    borderRadius: '15px', textAlign: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    border: isLow ? '2px solid #ffccbc' : '1px solid #eee'
                                }}>
                                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>{hour}:00</div>
                                    <WiComp weather={item.weather[0].main} size={35} />
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '5px 0' }}>
                                        {Math.round(item.main.temp)}℃
                                    </div>
                                    <div style={{
                                        fontSize: '0.7rem', color: isLow ? '#e53935' : '#999',
                                        fontWeight: isLow ? 'bold' : 'normal'
                                    }}>
                                        {item.main.pressure}hPa {isLow && "⚠️"}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="back-link-container" style={{
                marginTop: '20px',
                paddingBottom: '20px',
                display: 'flex',
                justifyContent: 'center',
                gap: '20px' // 隙間を 40px → 20px に
            }}>
                <Link to="/list" className="back-link" style={{ color: '#78909c', textDecoration: 'none' }}>
                    📝 前画面に戻る
                </Link>

                <Link to="/" className="back-link" style={{ color: '#78909c', textDecoration: 'none' }}>
                    🏠 ホームに戻る
                </Link>
            </div>
        </div>
    );
};

export default WeatherDetail;