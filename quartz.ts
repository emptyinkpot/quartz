import { QuartzConfig, FullPageLayout } from "./quartz/cfg"
import Head from "./quartz/components/Head"
import * as Plugin from "./quartz/plugins"
import { MyBlogContentPageType } from "./quartz/myblog/contentPage"
import { MyBlogFrontmatter } from "./quartz/myblog/frontmatter"
import { getMyBlogHomeResources, MyBlogHomePageType } from "./quartz/myblog/homeEmitter"

const myBlogTheme = {
  fontOrigin: "googleFonts" as const,
  cdnCaching: true,
  typography: {
    header: "Schibsted Grotesk",
    body: "Source Sans Pro",
    code: "IBM Plex Mono",
  },
  colors: {
    lightMode: {
      light: "#f7f3ea",
      lightgray: "#e7ded2",
      gray: "#b8aca0",
      darkgray: "#625a52",
      dark: "#25211d",
      secondary: "#6d3b59",
      tertiary: "#315d50",
      highlight: "rgba(185, 140, 39, 0.16)",
      textHighlight: "#f2d26b66",
    },
    darkMode: {
      light: "#191716",
      lightgray: "#2f2a27",
      gray: "#6e665f",
      darkgray: "#ded7cf",
      dark: "#f7f3ea",
      secondary: "#d8a9c3",
      tertiary: "#8fc7b8",
      highlight: "rgba(216, 169, 195, 0.16)",
      textHighlight: "#b98c2766",
    },
  },
}

const EmptyFooter = () => () => null
const sharedLayout: Partial<FullPageLayout> = {
  head: Head(),
  header: [],
  beforeBody: [],
  afterBody: [],
  left: [],
  right: [],
  footer: EmptyFooter(),
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
    theme: myBlogTheme,
  },
  plugins: {
    transformers: [MyBlogFrontmatter()],
    filters: [],
    emitters: [
      Plugin.ComponentResources(),
      Plugin.Assets(),
      Plugin.Static(),
      {
        name: "MyBlogRuntimeResources",
        async emit() {
          return []
        },
        externalResources: getMyBlogHomeResources,
      },
      Plugin.PageTypes.PageTypeDispatcher({
        defaults: sharedLayout,
        byPageType: {
          "myblog-home": {
            ...sharedLayout,
            left: [],
            right: [],
            beforeBody: [],
            afterBody: [],
          },
          content: {
            ...sharedLayout,
            left: [],
            right: [],
            beforeBody: [],
            afterBody: [],
          },
        },
      }),
    ],
    pageTypes: [MyBlogHomePageType(), MyBlogContentPageType(), Plugin.PageTypes.NotFoundPageType()],
  },
}

export default config
export const layout = {
  defaults: {},
  byPageType: {},
}
