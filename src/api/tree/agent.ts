/**
 * FamilySearch Agent API
 *
 * Handles agent (contributor/organization) information.
 *
 * @see https://developers.familysearch.org/main/reference/readagent
 */

import type { FamilySearchSDK } from "../../client";
import type { AgentResponse } from "../../types";

/**
 * Read agent information
 *
 * Returns information about an agent (contributor or organization)
 * who has contributed to the FamilySearch system.
 *
 * @param sdk - SDK instance
 * @param agentId - Agent ID
 * @returns Agent information or null
 *
 * @example
 * ```typescript
 * const agent = await readAgent(sdk, 'AGENT-ID');
 * console.log('Agent name:', agent?.agents?.[0]?.names?.[0]?.value);
 * ```
 */
export async function readAgent(
	sdk: FamilySearchSDK,
	agentId: string
): Promise<AgentResponse | null> {
	try {
		const response = await sdk.get<AgentResponse>(
			`/platform/agents/${agentId}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get agent ${agentId}:`,
			error
		);
		return null;
	}
}
