export async function askAI(question) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful AI interviewer." },
          { role: "user", content: question },
        ],
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "No response from AI.";
  }

// Resume Analysis AI Service
export async function analyzeResume(resumeText, studentInfo = {}) {
  const prompt = `
You are an expert career counselor and resume reviewer. Analyze the following resume text and provide detailed, actionable feedback.

Resume Content:
${resumeText}

Student Information: ${JSON.stringify(studentInfo)}

Please provide analysis in the following JSON format:
{
  "overallScore": <number 1-10>,
  "strengths": [<array of 3-5 key strengths>],
  "weaknesses": [<array of 3-5 areas for improvement>],
  "formattingScore": <number 1-10>,
  "contentScore": <number 1-10>,
  "keywordScore": <number 1-10>,
  "recommendations": [<array of 5-7 specific actionable recommendations>],
  "atsFriendly": <boolean>,
  "industryFit": "<string describing how well it fits target industry>",
  "priorityLevel": "<low|medium|high|urgent>"
}

Be specific, actionable, and professional. Focus on what would make this resume competitive for entry-level tech positions.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert career counselor. Always respond with valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse and validate JSON response
    const analysis = JSON.parse(content);
    return analysis;
  } catch (error) {
    console.error('Resume analysis error:', error);
    // Return fallback analysis
    return {
      overallScore: 5,
      strengths: ["Resume submitted for review"],
      weaknesses: ["Unable to analyze - please check format"],
      formattingScore: 5,
      contentScore: 5,
      keywordScore: 5,
      recommendations: ["Please ensure resume is in text format for better analysis"],
      atsFriendly: false,
      industryFit: "Unable to determine",
      priorityLevel: "medium"
    };
  }
}

// Interview Scoring AI Service
export async function scoreInterviewResponse(question, answer, studentInfo = {}) {
  const prompt = `
You are an expert technical interviewer evaluating a candidate's response. Score their answer on multiple criteria.

Interview Question: ${question}

Candidate's Answer: ${answer}

Student Information: ${JSON.stringify(studentInfo)}

Evaluate and respond in the following JSON format:
{
  "overallScore": <number 1-10>,
  "technicalAccuracy": <number 1-10>,
  "communicationClarity": <number 1-10>,
  "structure": <number 1-10>,
  "confidence": <number 1-10>,
  "strengths": [<array of 2-3 key strengths>],
  "improvements": [<array of 3-5 specific improvement areas>],
  "feedback": "<2-3 sentence summary feedback>",
  "priorityLevel": "<low|medium|high|urgent>",
  "followUpQuestions": [<array of 1-2 suggested follow-up questions>]
}

Be fair, specific, and constructive. Consider this is likely an entry-level candidate.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert technical interviewer. Always respond with valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    const analysis = JSON.parse(content);
    return analysis;
  } catch (error) {
    console.error('Interview scoring error:', error);
    return {
      overallScore: 5,
      technicalAccuracy: 5,
      communicationClarity: 5,
      structure: 5,
      confidence: 5,
      strengths: ["Attempted to answer"],
      improvements: ["Provide more detailed responses", "Practice technical communication"],
      feedback: "Good effort. Focus on providing more specific examples and technical details.",
      priorityLevel: "medium",
      followUpQuestions: ["Can you elaborate on your approach?"]
    };
  }
}

// Career Recommendation AI Service
export async function generateCareerRecommendation(studentInfo) {
  const prompt = `
You are a career counselor specializing in tech careers. Based on the student's information, provide personalized career guidance.

Student Information: ${JSON.stringify(studentInfo)}

Provide recommendations in the following JSON format:
{
  "recommendedCareers": [<array of 3-5 career paths with brief descriptions>],
  "skillGaps": [<array of 3-5 skills they should develop>],
  "nextSteps": [<array of 5-7 actionable steps>],
  "timeline": "<realistic timeline for career transition/preparation>",
  "marketDemand": "<high|medium|low>",
  "salaryRange": "<expected salary range for entry-level>",
  "resources": [<array of 3-5 recommended learning resources>]
}

Be realistic about their background and provide practical advice.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a career counselor. Always respond with valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    const recommendation = JSON.parse(content);
    return recommendation;
  } catch (error) {
    console.error('Career recommendation error:', error);
    return {
      recommendedCareers: ["Software Developer", "Data Analyst", "UI/UX Designer"],
      skillGaps: ["Technical skills", "Communication", "Problem-solving"],
      nextSteps: ["Complete relevant coursework", "Build portfolio", "Network with professionals"],
      timeline: "6-12 months",
      marketDemand: "high",
      salaryRange: "$50,000 - $80,000",
      resources: ["freeCodeCamp", "Coursera", "LinkedIn Learning"]
    };
  }
}