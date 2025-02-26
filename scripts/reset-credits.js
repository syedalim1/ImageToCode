// This script resets all users with less than 100 credits to have exactly 100 credits
// Run this script with: node scripts/reset-credits.js

const fetch = require('node-fetch');

async function resetCredits() {
  try {
    console.log('Resetting credits for users with less than 100 credits...');
    
    const response = await fetch('http://localhost:3000/api/user/reset-credits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${errorText}`);
    }
    
    const result = await response.json();
    
    console.log('Result:', result);
    console.log(`Updated ${result.updatedCount} users to have 100 credits.`);
    
    if (result.updatedUsers && result.updatedUsers.length > 0) {
      console.log('Updated users:');
      result.updatedUsers.forEach(email => console.log(`- ${email}`));
    }
    
    console.log('Done!');
  } catch (error) {
    console.error('Error resetting credits:', error);
  }
}

resetCredits();
