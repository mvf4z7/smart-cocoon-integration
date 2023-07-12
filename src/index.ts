// import { JWT } from "google-auth-library";

import { SmartCocoonClient } from "./smart-cocoon-client";

const NEST_DEVICE_ID = "6416660000E6DE0C";
const PROJECT_ID = "a82a518f-da26-474b-90b9-6ba4a8877865";

async function main() {
  // const client = new JWT({
  //   email: "smart-cocoon-integration@smart-co-392104.iam.gserviceaccount.com",
  //   key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJVD05Kc0rrVYL\nDo6qG8zmlVc1/e76VZjbHOZglrtsxNbKNLR3sNlD8QMfwZJUOpApYycVN6dRruhv\n04i449QwnsJGbNdHSvOSTQNmzzR5FW62+eEMcalPHzWo7xBOhMQBc86nKwQGwg3A\nM5XStoZtQUpo9aFQIZlFH1j00oeBhZpVxHhxhC6Z012HjLTXvjCq/rGhWajGEanV\nCABhG3mdWHZeyFbs0GVaIn3ApzoE2ReWKGqdZQWQLUTmeSZUALqurCWC4+5+T9uT\n/1gDt3eLUNXsDI3W6ZPMP8j/SSRRvX3i7GUrwhNzg6uj7EFjHr88UrC0YtjEazTt\nWu0hp5KRAgMBAAECggEAGiMTDa7vwWoFP8s52eYLtwBlVuTqwlocIuTAwy0JE7Ox\nlNpnIXDL9rDn2xa6GgWTqKPZiOd1k+UAAmCKdpexTkdAvnwr2J1nkLM/K/jeKD1l\nkbX6sa8MhXFDpJ+1/2jnZK7gVxMpDdLh48rD+nE9c2/5/9//phOuk8A1lWxthh1o\ngQSpAeDNnaOC1shijrIsyOjxUtV6JakTDFv2qpMEFMEixHFKC3/4bhVVQt0M+ixU\nECLGUPUeJE1l+bD1eE9gulg5oTsfBx1dYcghVAZ0lZHYzctDl1NertPCncLin00v\n2NNoOFGG1yes6P3MC1LrSd/Yw/s0UnI6R9BWmE+gzwKBgQD39Kcf9W8TdEcexHGi\n0yICDl0mTYRdYAwuuWgyqO9c0hYzAUsCjy0PgaL7x+CGlFThPCgREP8PN2yTRqTL\n50mSu3xdFvS0VfVzR8VVdS27wPtzmSrudBvy5X8tO00Zupr+W4jEbYSmJoV6Z8Ay\nB4bXoWowOPrP9mvEEqLBT5EgGwKBgQDP3FaPARxHAf05WjRjzUE+lNYSeQYaorVw\nRd+cavqsCIcs/KHY/kV0n/akyyhDcUePtMdpzzZamYmeOr0DudUbtlGMWcxoHwD5\nR+xtiaKS0uQNuuQbvrm6xZI7vypPstZRrFm+DDuJX4MXonFId7PPAj5w7m0ve/bi\nQKgPt+I6wwKBgH8VCBbsHrrUzKKrQiaWmYZ+QCWicyW8VWIZKptUVCG5lyEbF4u/\nP/QDmDn9LkkrevlZcJuWn3L4EBDHkyziZKXsq4e2fUJ0D/G+phfvj7n75aRQq109\naxmpn+3Zx+FY75lP5p/uFZ9mfODIjgvWKbkYhKkkev/dJ0x91KbJFfNjAoGAApW7\n4dVis6Nbsc3kXuVbjVquetZUdBpX5UiJKlnOOjt06uNNY/RtirC+kXgRTR1ohWn7\nHN69z0yfgH88gIJcGxceVn97YkQYcAEr+ITAp9DFk0IiuhGaH697TRDohsszjRp2\nlz1xtBii+bVEcWFDtCxT+HWOmAuTm2awcFmaD58CgYEArq6wuzpyjeG7xDIwW7zo\n21s57TFaXQkrZOCy9DyThbFRat6mdcupKO9QnusnFVZJ2odxn1LxAu2Q8pkdD5Ee\nj7YekWvLgBNF8tKDUIeOW9wUWNFnk2VtitwU+nJfC1FrBIoA49i1pH6OhW3Imkji\ntbwo6x39wu74l/wN6XHgyn8=\n-----END PRIVATE KEY-----\n",
  //   scopes: ["https://www.googleapis.com/auth/sdm.service"],
  // });
  // const x = "/enterprises/project-id/devices/device-id";
  // const url = `https://smartdevicemanagement.googleapis.com/v1/enterprises/${PROJECT_ID}/devices/${NEST_DEVICE_ID}`;
  // const res = await client.request({ url });
  // console.log(res.data);
  // // After acquiring an access_token, you may want to check on the audience, expiration,
  // // or original scopes requested.  You can do that with the `getTokenInfo` method.
  // const tokenInfo = await client.getTokenInfo(
  //   client.credentials.access_token ?? ""
  // );
  // console.log(tokenInfo);

  const smartCocoonClient = await SmartCocoonClient.authenticate({
    email: "mike.fanger@gmail.com",
    password: process.env.SMART_COCOON_PASSWORD!,
  });

  const fans = await smartCocoonClient.listFans();
  console.log(fans);

  await smartCocoonClient.updateFan(fans[0].id, { mode: "eco" });
}

main().catch(console.error);

/**
 * authorization link
 * https://nestservices.google.com/partnerconnections/a82a518f-da26-474b-90b9-6ba4a8877865/auth?redirect_uri=http://localhost&access_type=offline&prompt=consent&client_id=103949787762591375139&response_type=code&scope=https://www.googleapis.com/auth/sdm.service
 */
