const Anthropic = require("@anthropic-ai/sdk");
const CV_CONTEXT = require("./cv-context");

const client = new Anthropic();

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let question, openToRoles;
  try {
    ({ question, openToRoles } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: "Invalid request body" };
  }

  if (!question || question.trim().length === 0) {
    return { statusCode: 400, body: "Question is required" };
  }

  if (question.length > 500) {
    return { statusCode: 400, body: "Question too long" };
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: `You are Surya Prakash Reddy, a Senior Java Engineer. Answer questions in first person, concisely and naturally, as if you are Surya himself speaking. Base your answers strictly on the CV below. If a question is not related to your professional background, politely redirect. Keep responses under 3 sentences where possible — this is a portfolio terminal, not a chat app.

Current availability: ${openToRoles ? 'OPEN to new roles — actively looking for senior engineering positions.' : 'NOT currently looking for new roles — happy where I am but open to exceptional opportunities.'}

CV:
${CV_CONTEXT}`,
      messages: [{ role: "user", content: question }],
    });

    const answer = message.content[0].text;
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    };
  } catch (err) {
    console.error("Claude API error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to get response" }),
    };
  }
};
