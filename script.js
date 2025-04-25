
const translations = {
  en: {
    title: "Rug or Moon Presale",
    subtitle: "Buy now, regret maybe. Don’t buy, regret definitely.",
    connect_wallet: "Connect Wallet",
    buy_now: "YOLO BUY NOW",
    sold: "PD Sold:",
    meme_line: "This token is useless. But you still want it.",
    tokenomics: "Tokenomics",
    faq: "FAQ",
    q1: "Q: What is this token?",
    a1: "A: Just Pedog. Buy or don’t.",
    q2: "Q: Will I get rugged?",
    a2: "A: Maybe. That’s part of the fun.",
    q3: "Q: When exchange listing?",
    a3: "A: When we feel like it.",
    disclaimer: "We don’t care. You should."
  },
  zh: {
    title: "Rug 或 Moon 預售",
    subtitle: "買了可能後悔，不買一定更後悔。",
    connect_wallet: "連接錢包",
    buy_now: "YOLO 現在購買",
    sold: "已售 PD:",
    meme_line: "這幣沒用，但你還是想要。",
    tokenomics: "代幣經濟",
    faq: "常見問題",
    q1: "Q: 這是什麼幣？",
    a1: "A: 就是 Pedog，買不買隨你。",
    q2: "Q: 會被 rug 嗎？",
    a2: "A: 有可能，這是樂趣的一部分。",
    q3: "Q: 什麼時候上市？",
    a3: "A: 看我們心情。",
    disclaimer: "我們不在乎，你最好在乎。"
  }
};

document.getElementById('language-select').addEventListener('change', function() {
  const lang = this.value;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerText = translations[lang][key];
  });
});

// Placeholder for wallet connection
document.getElementById('connect-wallet').addEventListener('click', () => {
  alert('Wallet connected (mock).');
});

// Placeholder for buy function
document.getElementById('buy-btn').addEventListener('click', () => {
  const solAmount = document.getElementById('sol-amount').value;
  if (solAmount > 0) {
    alert(`You are buying ${solAmount * 6942000} PD for ${solAmount} SOL! (mock)`);
  } else {
    alert('Enter a valid SOL amount.');
  }
});


let provider = null;

// Detect Phantom wallet
window.onload = async () => {
  if ('solana' in window) {
    provider = window.solana;
    if (provider.isPhantom) {
      console.log('Phantom wallet found!');
    }
  } else {
    alert('Phantom wallet not found. Please install it.');
  }
};

// Connect wallet
document.getElementById('connect-wallet').addEventListener('click', async () => {
  if (provider) {
    try {
      const resp = await provider.connect();
      console.log('Connected to wallet: ', resp.publicKey.toString());
      document.getElementById('connect-wallet').innerText = 'Wallet Connected';
    } catch (err) {
      console.error('Wallet connection failed:', err);
    }
  }
});

// Buy PD (send SOL to presale wallet)
document.getElementById('buy-btn').addEventListener('click', async () => {
  const solAmount = parseFloat(document.getElementById('sol-amount').value);
  if (!provider || !provider.publicKey) {
    alert('Please connect your wallet first.');
    return;
  }
  if (solAmount > 0) {
    const recipient = 'H6s2xxWam8vhnKxm43JouMUquYvijkvZr4xhbR9A9zwS';
    const lamports = solAmount * 1e9;  // 1 SOL = 1e9 lamports

    try {
      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: new solanaWeb3.PublicKey(recipient),
          lamports: lamports,
        })
      );

      
    
    if (connection.getLatestBlockhash) {
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
    } else {
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
    }
    
    transaction.feePayer = provider.publicKey;
    const signedTransaction = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
      alert(`Transaction sent! Signature: ${signature}`);
    } catch (err) {
      console.error('Transaction failed:', err);
      alert('Transaction failed: ' + err.message);
    }
  } else {
    alert('Enter a valid SOL amount.');
  }
});


// Add USDT functionality and real-time SOL price fetching
const usdtMintAddress = 'Es9vMFrzaCERgwnqSgxZfzzUjijL2mE3hDW7Fq8Q9Kyq'; // SPL USDT address
let solPrice = 0;

// Fetch SOL/USDT price from Coingecko API (or similar)
async function fetchSOLPrice() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await response.json();
    solPrice = data.solana.usd;
    console.log('SOL price fetched:', solPrice);
  } catch (err) {
    console.error('Failed to fetch SOL price:', err);
  }
}

// Initialize price fetching
fetchSOLPrice();
setInterval(fetchSOLPrice, 60000); // Update price every 60 seconds

// Payment method toggle
let paymentMethod = 'SOL'; // Default
document.getElementById('payment-method').addEventListener('change', function() {
  paymentMethod = this.value;
  if (paymentMethod === 'USDT') {
    document.getElementById('sol-amount').placeholder = 'Enter USDT amount';
  } else {
    document.getElementById('sol-amount').placeholder = 'Enter SOL amount';
  }
});

// Update buy button logic
document.getElementById('buy-btn').addEventListener('click', async () => {
  const amount = parseFloat(document.getElementById('sol-amount').value);
  if (!provider || !provider.publicKey) {
    alert('Please connect your wallet first.');
    return;
  }
  if (amount <= 0) {
    alert('Enter a valid amount.');
    return;
  }

  const recipient = 'H6s2xxWam8vhnKxm43JouMUquYvijkvZr4xhbR9A9zwS';
  try {
    
    let transaction;
    const connection = provider.connection;
    
    if (paymentMethod === 'SOL') {
      const lamports = amount * 1e9;
      transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: new solanaWeb3.PublicKey(recipient),
          lamports: lamports,
        })
      );
    } else if (paymentMethod === 'USDT') {
      const usdtAmount = amount * 1e6; // USDT has 6 decimals
      const usdtToken = new solanaWeb3.PublicKey(usdtMintAddress);
      const fromTokenAccount = await provider.connection.getTokenAccountsByOwner(
        provider.publicKey,
        { mint: usdtToken }
      );
      const recipientTokenAccount = await provider.connection.getTokenAccountsByOwner(
        new solanaWeb3.PublicKey(recipient),
        { mint: usdtToken }
      );

      transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.Token.createTransferInstruction(
          solanaWeb3.TOKEN_PROGRAM_ID,
          fromTokenAccount.value[0].pubkey,
          recipientTokenAccount.value[0].pubkey,
          provider.publicKey,
          [],
          usdtAmount
        )
      );
    }

    
    
    if (connection.getLatestBlockhash) {
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
    } else {
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
    }
    
    transaction.feePayer = provider.publicKey;
    const signedTransaction = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    alert(`Transaction sent! Signature: ${signature}`);
  } catch (err) {
    console.error('Transaction failed:', err);
    alert('Transaction failed: ' + err.message);
  }
});


// Presale total supply
const totalPresalePD = 42069000000; // 42,069,000,000 PD
let soldPD = 0; // Start with 0 sold

// Update display for sold amount
function updateSoldDisplay() {
  document.getElementById('sold-amount').innerText = soldPD.toLocaleString();
}

// Enhance buy button logic to show PD purchased and update sold amount
document.getElementById('buy-btn').addEventListener('click', async () => {
  const amount = parseFloat(document.getElementById('sol-amount').value);
  if (!provider || !provider.publicKey) {
    alert('Please connect your wallet first.');
    return;
  }
  if (amount <= 0) {
    alert('Enter a valid amount.');
    return;
  }

  const recipient = 'H6s2xxWam8vhnKxm43JouMUquYvijkvZr4xhbR9A9zwS';
  let pdAmount = 0;

  try {
    
    let transaction;
    const connection = provider.connection;
    
    if (paymentMethod === 'SOL') {
      const lamports = amount * 1e9;
      pdAmount = amount * 6942000; // PD per SOL
      transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: new solanaWeb3.PublicKey(recipient),
          lamports: lamports,
        })
      );
    } else if (paymentMethod === 'USDT') {
      const usdtAmount = amount * 1e6; // USDT has 6 decimals
      pdAmount = (amount / solPrice) * 6942000; // PD per USDT based on SOL price
      const usdtToken = new solanaWeb3.PublicKey(usdtMintAddress);
      const fromTokenAccount = await provider.connection.getTokenAccountsByOwner(
        provider.publicKey,
        { mint: usdtToken }
      );
      const recipientTokenAccount = await provider.connection.getTokenAccountsByOwner(
        new solanaWeb3.PublicKey(recipient),
        { mint: usdtToken }
      );

      transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.Token.createTransferInstruction(
          solanaWeb3.TOKEN_PROGRAM_ID,
          fromTokenAccount.value[0].pubkey,
          recipientTokenAccount.value[0].pubkey,
          provider.publicKey,
          [],
          usdtAmount
        )
      );
    }

    
    
    if (connection.getLatestBlockhash) {
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
    } else {
      const { blockhash } = await connection.getRecentBlockhash();
      transaction.recentBlockhash = blockhash;
    }
    
    transaction.feePayer = provider.publicKey;
    const signedTransaction = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    alert(`Transaction sent! Signature: ${signature}\nYou bought ${pdAmount.toLocaleString()} PD!`);

    soldPD += pdAmount;
    updateSoldDisplay();
  } catch (err) {
    console.error('Transaction failed:', err);
    alert('Transaction failed: ' + err.message);
  }
});

// Initialize sold amount display
updateSoldDisplay();
