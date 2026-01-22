import React from 'react';
import { Box } from "@mui/material";
import { WiCompProps } from './types';

// 天候アイコンの外部コンポーネント化対応
import {
    WiDaySunny,
    WiCloudy,
    WiRain,
    WiSnow,
    WiThunderstorm,
    WiFog,
} from 'weather-icons-react';

const WiComp: React.FC<WiCompProps> = ({ weather }) => {

    const getWeatherIcon = () => {
        switch (weather) {
            // 晴れ
            case 'Clear':
                return <WiDaySunny size={100} color='#f39c12' />;
            // 曇り
            case 'Clouds':
                return <WiCloudy size={100} color='#7f8c8d' />;
            // 雨
            case 'Rain':
            // 霧
            case 'Drizzle':
                return <WiRain size={100} color='#3498db' />;
            // 雪
            case 'Snow':
                return <WiSnow size={100} color='#ecf0f1' />;
            // 砂嵐
            case 'Thunderstorm':
                return <WiThunderstorm size={100} color='#2c3e50' />;
            default:
                return <WiFog size={100} color='#95a5a6' />;
        }
    };

    return <Box sx={{ py: 1 }}>{getWeatherIcon()}</Box>;
};


export default WiComp;