
import { GoogleGenAI, Type } from "@google/genai";
import { Tool, ToolStatus } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const model = "gemini-2.5-flash";

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "The name of the tool (e.g., 'Power Drill', 'Circular Saw')."
        },
        inventoryCode: {
            type: Type.STRING,
            description: "A unique inventory code or serial number for the tool."
        },
        description: {
            type: Type.STRING,
            description: "Any additional details about the tool. Can be empty."
        },
        currentHolder: {
            type: Type.STRING,
            description: "The name of the person or team the tool is assigned to."
        },
        currentLocation: {
            type: Type.STRING,
            description: "The construction site, vehicle, or warehouse where the tool is located."
        },
    },
    required: ["name", "inventoryCode"]
};

export const parseToolFromNaturalLanguage = async (prompt: string): Promise<Omit<Tool, 'id' | 'status'>> => {
    try {
        const systemInstruction = `You are a tool management assistant for a construction company. Your role is to parse user input into a structured JSON tool object. Extract the tool's name, its unique inventory code, a description if provided, and who it's assigned to (currentHolder) and where it is (currentLocation).`;

        const response = await ai.models.generateContent({
            model: model,
            contents: `Parse the following user request into a tool object: "${prompt}"`,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedTool = JSON.parse(jsonText);

        return parsedTool as Omit<Tool, 'id' | 'status'>;

    } catch (error) {
        console.error("Error parsing tool with Gemini:", error);
        throw new Error("Failed to understand the tool details. Please try phrasing it differently.");
    }
};
