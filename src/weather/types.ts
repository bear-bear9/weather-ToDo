export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

export interface WiCompProps {
  weather: string;
  size?: number; // アイコン固定値100を解除するために指定
}

export interface WeatherProps {
  totalCount: number;
  uncompletedCount: number;
}