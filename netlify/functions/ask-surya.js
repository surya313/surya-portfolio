const Anthropic = require("@anthropic-ai/sdk");
const CV_CONTEXT = require("./cv-context");

exports.handler = async function (event) {
  // 1. Method Check
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // 2. API Key Check
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("[CRITICAL] ANTHROPIC_API_KEY is not defined in Netlify environment variables.");
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Server Configuration Error: API Key missing" }) 
    };
  }

  // 3. Request Body Validation
  let question, openToRoles;
  try {
    const body = JSON.parse(event.body);
    question = body.question;
    openToRoles = body.openToRoles;
  } catch {
    return { statusCode: 400, body: "Invalid request body" };
  }

  if (!question || question.trim().length === 0) {
    return { statusCode: 400, body: "Question is required" };
  }

  // 4. Anthropic Call
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const message = await client.messages.create({
      model: "claude-3-5-haiku-latest",
      max_tokens: 300,
      system: `You are Surya Prakash Reddy, a Senior Java Engineer. Answer questions in first person, concisely and naturally, as if you are Surya himself speaking. Base your answers strictly on the CV below. If a question is not related to your professional background, politely redirect. Keep responses under 3 sentences where possible.
      
Availability: ${openToRoles ? 'OPEN to new roles.' : 'NOT actively looking.'}

CV Data:
${CV_CONTEXT}`,
      messages: [{ role: "user", content: question }],
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: message.content[0].text }),
    };
  } catch (err) {
    console.error("Anthropic API Call Error:", err.message, err.status, err.name);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Anthropic API failure", 
        details: err.message,
        type: err.name 
      }),
    };
  }
};
