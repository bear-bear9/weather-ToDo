import React from 'react';
import { Box } from "@mui/material";
import { WiCompProps } from './types';

// 天候アイコンの外部コンポーネント
import {
    WiDaySunny,
    WiCloudy,
    WiRain,
    WiSnow,
    WiThunderstorm,
    WiFog,
} from 'weather-icons-react';

const WiComp: React.FC<WiCompProps> = ({ weather, size = 100 }) => {

    const getWeatherIcon = () => {
        switch (weather) {
            // 晴れ：エネルギッシュなオレンジ
            case 'Clear':
                return <WiDaySunny size={size} color='#f39c12' />;

            // 曇り：背景（ミントグリーン）と同化しないよう、
            // 視認性の高い濃いめのブルーグレーに変更
            case 'Clouds':
                return <WiCloudy size={size} color='#546e7a' />;

            // 雨・霧雨：落ち着いたブルー
            case 'Rain':
            case 'Drizzle':
                return <WiRain size={size} color='#3498db' />;

            // 雪：背景と同化しやすいため、少し青みを帯びたグレーで境界を明確化
            case 'Snow':
                return <WiSnow size={size} color='#90a4ae' />;

            // 雷雨：重厚感のあるダークカラー
            case 'Thunderstorm':
                return <WiThunderstorm size={size} color='#2c3e50' />;

            // その他（霧など）：穏やかなグレー
            default:
                return <WiFog size={size} color='#95a5a6' />;
        }
    };

    return (
        // サイズが小さい（一覧用）ときは余白を詰め、中央揃えにする
        <Box sx={{ py: size > 50 ? 1 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getWeatherIcon()}
        </Box>
    );
};

export default WiComp;