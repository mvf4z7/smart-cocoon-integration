import * as dotenv from "dotenv";
import * as z from "zod";
import { NestClient } from "./nest-client";
import { SmartCocoonClient } from "./smart-cocoon-client";

const NEST_DEVICE_ID = "6416660000E6DE0C";
const PROJECT_ID = "a82a518f-da26-474b-90b9-6ba4a8877865";

export async function handler(event: unknown, context: unknown) {
  dotenv.config();
  const config = parseConfig(process.env);

  const [smartCocoonClient, nestClient] = await Promise.all([
    SmartCocoonClient.authenticate({
      email: config.smartCocoon.email,
      password: config.smartCocoon.password,
    }),
    NestClient.authenticate({
      clientId: config.google.oauthClientId,
      clientSecret: config.google.oauthClientSecret,
      refreshToken: config.google.refreshToken,
    }),
  ]);

  const [fans, thermostat] = await Promise.all([
    smartCocoonClient.listFans(),
    nestClient.getThermostat(
      config.google.deviceAccessProjectId,
      config.google.deviceId
    ),
  ]);

  for (const fan of fans) {
    const hvacStatus =
      thermostat.traits["sdm.devices.traits.ThermostatHvac"].status;
    const hvacFanStatus = thermostat.traits["sdm.devices.traits.Fan"].timerMode;

    const heatingOrCooling =
      hvacStatus === "COOLING" || hvacStatus === "HEATING";
    const hvacFanRunning = hvacFanStatus === "ON";
    const hvacOn = heatingOrCooling || hvacFanRunning;

    const fanOn = fan.fan_on;

    if (hvacOn && !fanOn) {
      await smartCocoonClient.updateFan(fan.id, { mode: "always_on" });
      console.log(
        `Fan ${fan.id} turned on: HVAC Status=${hvacStatus} | HVAC Fan Status=${hvacFanStatus}`
      );
    } else if (!hvacOn && fanOn) {
      await smartCocoonClient.updateFan(fan.id, { mode: "always_off" });
      console.log(
        `Fan ${fan.id} turned off: HVAC Status=${hvacStatus} | HVAC Fan Status=${hvacFanStatus}`
      );
    } else {
      console.log(
        `No changes needed for fan ${fan.id}: Smart Cocoon Status=${fanOn} | HVAC Status=${hvacStatus} | HVAC Fan Status=${hvacFanStatus}`
      );
    }
  }
}

/**
 * authorization link
 * https://nestservices.google.com/partnerconnections/a82a518f-da26-474b-90b9-6ba4a8877865/auth?redirect_uri=http://localhost&access_type=offline&prompt=consent&client_id=103949787762591375139&response_type=code&scope=https://www.googleapis.com/auth/sdm.service
 */

interface Config {
  google: {
    deviceAccessProjectId: string;
    deviceId: string;
    oauthClientId: string;
    oauthClientSecret: string;
    refreshToken: string;
  };
  smartCocoon: {
    email: string;
    password: string;
  };
}

function parseConfig(environment: NodeJS.Process["env"]): Config {
  const environmentSchema = z.object({
    GOOGLE_DEVICE_ACCESS_PROJECT_ID: z.string(),
    GOOGLE_DEVICE_ID: z.string(),
    GOOGLE_OAUTH_CLIENT_ID: z.string(),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
    GOOGLE_REFRESH_TOKEN: z.string(),
    SMART_COCOON_EMAIL: z.string(),
    SMART_COCOON_PASSWORD: z.string(),
  });

  const parsedEnvironment = environmentSchema.parse(process.env);

  return {
    google: {
      deviceAccessProjectId: parsedEnvironment.GOOGLE_DEVICE_ACCESS_PROJECT_ID,
      deviceId: parsedEnvironment.GOOGLE_DEVICE_ID,
      oauthClientId: parsedEnvironment.GOOGLE_OAUTH_CLIENT_ID,
      oauthClientSecret: parsedEnvironment.GOOGLE_OAUTH_CLIENT_SECRET,
      refreshToken: parsedEnvironment.GOOGLE_REFRESH_TOKEN,
    },
    smartCocoon: {
      email: parsedEnvironment.SMART_COCOON_EMAIL,
      password: parsedEnvironment.SMART_COCOON_PASSWORD,
    },
  };
}
