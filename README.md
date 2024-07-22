# Claude Chatbot

This project is a chatbot using Anthropic's Claude API, developed with Angular and Firebase.

## Initial Setup

### Prerequisites

- Node.js (version 18 or higher)
- Angular CLI
- Firebase account
- Anthropic Claude API key

### Installation

1. Clone the repository:
   git clone https://github.com/thibaud57/claude-chatbot.git
   cd claude-chatbot
2. Install dependencies:
   npm install
3. Navigate to cd functions and install dependencies: npm install

### Environment Configuration

#### Frontend (Angular)

1. Navigate to the `src/environments/` folder
2. Create two files: `environment.ts` and `environment-development.ts` and copy `environment.example.ts` inside
3. Fill `environment.ts` and `environment-development.ts` with your Firebase configurations:
  ``` 
export const environment = {
      production: false // or true,
      firebaseConfig: {
      apiKey: 'YOUR_API_KEY',
      authDomain: 'YOUR_AUTH_DOMAIN',
      projectId: 'YOUR_PROJECT_ID',
      // ... other Firebase configurations
      },
      apiUrl: "https://[REGION]-[YOUR_FIREBASECONFIG_PROJECT_ID].cloudfunctions.net/api/chat"
      // should looks like this url "https://europe-west1-nom-du-projet.cloudfunctions.net/api/chat"
};
```

#### Backend (Firebase Functions)

1. In the `functions/` folder, create a `.env` file
2. Copy `functions/.env.example` in `functions/.env`
3. Fill the values as:
   ```
   CLAUDE_API_KEY=your_claude_api_key
   REGION=your_firebase_preferred_region
   ```

**Important Note:** Never commit your `environment.ts` and `.env` files containing real keys. They are excluded
via `.gitignore` for security reasons.

## Development

To start the development server:
ng serve
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Customizing ChatService

The ChatService allows you to customize certain parameters for the Claude API. You can modify the following parameters in the sendMessage method of chat.service.ts:
- temperature: Controls the randomness of the model's output. Lower values make the output more deterministic, higher values make it more random. Default is 0.2.
- maxTokens: The maximum number of tokens to generate in the response. Default is 2048.

You can then call this method with custom values:
```
this.chatService.sendMessage(userMessage, 0.5, 1000).subscribe(
   // ... handle the response
);
```


## Build

To build the project:
ng build
The build artifacts will be stored in the `dist/` directory.

## Deployment

1. Ensure Firebase CLI is installed and configured.
2. Deploy to Firebase:
   firebase deploy or fireabse deploy

### Deploying Functions

When you make changes to the backend functions or during the initial setup:

1. Navigate to the `functions` directory:
   cd functions

2. Install dependencies (if it's your first time or you've updated packages):
   npm install

3. Deploy only the functions:
   firebase deploy --only functions

This step is crucial after any modifications to your Firebase Functions or during the initial setup to ensure your
backend is up to date.

## Further Help

For more help on Angular CLI, use `ng help` or check out
the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
