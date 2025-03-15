const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const axios = require("axios");
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // .env file se API key use karni chahiye
const GEMINI_MODEL = "gemini-1.5-pro"; // Model select karo (ya "gemini-1.5-flash" for faster response)

router.get("/:Id", async (req, res) => {
    try {
        const userId = req.params.Id;
        // console.log("Received userId:", userId);

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Financial data fetch karo
        const expenses = await Expense.find({ userId, date: { $gte: thirtyDaysAgo } });
        const incomes = await Income.find({ userId, date: { $gte: thirtyDaysAgo } });

        if (expenses.length === 0 && incomes.length === 0) {
            return res.json({ insight: "No financial data found for analysis." });
        }

        let expenseData = expenses.map(exp => `${exp.category}: $${exp.amount}`).join(", ");
        let incomeData = incomes.map(inc => `${inc.source}: $${inc.amount}`).join(", ");

        let prompt = `Analyze the financial data and provide suggestions to improve savings:
        - Expenses: ${expenseData || "No expense recorded"}
        - Income: ${incomeData || "No income recorded"}`;

        // ✅ Google Gemini API request with correct model name
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }] // Correct request format
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        // ✅ AI ka response handle karo
        const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No insights available.";

        res.json({ insight: aiResponse });

    } catch (error) {
        console.error("Error fetching AI insights:", error.response?.data || error.message);
        res.status(500).json({ error: "AI analysis failed.", details: error.response?.data });
    }
});

module.exports = router;
