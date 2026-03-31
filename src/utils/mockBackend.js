export const sendMockSOSPayload = (payload) => {
  return new Promise((resolve) => {
    console.log("Mock Backend Received SOS:", payload);
    setTimeout(() => {
        resolve({ success: true, message: "Alert Dispatched." });
    }, 1500);
  });
};
