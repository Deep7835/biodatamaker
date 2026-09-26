import { ANALYTICS } from "@/lib/analytics";
import { ConsentAnalytics } from "./ConsentAnalytics";

/**
 * Cloudflare Web Analytics is cookieless, so it loads directly.
 * GA4 and Clarity set cookies, so they load only after the visitor accepts (ConsentAnalytics).
 */
export function Analytics() {
  const { cloudflareToken, gaId, clarityId } = ANALYTICS;
  return (
    <>
      {cloudflareToken && (
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token: cloudflareToken })} />
      )}
      <ConsentAnalytics gaId={gaId} clarityId={clarityId} />
    </>
  );
}
