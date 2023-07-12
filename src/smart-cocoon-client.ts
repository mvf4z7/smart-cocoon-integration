import axios, { AxiosInstance } from "axios";

export class SmartCocoonClient {
  static readonly BASE_URL = "https://app.mysmartcocoon.com/api";
  static readonly USER_AGENT = "SmartCocoon/1 CFNetwork/1312 Darwin/21.0.0";

  private authenticationData: AuthenticationData;
  private axiosInstance: AxiosInstance;

  private constructor(authenticationData: AuthenticationData) {
    this.authenticationData = authenticationData;
    this.axiosInstance = axios.create({
      baseURL: SmartCocoonClient.BASE_URL,
      headers: {
        ["access-token"]: authenticationData.accessToken,
        client: authenticationData.client,
        uid: authenticationData.uid,
        "User-Agent": SmartCocoonClient.USER_AGENT,
      },
    });
  }

  static async authenticate(authorizationData: {
    email: string;
    password: string;
  }): Promise<SmartCocoonClient> {
    const url = `${this.BASE_URL}/auth/sign_in`;
    const response = await axios.post<SignInResponseData>(url, {
      email: authorizationData.email,
      password: authorizationData.password,
    });

    const { "access-token": accessToken, client, expiry } = response.headers;
    const authenticationData: AuthenticationData = {
      accessToken,
      client,
      expiry,
      uid: response.data.data.uid,
    };

    return new SmartCocoonClient(authenticationData);
  }

  async listFans(): Promise<SmartCocoonFan[]> {
    const response = await this.axiosInstance.get<{
      total: Number;
      fans: SmartCocoonFan[];
    }>("/fans");

    return response.data.fans;
  }

  async updateFan(
    fanId: number,
    data: Partial<Pick<SmartCocoonFan, "mode" | "speed_level">>
  ): Promise<SmartCocoonFan> {
    const response = await this.axiosInstance.put<SmartCocoonFan>(
      `/fans/${fanId}`,
      data
    );

    return response.data;
  }
}

interface SignInResponseData {
  data: {
    id: number;
    email: string;
    provider: "email";
    messaging_token: string;
    uid: string;
    name: string;
    nickname: string | null;
    image: null;
    allow_password_change: false;
  };
}

interface AuthenticationData {
  accessToken: string;
  client: string;
  expiry: number;
  uid: string;
}

interface SmartCocoonFan {
  id: number;
  fan_id: string;
  mqtt_password: string;
  last_connection: string;
  fan_on: boolean;
  power: number;
  speed_level: number;
  firmware_version: string;
  mode: "auto" | "eco" | "always_on" | "always_off";
  size: number;
  mqtt_username: string;
  room_id: number;
  predicted_room_temperature: string;
  is_room_estimating: boolean;
  is_room_schedule_running: boolean;
  thermostat_vendor: string;
  connected: boolean;
}
