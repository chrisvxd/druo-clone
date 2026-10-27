import marketingConfig from "../puck.config";
import platformConfig from "../platform.config";

// Pages under /platform are the merchant dashboard example; everything else is
// the marketing site.
export const isPlatformPath = (path: string) => path === "/platform" || path.startsWith("/platform/");

export const getConfig = (path: string) => (isPlatformPath(path) ? platformConfig : marketingConfig);
