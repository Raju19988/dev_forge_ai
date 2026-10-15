export interface HealthResponse {
  success: boolean;
  message: string;
}

export const getHealthStatus = (): HealthResponse => {
  return {
    success: true,
    message: "DevForge AI API is running",
  };
};