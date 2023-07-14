import axios, { AxiosInstance } from "axios";
export class NestClient {
  private readonly accessToken: string;
  private readonly axiosInstance: AxiosInstance;

  private constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.axiosInstance = axios.create({
      baseURL: "https://smartdevicemanagement.googleapis.com",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  async getThermostat(
    projectId: string,
    deviceId: string
  ): Promise<ThermostatDevice> {
    const url = `/v1/enterprises/${projectId}/devices/${deviceId}`;
    const response = await this.axiosInstance.get<ThermostatDevice>(url);

    return response.data;
  }

  static async authenticate({
    clientId,
    clientSecret,
    refreshToken,
  }: AuthenticationData): Promise<NestClient> {
    const tokenRefreshUrl = `https://www.googleapis.com/oauth2/v4/token?client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`;
    const response = await axios.post<RefreshTokenResponse>(tokenRefreshUrl);

    return new NestClient(response.data.access_token);
  }
}

export interface AuthenticationData {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface ThermostatDevice {
  name: string;
  type: "sdm.devices.types.THERMOSTAT";
  assignee: string;
  traits: {
    "sdm.devices.traits.Info": {
      customName: string;
    };
    "sdm.devices.traits.Humidity": {
      ambientHumidityPercent: number;
    };
    "sdm.devices.traits.Connectivity": {
      status: "OFFLINE" | "ONLINE";
    };
    "sdm.devices.traits.Fan": {
      timerMode: "ON" | "OFF";
      timerTimeout: string;
    };
    "sdm.devices.traits.ThermostatMode": {
      mode: "HEAT" | "COOL" | "HEATCOOL" | "OFF";
      availableModes: ("HEAT" | "COOL" | "HEATCOOL" | "OFF")[];
    };
    "sdm.devices.traits.ThermostatEco": {
      availableModes: ("OFF" | "MANUAL_ECO")[];
      mode: "OFF" | "MANUAL_ECO";
      heatCelsius: number;
      coolCelsius: number;
    };
    "sdm.devices.traits.ThermostatHvac": {
      status: "OFF" | "HEATING" | "COOLING";
    };
    "sdm.devices.traits.Settings": {
      temperatureScale: "FAHRENHEIT" | "CELSIUS";
    };
    "sdm.devices.traits.ThermostatTemperatureSetpoint": {
      coolCelsius?: number;
      heatCelsius?: number;
    };
    "sdm.devices.traits.Temperature": {
      ambientTemperatureCelsius: number;
    };
  };
  parentRelations: [
    {
      parent: string;
      displayName: string;
    }
  ];
}
