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
}

export interface WeatherProps {
  totalCount: number;
  uncompletedCount: number;
}