import Together from "together-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env["TOGETHER_API_KEY"];
const model = "meta-llama/Llama-3.2-3B-Instruct-Turbo"; 

export async function main() {
    const together = new Together({ apiKey });

    const response = await together.chat.completions.create({
        model,
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "What is the capital of France?" }
        ],
        temperature: 1.0,
        top_p: 1.0,
        max_tokens: 1000
    });

    console.log(response.choices[0].message.content);
}

main().catch((err) => {
    console.error("The sample encountered an error:", err);
});
