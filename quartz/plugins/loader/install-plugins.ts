#!/usr/bin/env node
import { installPlugins, parsePluginSource } from "./gitLoader.js"
import fs from "fs"
import path from "path"
import YAML from "yaml"
import type { PluginSource, QuartzPluginsJson } from "./types"

function loadPluginSources(): PluginSource[] {
  const yamlPath = path.join(process.cwd(), "quartz.config.yaml")
  if (!fs.existsSync(yamlPath)) {
    throw new Error(
      "Missing canonical Quartz config: quartz.config.yaml. MyBlogQuartz installs plugins from that single YAML entrypoint.",
    )
  }

  const config = YAML.parse(fs.readFileSync(yamlPath, "utf-8")) as QuartzPluginsJson
  return config.plugins.filter((entry) => entry.enabled).map((entry) => entry.source)
}

async function main() {
  const externalPlugins = loadPluginSources()

  if (externalPlugins.length === 0) {
    console.log("No external plugins to install.")
    return
  }

  console.log(`Installing ${externalPlugins.length} plugin(s) from Git...`)

  const specs = externalPlugins.map((source) => parsePluginSource(source))
  const installed = await installPlugins(specs, { verbose: true })

  if (installed.size === externalPlugins.length) {
    console.log("✓ All plugins installed successfully")
  } else {
    console.error(`✗ Only ${installed.size}/${externalPlugins.length} plugins installed`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Failed to install plugins:", err)
  process.exit(1)
})
