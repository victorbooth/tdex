# Financial Dashboard

A modern, responsive financial dashboard built with React, TypeScript, and Tailwind CSS. Track your net worth, monitor bank accounts, credit cards, loans, investment portfolios, and ESPP (Employee Stock Purchase Plan) with PLOC (Personal Line of Credit) tracking - all synced with Google Sheets.

## Features

- **💰 Net Worth Tracking**: Real-time calculation of your total assets, liabilities, and net worth
- **🏦 Multi-Account Support**: Track checking, savings, credit cards, revolving credit, loans, and investment accounts
- **📈 Investment History**: View and manage your investment transactions (buys, sells, dividends, transfers)
- **🚀 Hey Sparty - ESPP Tracker**: Track your Employee Stock Purchase Plan with PLOC integration
  - Monitor quarterly pulls from your personal line of credit
  - Track interest charges on each pull
  - Calculate profit after fees and interest
  - View current offering periods with discount details
  - Track loan status from pull to payoff
- **📊 Visual Breakdown**: See your accounts organized by type with color-coded cards
- **🔄 Google Sheets Integration**: Use Google Sheets as your database with Google Apps Script backend
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS
- **⚡ Fast & Lightweight**: Built with Vite for optimal performance

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts (ready for future implementation)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Backend**: Google Apps Script (free, serverless)
- **Database**: Google Sheets
- **Deployment**: GitHub Pages (free hosting)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google account (for Google Sheets integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd financial-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Google Sheets Backend**

   a. Create a new Google Sheet
   
   b. Go to `Extensions` > `Apps Script`
   
   c. Copy the code from `google-apps-script/code.gs` and paste it into the Apps Script editor
   
   d. Save the project
   
   e. Deploy as Web App:
      - Click "Deploy" > "New Deployment"
      - Select type: "Web app"
      - Description: "Financial Dashboard API"
      - Execute as: "Me"
      - Who has access: "Anyone" (or "Anyone with Google account" for more security)
      - Click "Deploy"
   
   f. Copy the Web App URL

4. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

5. **Initialize your Google Sheet**
   
   In the Apps Script editor, select the `initializeSheet` function from the dropdown and run it once. This will create the necessary sheets and headers.

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Add your account data**
   
   Open your Google Sheet and add your accounts to the "Accounts" sheet with the following columns:
   - id: Unique identifier
   - name: Account name
   - type: checking, savings, credit_card, revolving_credit, loan, or investment
   - balance: Current balance (negative for liabilities)
   - currency: Currency code (e.g., USD)
   - institution: Bank/institution name
   - lastUpdated: Last update timestamp
   - color: Hex color code for the card border (optional)

## Project Structure

```
financial-dashboard/
├── google-apps-script/     # Google Apps Script backend code
│   └── code.gs
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── AccountCard.tsx
│   │   ├── AccountBreakdown.tsx
│   │   ├── Header.tsx
│   │   ├── InvestmentHistory.tsx
│   │   └── NetWorthSummary.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useFinancialData.ts
│   ├── services/           # API services
│   │   └── googleSheets.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment to GitHub Pages

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy using gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add to package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/financial-dashboard",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

## Security Considerations

⚠️ **Important**: This dashboard is designed for personal use. Consider the following:

1. **Google Apps Script Access**: When deploying, choose "Anyone with Google account" instead of "Anyone" for better security

2. **Sensitive Data**: Never commit your `.env` file or Google Apps Script URL to version control

3. **Local Hosting Alternative**: For enhanced security, consider self-hosting:
   - Use Docker to containerize the app
   - Host on a private server or Raspberry Pi
   - Use ngrok or Cloudflare Tunnel for secure remote access

4. **Future Enhancements**: Consider adding authentication for multi-user households

## Self-Hosting Option

For those who prefer not to use Google Sheets, you can self-host with:

### Option 1: SQLite + Express Backend
- Replace Google Apps Script with a simple Node.js/Express API
- Use SQLite for local database storage
- Sync between devices using Syncthing or similar

### Option 2: Docker Deployment
```yaml
# docker-compose.yml
version: '3'
services:
  financial-dashboard:
    build: .
    ports:
      - "3000:80"
    restart: unless-stopped
```

### Option 3: Cloudflare Tunnel
- Host locally on your network
- Use Cloudflare Tunnel for secure remote access
- No need to open ports on your router

## Adding Investment Data

You can add investment transaction history in two ways:

1. **Manual Entry**: Add rows directly to the "InvestmentHistory" sheet in Google Sheets

2. **Import from Brokerage**: 
   - Export CSV from your brokerage (Fidelity, Vanguard, etc.)
   - Format the data to match the schema
   - Import into Google Sheets

## Future Enhancements

- [ ] Interactive charts with Recharts
- [ ] Budget tracking and categorization
- [ ] Bill reminders and recurring transactions
- [ ] Financial goal tracking
- [ ] Multi-currency support
- [ ] Authentication for multi-user access
- [ ] Mobile app version
- [ ] Automatic bank sync via Plaid API
- [ ] Export reports to PDF/CSV

## License

MIT License - feel free to use this for your personal financial tracking!

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for better financial visibility**
