import { GoogleGenAI } from "../_libs/@google/genai.mjs";
import { evaluateEligibility, normalizeAmountInr, normalizeIncomeMode, normalizeOwnership, normalizePropertyType, normalizeTenureYears } from "./router-3gdiWDev.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transcript-extractor-BkMupKqp.js
var genAiInstance = null;
function getGenAI() {
	if (!process.env.GEMINI_API_KEY) return null;
	if (!genAiInstance) genAiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
	return genAiInstance;
}
/**
* Fallback regex/rule-based extractor from raw transcript text
*/
function extractWithRules(transcriptText) {
	const text = transcriptText.toLowerCase();
	const customerLines = transcriptText.split("\n").filter((line) => /^(customer|user|applicant):/i.test(line)).map((line) => line.replace(/^(customer|user|applicant):/i, "").trim().toLowerCase());
	const customerText = customerLines.length > 0 ? customerLines.join(" ") : text;
	let propertyType = null;
	if (customerText.includes("agri") || customerText.includes("farm") || customerText.includes("kheti")) propertyType = "agricultural";
	else if (customerText.includes("commercial") || customerText.includes("shop") || customerText.includes("office") || customerText.includes("dukaan")) propertyType = "commercial";
	else if (customerText.includes("industrial") || customerText.includes("factory") || customerText.includes("godown") || customerText.includes("warehouse")) propertyType = "industrial";
	else if (customerText.includes("residential") || customerText.includes("flat") || customerText.includes("house") || customerText.includes("apartment") || customerText.includes("villa") || customerText.includes("ghar") || customerText.includes("makaan")) propertyType = "residential";
	else if (text.includes("residential property") || text.includes("residential house")) propertyType = "residential";
	let ownership = null;
	if (customerText.includes("joint") || customerText.includes("shared") || customerText.includes("wife") || customerText.includes("husband") || customerText.includes("family")) ownership = "joint";
	else if (customerText.includes("sole") || customerText.includes("single") || customerText.includes("myself") || customerText.includes("own") || customerText.includes("alone") || customerText.includes("individual")) ownership = "sole";
	let originalDocuments = null;
	if (/original\s*(property\s*)?(title\s*)?(deed|document|paper)s?\s*(\w+\s*){0,4}(yes|have|available|ready|with me)/i.test(text) || /have\s*(the\s*)?original/i.test(customerText) || /yes[,\.\s]+i have (it|them)/i.test(customerText) || /original documents being ready/i.test(text)) originalDocuments = true;
	else if (/no\s*(original|deed|document)/i.test(customerText) || /don't have original/i.test(customerText)) originalDocuments = false;
	let loanAmountInr = null;
	const amountPattern = /([a-z0-9\-.]+\s*(?:lakh|lakhs|lac|lacs|crore|cr|k)\b)/i;
	const custAmtMatch = customerText.match(amountPattern);
	if (custAmtMatch && custAmtMatch[1]) loanAmountInr = normalizeAmountInr(custAmtMatch[1]);
	if (!loanAmountInr) {
		const textAmtMatch = text.match(amountPattern);
		if (textAmtMatch && textAmtMatch[1]) loanAmountInr = normalizeAmountInr(textAmtMatch[1]);
	}
	let occupation = null;
	if (customerText.includes("self employed") || customerText.includes("businessman") || customerText.includes("business")) occupation = "self_employed";
	else if (customerText.includes("salaried") || customerText.includes("job") || customerText.includes("employee")) occupation = "salaried";
	let incomeMode = null;
	if (customerText.includes("cash") || customerText.includes("rokad") || customerText.includes("nakad")) incomeMode = "cash";
	else if (customerText.includes("bank") || customerText.includes("account") || customerText.includes("transfer") || customerText.includes("cheque") || customerText.includes("neft") || customerText.includes("online")) incomeMode = "bank";
	else if (text.includes("income in cash") || text.includes("salary in cash")) incomeMode = "cash";
	let marketValueInr = null;
	const mvMatches = text.match(/(?:market value|worth|current value|property value)\s*(?:is|of|around|about)?\s*([₹rs.\s\d]+(?:lakh|lakhs|lac|lacs|crore|cr)?)/i);
	if (mvMatches && mvMatches[1]) marketValueInr = normalizeAmountInr(mvMatches[1]);
	if (!marketValueInr && (text.includes("crore") || text.includes("cr"))) {
		const crMatch = text.match(/(\d+(\.\d+)?)\s*(?:crore|cr)/i);
		if (crMatch) marketValueInr = Math.round(parseFloat(crMatch[1]) * 1e7);
		else if (text.includes("one and a half crore") || text.includes("one and of course")) marketValueInr = 15e6;
	}
	let tenureYears = null;
	const tenureMatch = text.match(/(?:repay|tenure|timeline|period|duration|repayment)\s*(?:is|of|for|around)?\s*(\d+)\s*(?:year|years|saal|yrs)/i);
	if (tenureMatch && tenureMatch[1]) tenureYears = parseInt(tenureMatch[1], 10);
	if (!tenureYears) {
		const yrMatch = text.match(/(\d+)\s*(?:year|years|saal|yrs)/i);
		if (yrMatch && yrMatch[1]) {
			const val = parseInt(yrMatch[1], 10);
			if (val >= 1 && val <= 30) tenureYears = val;
		}
	}
	const evalInput = {
		propertyType: normalizePropertyType(propertyType),
		ownership: normalizeOwnership(ownership),
		originalDocuments,
		loanAmountInr,
		occupation,
		incomeMode: normalizeIncomeMode(incomeMode),
		marketValueInr,
		tenureYears: normalizeTenureYears(tenureYears)
	};
	const evalResult = evaluateEligibility(evalInput);
	return {
		propertyType: evalInput.propertyType ? String(evalInput.propertyType) : null,
		ownership: evalInput.ownership ? String(evalInput.ownership) : null,
		originalDocuments,
		loanAmountInr,
		occupation,
		incomeMode: evalInput.incomeMode ? String(evalInput.incomeMode) : null,
		marketValueInr,
		tenureYears,
		eligibilityStatus: evalResult.status === "in_progress" ? "incomplete" : evalResult.status,
		disqualificationReason: evalResult.failedReason,
		disqualificationStep: evalResult.failedStep
	};
}
/**
* Extracts LAP verification details from call transcript using Gemini 2.5 Flash,
* with deterministic fallback to regex normalizers.
*/
async function extractCallDetailsFromTranscript(transcript) {
	if (!transcript) return {
		propertyType: null,
		ownership: null,
		originalDocuments: null,
		loanAmountInr: null,
		occupation: null,
		incomeMode: null,
		marketValueInr: null,
		tenureYears: null,
		eligibilityStatus: "incomplete",
		disqualificationReason: null,
		disqualificationStep: null
	};
	let formattedTranscript = "";
	if (Array.isArray(transcript)) formattedTranscript = transcript.filter((t) => t && t.content).map((t) => `${t.role === "agent" ? "Agent (Vikram)" : "Customer"}: ${t.content}`).join("\n");
	else formattedTranscript = String(transcript);
	if (!formattedTranscript.trim()) return extractWithRules("");
	const ai = getGenAI();
	if (ai) try {
		const prompt = `
You are an expert loan verification extractor for a Loan Against Property (LAP) application at Sunrise Capital.
Analyze the following voice call transcript between the loan advisor and customer, and extract the LAP application details as pure JSON.

CRITICAL RULES:
1. propertyType: 'residential', 'commercial', 'industrial', 'agricultural', or null if not mentioned. (e.g., house/flat -> residential, shop -> commercial, factory -> industrial, farm/kheti -> agricultural).
2. ownership: 'sole' (customer owns alone/myself), 'joint' (with family/spouse), or null.
3. originalDocuments: true if original title deeds/papers are available, false if customer does not have originals, or null if unknown.
4. loanAmountInr: integer amount in INR (e.g. 6500000 for 65 lakhs). Look at requested loan.
5. occupation: 'salaried', 'self_employed', or null.
6. incomeMode: 'bank' (credited to bank account/transfer/cheque), 'cash' (cash in hand), or null.
7. marketValueInr: integer rough market valuation of property in INR (e.g. 15000000 for 1.5 crore, 20000000 for 2 crore), or null.
8. tenureYears: integer requested repayment years (e.g. 5), or null.
9. eligibilityStatus:
   - 'eligible': If property is residential/commercial/industrial, originalDocuments is true, loanAmountInr <= 7500000, and incomeMode is 'bank'.
   - 'not_eligible': If property is agricultural, or originalDocuments is false, or loanAmountInr > 7500000, or incomeMode is 'cash'.
   - 'incomplete': If conversation ended before collecting all mandatory items.
10. disqualificationReason: string explaining reason if not_eligible, else null.

TRANSCRIPT:
${formattedTranscript}

Return ONLY valid JSON matching this schema:
{
  "propertyType": string | null,
  "ownership": string | null,
  "originalDocuments": boolean | null,
  "loanAmountInr": number | null,
  "occupation": string | null,
  "incomeMode": string | null,
  "marketValueInr": number | null,
  "tenureYears": number | null,
  "eligibilityStatus": "eligible" | "not_eligible" | "incomplete",
  "disqualificationReason": string | null
}
`;
		const rawText = (await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: prompt,
			config: {
				responseMimeType: "application/json",
				temperature: .1
			}
		})).text?.trim();
		if (rawText) {
			const parsed = JSON.parse(rawText);
			return {
				propertyType: parsed.propertyType || null,
				ownership: parsed.ownership || null,
				originalDocuments: typeof parsed.originalDocuments === "boolean" ? parsed.originalDocuments : null,
				loanAmountInr: typeof parsed.loanAmountInr === "number" ? parsed.loanAmountInr : normalizeAmountInr(parsed.loanAmountInr),
				occupation: parsed.occupation || null,
				incomeMode: parsed.incomeMode || null,
				marketValueInr: typeof parsed.marketValueInr === "number" ? parsed.marketValueInr : normalizeAmountInr(parsed.marketValueInr),
				tenureYears: typeof parsed.tenureYears === "number" ? parsed.tenureYears : normalizeTenureYears(parsed.tenureYears),
				eligibilityStatus: parsed.eligibilityStatus || "incomplete",
				disqualificationReason: parsed.disqualificationReason || null,
				disqualificationStep: null
			};
		}
	} catch (err) {
		console.warn("[TranscriptExtractor] Gemini extraction failed, falling back to rule engine:", err);
	}
	return extractWithRules(formattedTranscript);
}
//#endregion
export { extractCallDetailsFromTranscript };
