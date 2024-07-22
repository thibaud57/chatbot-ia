export const environment = {
    prod: false,
    firebaseConfig : {}, // Your firebaseConfig
    apiUrl: "https://[REGION]-[YOUR_FIREBASECONFIG_PROJECT_ID].cloudfunctions.net/api/chat" // Need to be same region as .env in functions
};
