// KisanSetu Server - Deployment Fix (Explicit Routing)
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 

// Import your database connection
// const connectDB = require('./config/db'); // Decommissioned SQLite

// Import Routes
// const authRoutes = require('./routes/authRoutes'); // Auth handled by Supabase direct-to-client
const produceRoutes = require('./routes/produceRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'Frontend')));

// Mount Routes
// app.use('/api/auth', authRoutes); // Decommissioned
app.use('/api/produce', produceRoutes);
app.use('/api/equipment', equipmentRoutes); 

// Expose safe public config to frontend (To prevent committing API keys to GitHub)
app.get('/api/config/keys', (req, res) => {
    res.json({ 
        supabaseUrl:      process.env.SUPABASE_URL,
        supabaseAnonKey:  process.env.SUPABASE_ANON_KEY,
        razorpayKeyId:    process.env.RAZORPAY_KEY_ID,
        geminiApiKey:     process.env.GEMINI_API_KEY
    });
}); 

// Start the Server locally (Conditional for Vercel)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, async () => {
        console.log(`🚀 KisanSetu Backend running on http://localhost:${PORT}`);
        console.log(`🔗 Connected to Supabase Cloud for Data & Auth.`);
    });
}

// Export for Vercel Serverless
module.exports = app;
