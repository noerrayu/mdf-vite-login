import Cookies from "js-cookie";

const COOKIE_CONFIG = {
  expires: 1,
  //   path: "/",
  //   domain: "host.mylocal.com",
  //   secure: true,
  //   sameSite: "lax",
};

export const setAccessToken = (token) => {
  Cookies.set("access_token", token, COOKIE_CONFIG);
};

export const getAccessToken = () => {
  return Cookies.get("access_token");
};

export const removeAccessToken = () => {
  Cookies.remove("access_token");
};
