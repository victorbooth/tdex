# Financial Dashboard - Setup Guide

## Quick Start for You and Your Wife

This dashboard is designed to be accessible from multiple devices. Here are your options:

### Option 1: GitHub Pages + Google Sheets (Recommended - FREE)

**Pros:**
- Completely free hosting
- Accessible from anywhere
- Easy to set up
- Both you and your wife can access from any device

**Steps:**

1. **Push to GitHub**
   ```bash
   cd financial-dashboard
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/financial-dashboard.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repo on GitHub
   - Settings > Pages
   - Source: Deploy from branch > main > /dist
   - Save

3. **Set up Google Sheets** (detailed in README.md)
   - Create Google Sheet
   - Add Apps Script code
   - Deploy as Web App
   - Add your account data

4. **Install gh-pages and deploy**
   ```bash
   npm install --save-dev gh-pages
   npm run deploy
   ```

5. **Share with your wife**
   - Send her the GitHub Pages URL
   - She can bookmark it on her computer/phone

### Option 2: Self-Hosted on Your Network

**Pros:**
- Complete control over your data
- No third-party hosting
- Faster local access

**Requirements:**
- A computer/server that stays on (could be a Raspberry Pi, old laptop, etc.)
- Basic networking knowledge

**Steps:**

1. **Install Docker** on your host machine

2. **Create a Dockerfile** in the project root:
   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Create docker-compose.yml**:
   ```yaml
   version: '3'
   services:
     financial-dashboard:
       build: .
       ports:
         - "3000:80"
       restart: unless-stopped
   ```

4. **Run the container**:
   ```bash
   docker-compose up -d
   ```

5. **Access locally**: `http://YOUR_SERVER_IP:3000`

6. **For remote access** (from outside your home):
   
   **Option A: Cloudflare Tunnel** (FREE & SECURE)
   - Sign up at cloudflare.com
   - Install cloudflared on your server
   - Create a tunnel to expose port 3000
   - Get a secure URL like `https://your-dashboard.trycloudflare.com`
   
   **Option B: ngrok** (FREE tier available)
   ```bash
   npm install -g ngrok
   ngrok http 3000
   ```

### Option 3: Hybrid Approach (BEST OF BOTH WORLDS)

Use Google Sheets for data storage but self-host the frontend:

1. Set up Google Sheets backend (as described in Option 1)
2. Self-host the React app (as described in Option 2)
3. Configure the `.env` file with your Google Apps Script URL
4. Access from anywhere with Cloudflare Tunnel

This gives you:
- Free, reliable database (Google Sheets)
- Control over the frontend hosting
- Secure access for both of you

## Security Best Practices

1. **NEVER commit sensitive data**:
   - Don't commit `.env` file
   - Don't commit Google Apps Script URLs to public repos
   - Use environment variables

2. **For Google Apps Script**:
   - Choose "Anyone with Google account" instead of "Anyone"
   - Share the sheet only with trusted accounts
   - Consider using a dedicated Google account for this

3. **For self-hosting**:
   - Use HTTPS (Cloudflare provides this free)
   - Keep your server updated
   - Use strong passwords
   - Consider adding basic auth

## Adding Your Data

### Google Sheets Structure

**Accounts Sheet Columns:**
| id | name | type | balance | currency | institution | lastUpdated | color |
|----|------|------|---------|----------|-------------|-------------|-------|
| 1 | Main Checking | checking | 5420.50 | USD | Chase Bank | 2024-01-15 | #3b82f6 |
| 2 | Visa Card | credit_card | -1250.75 | USD | Chase Bank | 2024-01-15 | #ef4444 |

**Account Types:**
- `checking`
- `savings`
- `credit_card`
- `revolving_credit`
- `loan`
- `investment`

**InvestmentHistory Sheet Columns:**
| id | accountId | date | type | symbol | quantity | price | totalValue | fees | notes |
|----|-----------|------|------|--------|----------|-------|------------|------|-------|
| 1 | 6 | 2024-01-15 | buy | VTI | 50 | 220.50 | 11025.00 | 0 | Monthly investment |

**Transaction Types:**
- `buy`
- `sell`
- `dividend`
- `transfer`

## Updating Balances

You have several options:

1. **Manual Update in Google Sheets**
   - Simply edit the balance column in the Accounts sheet
   - The dashboard will reflect changes on next refresh

2. **Manual Update via Dashboard** (Future feature)
   - Add a form to update balances directly from the UI

3. **Automated Updates** (Advanced)
   - Use Google Apps Script triggers
   - Connect to bank APIs (requires additional setup)

## Troubleshooting

**Dashboard shows mock data instead of my Google Sheets data:**
- Check that your Google Apps Script URL is correct in `.env`
- Verify the script is deployed and accessible
- Check browser console for errors

**Can't access from another device:**
- For GitHub Pages: Make sure the repo is public or you're logged in
- For self-hosted: Check firewall settings and use Cloudflare Tunnel

**Google Apps Script errors:**
- Make sure you ran `initializeSheet()` function once
- Check that sheet names match exactly: "Accounts", "InvestmentHistory"
- Verify deployment settings (Execute as: Me, Access: Anyone)

## Next Steps

Once you have the basics set up:

1. **Add all your accounts** to Google Sheets
2. **Import investment history** from your brokerage statements
3. **Customize colors** for different account types
4. **Set up automatic refresh** (consider Google Apps Script time triggers)
5. **Share with your wife** and get her input on the layout

## Questions?

Feel free to customize this setup based on your needs. The architecture is flexible and can be adapted as your requirements change.

Good luck with your financial tracking! 📊💰
