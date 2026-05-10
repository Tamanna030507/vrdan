VRDAN — वरदान
AI-powered farm intelligence platform for Indian farmers
Live at → vrdan-72l8.vercel.app

VRDAN  is a full-stack AgriTech web app built for Indian farmers. It replaces expensive IoT hardware, fragmented government portals, and middlemen-driven marketplaces with a single platform that runs entirely on a smartphone — using the phone's own camera and sensors as its data source.
The platform combines real-time AI crop disease detection, live mandi price intelligence, government scheme eligibility checking, and a direct-to-farmer marketplace — all in a single dark-gold UI designed for both Hindi and English speakers.

Features
RogPehchan —  (Disease Detection)
Upload any crop photo and get an AI diagnosis in under 4 seconds. The system calls the Claude API to identify the disease, its severity, exact treatment product, dose, and timing. A canvas-based pixel analysis fallback ensures the app works even without internet. Every diagnosis is logged permanently to a blockchain-style activity record.
Dashboard
A live farm command center showing:

Precipitation forecast — 14-day and 24-hour rain data from Open-Meteo (free, no API key required), with irrigation recommendations based on forecast
Disease detection widget — quick-access to RogPehchan
Live sensor readings — soil moisture, humidity, sunlight, nitrogen, phosphorus, potassium — fed by phone sensors or entered manually
Mandi price alerts — AI-timed sell recommendations
Farm health timeline — all treatments, disease events, and irrigation logged chronologically
Marketplace preview — top products for the current season

Mandi Intel
Live price intelligence for wheat, mustard, chickpea, barley, and sunflower. Each crop shows:

Current price and 52-week high/low
AI sell recommendation with reasoning (SELL NOW / HOLD / WAIT N DAYS)
12-month historical + 4-month AI-predicted price chart
Price comparison across 4 mandis sorted by highest price
Profit calculator (adjustable farm size and yield)
WhatsApp price alert system

MandiMart
An in-app marketplace for seeds, pesticides, and fertilizers with:

Top 10 Crops — ranked by India's actual 2024-25 Ministry of Agriculture production data, displayed Netflix-style with rank numbers, profit ranges, and production volumes
Seeds catalog — certified varieties from ICAR, IARI, and major seed companies, each with desi name (what farmers actually call them), brand, dose, and description
Pesticides & Inputs — fungicides, insecticides, herbicides, bio inputs, and fertilizers with both English names and Hindi equivalents
Add to Cart + direct Buy Now — slide-out cart drawer with address entry and UPI QR code payment flow (GPay, PhonePe, Paytm)
All orders saved to Supabase backend

Crop Intel
AI crop recommendation engine. Fill in soil type, water availability, target season, farm size, pH, temperature, and nitrogen level. The AI scores all five crops across five dimensions (soil compatibility, water match, mandi trend, pest risk, season alignment) and ranks them. Each result includes:

Animated score ring
AI reasoning paragraph
Pesticide guide (product name, dose, timing, price)
Fertilizer schedule
What-If simulator — change water or soil type and watch scores update live

Policies
All major government schemes explained with:

My Eligibility checker — fill your farm intel once (income, land, Aadhaar linkage, caste, age, existing schemes) and get an instant list of schemes you qualify for, schemes you're close to qualifying for, and what's blocking you
Full scheme detail for PM-KISAN, PMFBY, Kisan Credit Card, NABARD RIDF, Soil Health Card, Fertilizer Subsidy
MSP table for 2025-26 with market vs. support price comparison
Step-by-step apply process and toll-free helplines for every scheme

News & Trends

Live price ticker (wheat, mustard, rice, chickpea, urea, DAP, sunflower, barley)
National news — price alerts, export bans, monsoon forecasts, technology releases, policy updates
International news — Russia-Ukraine wheat impact, Indonesia palm oil, China drought chickpea demand, EU carbon border tax
Pesticide registry — approved, restricted, banned, and recommended products with guidance
District pest outbreak map for Rajasthan
Global crop demand pie chart (2026 data)

Farmer Profile
A verifiable digital identity for each farmer:

Farm story tab — complete crop journey from sowing to harvest
Blockchain activity log — tamper-proof hash for every farm action
Soil health card data
Mandi sell records (verified)
Downloadable farm certificate with QR code

Voice Assistant
Floating voice/text assistant that answers queries about mandi prices, crop diseases, government schemes, and weather in Hindi, Punjabi, Marathi, and English. Also navigates between app sections by voice command.
