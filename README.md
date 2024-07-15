# Claude Chatbot

This project is a chatbot using Anthropic's Claude API, developed with Angular and Firebase.

## Initial Setup

### Prerequisites
- Node.js (version 14 or higher)
- Angular CLI
- Firebase account
- Anthropic Claude API key

### Installation
1. Clone the repository:
   git clone https://github.com/your-name/claude-chatbot.git
   cd claude-chatbot

2. Install dependencies:
   npm install

### Environment Configuration

#### Frontend (Angular)
1. Navigate to the `src/environments/` folder
2. Create a file `environment.ts`
3. Fill `environment.ts` with your Firebase configurations:
   export const environment = {
   production: false,
   firebaseConfig: {
   apiKey: 'YOUR_API_KEY',
   authDomain: 'YOUR_AUTH_DOMAIN',
   projectId: 'YOUR_PROJECT_ID',
   // ... other Firebase configurations
   }
   };

#### Backend (Firebase Functions)
1. In the `functions/` folder, create a `.env` file
2. Add your Claude API key:
   CLAUDE_API_KEY=your_claude_api_key

**Important Note:** Never commit your `environment.ts` and `.env` files containing real keys. They are excluded via `.gitignore` for security reasons.

## Development

To start the development server:
ng serve
Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

To build the project:
ng build
The build artifacts will be stored in the `dist/` directory.

## Deployment

1. Ensure Firebase CLI is installed and configured.
2. Deploy to Firebase:
   firebase deploy

### Deploying Functions

When you make changes to the backend functions or during the initial setup:

1. Navigate to the `functions` directory:
   cd functions

2. Install dependencies (if it's your first time or you've updated packages):
   npm install

3. Deploy only the functions:
   firebase deploy --only functions

This step is crucial after any modifications to your Firebase Functions or during the initial setup to ensure your backend is up to date.

## Further Help

For more help on Angular CLI, use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
