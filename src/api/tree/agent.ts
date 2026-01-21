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
 * @param uid - User ID of the agent
 * @returns Agent information or null
 *
 * @example
 * ```typescript
 * const agent = await readAgent(sdk, 'USER-ID');
 * console.log('Agent name:', agent?.agents?.[0]?.names?.[0]?.value);
 * ```
 */
export async function readAgent(
	sdk: FamilySearchSDK,
	uid: string
): Promise<AgentResponse | null> {
	try {
		const response = await sdk.get<AgentResponse>(
			`/platform/users/agents/${uid}`
		);
		return response.data || null;
	} catch (error) {
		sdk.logger.error(
			`[FamilySearch SDK] Failed to get agent ${uid}:`,
			error
		);
		return null;
	}
}
