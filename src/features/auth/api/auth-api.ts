import api, { publicApi } from "@/lib/axios-api";

export const loginApi = async (email, password) => {
  const response = await publicApi.post(
    "/auths/login",
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.data;
};

export const registerApi = async (username, email, password) => {
  const response = await publicApi.post(
    "/auths/register",
    { "user-name": username, email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

export const refreshToken = async (tokenData: {
  "access-token": string;
  "refresh-token": string;
}) => {
  const response = await publicApi.post("/auths/refresh-token", tokenData);
  return response.data.data;
};

export interface ResetPasswordRequest {
  id: string;
  "new-password": string;
}

export const resetPasswordApi = async (payload: ResetPasswordRequest) => {
  const { data } = await api.patch("/auths/re-pasword", payload);
  return data;
};
