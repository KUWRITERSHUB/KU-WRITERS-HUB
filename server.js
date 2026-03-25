<script>

// STORAGE
let user = JSON.parse(localStorage.getItem("user")) || null;

// NAVIGATION
function hideAll(){
  ["home","register","login","payment","dashboard"].forEach(id=>{
    document.getElementById(id).style.display="none";
  });
}

// REGISTER
function register(){
  user = {
    name: regName.value,
    email: regEmail.value,
    pass: regPass.value,
    balance: 0,
    profits: 0,
    referrals: 0
  };

  localStorage.setItem("user", JSON.stringify(user));
  alert("Registered!");
  showLogin();
}

// LOGIN
function login(){
  let saved = JSON.parse(localStorage.getItem("user"));

  if(logEmail.value === saved.email && logPass.value === saved.pass){
    user = saved;
    loadDashboard();
  } else {
    alert("Wrong login");
  }
}

// PAYMENT
function pay(){
  user.balance = 600; // after payment
  saveUser();
  alert("Payment Successful!");
  loadDashboard();
}

// LOAD DASHBOARD
function loadDashboard(){
  hideAll();
  dashboard.style.display="block";

  document.getElementById("welcome").innerText =
    "Welcome, " + user.name;

  updateWallet();
}

// UPDATE WALLET DISPLAY
function updateWallet(){
  dashboard.innerHTML = `
  <h2>Welcome, ${user.name}</h2>

  <div class="card"><b>Account Balance:</b> KES ${user.balance}</div>
  <div class="card"><b>Profits:</b> KES ${user.profits}</div>
  <div class="card"><b>Referral Earnings:</b> KES ${user.referrals}</div>

  <h3>Features</h3>

  <button class="card" onclick="earnJob()">📄 Academic Job (+150)</button>
  <button class="card" onclick="earnBlog()">✍️ Blog Writing (+100)</button>
  <button class="card" onclick="earnSurvey()">📊 Survey (+10)</button>

  <button class="card" onclick="addReferral()">🔗 Add Referral (+200)</button>

  <button class="card" onclick="withdraw()">💰 Withdraw Referral Earnings</button>

  <h3>Trading & Training</h3>

  <button class="card" onclick="window.open('https://binomo.com')">
    📈 Open Binary Trading
  </button>

  <button class="card" onclick="alert('Training sessions coming soon')">
    🎓 Online Training Sessions
  </button>

  <button class="card" onclick="buyBot()">
    🤖 Buy AI Trading Bot (KES 15,000)
  </button>

  <h3>Community</h3>

  <a href="https://wa.me/254799074299">
    <button class="card" style="background:black;color:white;">
      Join WhatsApp Group
    </button>
  </a>
  `;
}

// EARNINGS
function earnJob(){
  user.profits += 150;
  saveUser();
  updateWallet();
}

function earnBlog(){
  user.profits += 100;
  saveUser();
  updateWallet();
}

function earnSurvey(){
  user.profits += 10;
  saveUser();
  updateWallet();
}

// REFERRAL
function addReferral(){
  user.referrals += 200;
  user.balance += 200;
  saveUser();
  updateWallet();
}

// WITHDRAW
function withdraw(){
  if(user.referrals <= 0){
    alert("No referral earnings");
    return;
  }

  alert("Withdrawal successful: KES " + user.referrals);
  user.referrals = 0;
  saveUser();
  updateWallet();
}

// BUY BOT
function buyBot(){
  if(user.balance < 15000){
    alert("Insufficient balance");
  } else {
    user.balance -= 15000;
    alert("AI Bot Activated!");
    saveUser();
    updateWallet();
  }
}

// SAVE
function saveUser(){
  localStorage.setItem("user", JSON.stringify(user));
}

</script>
