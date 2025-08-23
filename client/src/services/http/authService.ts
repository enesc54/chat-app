import { get, post } from "./fetchClient";

export const login = async (email, password) =>
    await post("/auth/login", { email, password });

export const register = async user => await post("/auth/register", user);

export const forgotPassword = async email =>
    await post("/auth/forgot-password", { email });

export const resetPassword = async (resetToken, newPassword) =>
    await post(`/auth/reset-password?resetToken=${resetToken}`, {
        newPassword
    });
