import axios, { AxiosResponse } from "axios";
import { GoogleAuthResponse } from "./types";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth
export const googleAuth = (
  token: string
): Promise<AxiosResponse<GoogleAuthResponse>> =>
  api.post("/auth/google", { token });

// Users
export const getUser = (userId: string) => api.get(`/users/${userId}`);
export const updateUser = (userId: string, data: any) => api.put(`/users/${userId}`, data);
export const completeOnboarding = (userId: string, data: any) =>
  api.post(`/users/${userId}/onboarding`, data);

// Doctors
export const getDoctors = (specialization?: string) =>
  api.get("/doctors", { params: { specialization } });
export const getDoctor = (doctorId: string) => api.get(`/doctors/${doctorId}`);
export const findNearbyDoctors = (location: any) =>
  api.post("/doctors/nearby", location);

// Symptoms
export const createSymptomReport = (data: any) => api.post("/symptoms/report", data);
export const getSymptomHistory = (userId: string) =>
  api.get(`/symptoms/${userId}/history`);

// Appointments
export const createAppointment = (data: any) => api.post("/appointments", data);
export const getUserAppointments = (userId: string, status: any) =>
  api.get(`/appointments/user/${userId}`, { params: { status } });
export const completeAppointment = (appointmentId: string, data: any) =>
  api.post(`/appointments/${appointmentId}/complete`, data);
export const getAppointmentSummary = (appointmentId: string) =>
  api.get(`/appointments/${appointmentId}/summary`);

// Emergency
export const detectEmergency = (data: any) => api.post("/emergency/detect", data);
export const getEmergencyContacts = () => api.get("/emergency/contacts");

export default api;
