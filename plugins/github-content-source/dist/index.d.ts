import type { QuartzTransformerPlugin } from "@quartz-community/types";
type GitHubContentSourceOptions = {
    owner: string;
    repo: string;
    ref?: string;
    sourcePath: string;
    targetDir: string;
    include?: string[];
    exclude?: string[];
    tokenEnv?: string;
    concurrency?: number;
};
type SyncSummary = {
    files: number;
    targetDir: string;
    owner: string;
    repo: string;
    ref: string;
    sourcePath: string;
};
type PluginOptions = {
    configPath?: string;
};
export declare function syncGitHubContentSource(options: GitHubContentSourceOptions): Promise<SyncSummary>;
declare const GitHubContentSource: QuartzTransformerPlugin<PluginOptions>;
export default GitHubContentSource;
export { GitHubContentSource };
export type { GitHubContentSourceOptions, SyncSummary };
