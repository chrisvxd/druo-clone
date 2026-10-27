"use client";

import type { Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core";
import { withDynamicConfig } from "@puckeditor/plugin-ai";
import { getConfig } from "../../lib/configs";

export function Client({ path, data }: { path: string; data: Data }) {
  const configWithDesignedComponents = withDynamicConfig(getConfig(path), data);

  return <Render config={configWithDesignedComponents} data={data} />;
}
