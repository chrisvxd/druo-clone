"use client";

import type { Data } from "@puckeditor/core";
import { Puck, blocksPlugin, outlinePlugin } from "@puckeditor/core";
import { createAiPlugin, withDynamicConfig } from "@puckeditor/plugin-ai";

import { getConfig, isPlatformPath } from "../../../lib/configs";

const aiPlugin = createAiPlugin({
  // Allow users to switch between design and assembly mode.
  // Read more: https://puckeditor.com/docs/ai/design-mode
  designMode: {
    visible: true,
  },
  // Select design mode by default.
  defaultMode: "design",
});

// The platform editor tags its AI requests so the server can swap in dashboard
// context (see app/api/puck/[...all]/route.ts). Dashboards are mostly assembled
// from existing blocks, so it starts in assembly mode.
const platformAiPlugin = createAiPlugin({
  designMode: {
    visible: true,
  },
  defaultMode: "assembly",
  prepareRequest: (opts) => ({ ...opts, body: { ...opts.body, surface: "platform" } }),
});

// Place the ai plugin in the last position in the side nav.
const plugins = [blocksPlugin(), outlinePlugin(), aiPlugin];
const platformPlugins = [blocksPlugin(), outlinePlugin(), platformAiPlugin];

export function Client({ path, data }: { path: string; data: Data }) {
  const configWithDesignedComponents = withDynamicConfig(getConfig(path), data);

  return (
    <Puck
      plugins={isPlatformPath(path) ? platformPlugins : plugins}
      data={data}
      config={configWithDesignedComponents}
      onPublish={async (data) => {
        await fetch("/api/pages", {
          method: "post",
          body: JSON.stringify({ data, path }),
        });
      }}
    />
  );
}
