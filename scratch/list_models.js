import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
    const API_KEY = process.env.GOOGLE_AI_API_KEY;
    if (!API_KEY) {
        console.error("API Key missing in .env.local");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // List models
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        
        console.log("--- Available Models ---");
        if (data.models) {
            data.models.forEach(m => {
                console.log(`Model: ${m.name} | Methods: ${m.supportedGenerationMethods.join(', ')}`);
            });
        } else {
            console.log("No models found or error in response:", data);
        }
    } catch (error) {
        console.error("Listing Error:", error);
    }
}

listModels();
