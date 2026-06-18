import { QuartzConfig } from "./quartz/cfg"
import { MyBlogFrontmatter } from "./quartz/myblog/frontmatter"

const quartzTheme = {
  fontOrigin: "googleFonts" as const,
  cdnCaching: true,
  typography: {
    header: "Schibsted Grotesk",
    body: "Source Sans Pro",
    code: "IBM Plex Mono",
  },
  colors: {
    lightMode: {
      light: "#faf8f8",
      lightgray: "#e5e5e5",
      gray: "#b8b8b8",
      darkgray: "#4e4e4e",
      dark: "#2b2b2b",
      secondary: "#284b63",
      tertiary: "#84a59d",
      highlight: "rgba(143, 159, 169, 0.15)",
      textHighlight: "#fff23688",
    },
    darkMode: {
      light: "#161618",
      lightgray: "#393639",
      gray: "#646464",
      darkgray: "#d4d4d4",
      dark: "#ebebec",
      secondary: "#7b97aa",
      tertiary: "#84a59d",
      highlight: "rgba(143, 159, 169, 0.15)",
      textHighlight: "#b3aa0288",
    },
  },
}

const config: QuartzConfig = {
  configuration: {
    pageTitle: "emptyinkpot",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "blog.tengokukk.com/myblog-quartz-preview",
    ignorePatterns: ["private", "templates", ".obsidian"],
    theme: quartzTheme,
  },
  plugins: {
    transformers: [MyBlogFrontmatter()],
    filters: [],
    emitters: [],
    pageTypes: [],
  },
}

export default config
export const layout = {
  defaults: {},
  byPageType: {},
}
