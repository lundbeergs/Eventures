import jwtDecode from "jwt-decode";

export const isRefreshTokenValid = (refreshToken) => {
  try {
    const decodedToken = jwtDecode(refreshToken);
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    return expirationTime > currentTime;
  } catch (error) {
    console.log("Error decoding refresh token:", error);
    return false;
  }
};