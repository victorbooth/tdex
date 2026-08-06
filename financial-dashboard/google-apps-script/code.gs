/**
 * Google Apps Script for Financial Dashboard
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Create five sheets named: "Accounts", "InvestmentHistory", "ESPPLoans", "ESPPOfferings", "Config"
 * 3. Go to Extensions > Apps Script
 * 4. Delete any existing code and paste this entire script
 * 5. Save the project (Ctrl+S or File > Save)
 * 6. Deploy as Web App:
 *    - Click "Deploy" > "New Deployment"
 *    - Select type: "Web app"
 *    - Description: "Financial Dashboard API"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (or "Anyone with Google account" for more security)
 *    - Click "Deploy"
 * 7. Copy the Web App URL and add it to your .env file
 * 
 * SHEET STRUCTURE:
 * 
 * Accounts sheet columns:
 * A: id, B: name, C: type, D: balance, E: currency, F: institution, G: lastUpdated, H: color
 * 
 * InvestmentHistory sheet columns:
 * A: id, B: accountId, C: date, D: type, E: symbol, F: quantity, G: price, H: totalValue, I: fees, J: notes
 * 
 * ESPPLoans sheet columns:
 * A: id, B: pullDate, C: pullAmount, D: interestRate, E: interestAmount, F: quarter, G: purchaseDate, 
 * H: sharesPurchased, I: purchasePrice, J: salePrice, K: fees, L: profit, M: status, N: notes
 * 
 * ESPPOfferings sheet columns:
 * A: id, B: companyName, C: tickerSymbol, D: discountPercent, E: lookbackPeriod, F: offeringStartDate,
 * G: offeringEndDate, H: purchaseDate, I: maxContributionPercent, J: totalContributed, K: estimatedShares, L: estimatedProfit
 */

const SCRIPT_PROP = PropertiesService.getScriptProperties();

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch (action) {
      case 'getAccounts':
        return getContent(getAccounts());
      case 'getInvestmentHistory':
        return getContent(getInvestmentHistory());
      case 'getESPPData':
        return getContent(getESPPData());
      case 'getESPPOfferings':
        return getContent(getESPPOfferings());
      case 'test':
        return getContent({ success: true, message: 'API is working!' });
      default:
        return getContent({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    return getContent({ success: false, error: error.toString() });
  }
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  try {
    switch (action) {
      case 'updateAccountBalance':
        return getContent(updateAccountBalance(data.accountId, data.balance));
      case 'addInvestmentTransaction':
        return getContent(addInvestmentTransaction(data));
      default:
        return getContent({ success: false, error: 'Invalid action' });
    }
  } catch (error) {
    return getContent({ success: false, error: error.toString() });
  }
}

function getContent(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Get all accounts from the Accounts sheet
 */
function getAccounts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Accounts');
  if (!sheet) {
    return { success: false, error: 'Accounts sheet not found' };
  }
  
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const accounts = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[0]) { // Check if ID exists
      accounts.push({
        id: row[0],
        name: row[1],
        type: row[2],
        balance: parseFloat(row[3]) || 0,
        currency: row[4] || 'USD',
        institution: row[5],
        lastUpdated: row[6],
        color: row[7] || undefined
      });
    }
  }
  
  return { success: true, data: accounts };
}

/**
 * Get investment transaction history
 */
function getInvestmentHistory() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('InvestmentHistory');
  if (!sheet) {
    return { success: false, error: 'InvestmentHistory sheet not found' };
  }
  
  const rows = sheet.getDataRange().getValues();
  const transactions = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[0]) { // Check if ID exists
      transactions.push({
        id: row[0],
        accountId: row[1],
        date: formatDate(row[2]),
        type: row[3],
        symbol: row[4],
        quantity: parseFloat(row[5]) || 0,
        price: parseFloat(row[6]) || 0,
        totalValue: parseFloat(row[7]) || 0,
        fees: parseFloat(row[8]) || 0,
        notes: row[9] || ''
      });
    }
  }
  
  return { success: true, data: transactions };
}

/**
 * Update account balance
 */
function updateAccountBalance(accountId, newBalance) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Accounts');
  if (!sheet) {
    return { success: false, error: 'Accounts sheet not found' };
  }
  
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == accountId) {
      // Update balance in column D (index 3)
      sheet.getRange(i + 1, 4).setValue(newBalance);
      // Update lastUpdated in column G (index 6)
      sheet.getRange(i + 1, 7).setValue(new Date().toISOString());
      return { success: true };
    }
  }
  
  return { success: false, error: 'Account not found' };
}

/**
 * Add investment transaction
 */
function addInvestmentTransaction(transaction) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('InvestmentHistory');
  if (!sheet) {
    return { success: false, error: 'InvestmentHistory sheet not found' };
  }
  
  const newRow = [
    transaction.id || generateId(),
    transaction.accountId,
    transaction.date || new Date().toISOString(),
    transaction.type,
    transaction.symbol,
    transaction.quantity,
    transaction.price,
    transaction.totalValue,
    transaction.fees || 0,
    transaction.notes || ''
  ];
  
  sheet.appendRow(newRow);
  return { success: true };
}

/**
 * Get ESPP loan data from ESPPLoans sheet
 */
function getESPPData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ESPPLoans');
  if (!sheet) {
    return { success: false, error: 'ESPPLoans sheet not found' };
  }
  
  const rows = sheet.getDataRange().getValues();
  const loans = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[0]) { // Check if ID exists
      loans.push({
        id: row[0],
        pullDate: formatDate(row[1]),
        pullAmount: parseFloat(row[2]) || 0,
        interestRate: parseFloat(row[3]) || 0,
        interestAmount: parseFloat(row[4]) || 0,
        quarter: row[5] || '',
        purchaseDate: formatDate(row[6]),
        sharesPurchased: parseFloat(row[7]) || 0,
        purchasePrice: parseFloat(row[8]) || 0,
        salePrice: parseFloat(row[9]) || 0,
        fees: parseFloat(row[10]) || 0,
        profit: parseFloat(row[11]) || 0,
        status: row[12] || 'pending',
        notes: row[13] || ''
      });
    }
  }
  
  return { success: true, data: loans };
}

/**
 * Get ESPP offering periods from ESPPOfferings sheet
 */
function getESPPOfferings() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ESPPOfferings');
  if (!sheet) {
    return { success: false, error: 'ESPPOfferings sheet not found' };
  }
  
  const rows = sheet.getDataRange().getValues();
  const offerings = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row[0]) { // Check if ID exists
      offerings.push({
        id: row[0],
        companyName: row[1] || '',
        tickerSymbol: row[2] || '',
        discountPercent: parseFloat(row[3]) || 0,
        lookbackPeriod: row[4] === true || row[4] === 'TRUE' || row[4] === 'true',
        offeringStartDate: formatDate(row[5]),
        offeringEndDate: formatDate(row[6]),
        purchaseDate: formatDate(row[7]),
        maxContributionPercent: parseFloat(row[8]) || 0,
        totalContributed: parseFloat(row[9]) || 0,
        estimatedShares: parseFloat(row[10]) || 0,
        estimatedProfit: parseFloat(row[11]) || 0
      });
    }
  }
  
  return { success: true, data: offerings };
}

/**
 * Helper function to format dates
 */
function formatDate(date) {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date;
}

/**
 * Generate unique ID
 */
function generateId() {
  return Utilities.getUuid();
}

/**
 * Initialize the spreadsheet with proper headers (run once manually)
 */
function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create Accounts sheet
  let accountsSheet = ss.getSheetByName('Accounts');
  if (!accountsSheet) {
    accountsSheet = ss.insertSheet('Accounts');
  }
  const accountHeaders = ['id', 'name', 'type', 'balance', 'currency', 'institution', 'lastUpdated', 'color'];
  accountsSheet.getRange(1, 1, 1, accountHeaders.length).setValues([accountHeaders]);
  accountsSheet.getRange(1, 1, 1, accountHeaders.length).setFontWeight('bold');
  
  // Create InvestmentHistory sheet
  let invSheet = ss.getSheetByName('InvestmentHistory');
  if (!invSheet) {
    invSheet = ss.insertSheet('InvestmentHistory');
  }
  const invHeaders = ['id', 'accountId', 'date', 'type', 'symbol', 'quantity', 'price', 'totalValue', 'fees', 'notes'];
  invSheet.getRange(1, 1, 1, invHeaders.length).setValues([invHeaders]);
  invSheet.getRange(1, 1, 1, invHeaders.length).setFontWeight('bold');
  
  // Create ESPPLoans sheet
  let esppLoansSheet = ss.getSheetByName('ESPPLoans');
  if (!esppLoansSheet) {
    esppLoansSheet = ss.insertSheet('ESPPLoans');
  }
  const esppLoansHeaders = ['id', 'pullDate', 'pullAmount', 'interestRate', 'interestAmount', 'quarter', 'purchaseDate', 'sharesPurchased', 'purchasePrice', 'salePrice', 'fees', 'profit', 'status', 'notes'];
  esppLoansSheet.getRange(1, 1, 1, esppLoansHeaders.length).setValues([esppLoansHeaders]);
  esppLoansSheet.getRange(1, 1, 1, esppLoansHeaders.length).setFontWeight('bold');
  
  // Create ESPPOfferings sheet
  let esppOfferingsSheet = ss.getSheetByName('ESPPOfferings');
  if (!esppOfferingsSheet) {
    esppOfferingsSheet = ss.insertSheet('ESPPOfferings');
  }
  const esppOfferingsHeaders = ['id', 'companyName', 'tickerSymbol', 'discountPercent', 'lookbackPeriod', 'offeringStartDate', 'offeringEndDate', 'purchaseDate', 'maxContributionPercent', 'totalContributed', 'estimatedShares', 'estimatedProfit'];
  esppOfferingsSheet.getRange(1, 1, 1, esppOfferingsHeaders.length).setValues([esppOfferingsHeaders]);
  esppOfferingsSheet.getRange(1, 1, 1, esppOfferingsHeaders.length).setFontWeight('bold');
  
  // Create Config sheet
  let configSheet = ss.getSheetByName('Config');
  if (!configSheet) {
    configSheet = ss.insertSheet('Config');
  }
  const configHeaders = ['key', 'value'];
  configSheet.getRange(1, 1, 1, configHeaders.length).setValues([configHeaders]);
  configSheet.getRange(1, 1, 1, configHeaders.length).setFontWeight('bold');
  
  return { success: true, message: 'Sheets initialized successfully' };
}
