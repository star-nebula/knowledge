// config — skill 工作台扫描配置
// layer: user=用户级主区 | shared=单真身共享链接(入口) | plugin=插件缓存 | runtime=工具运行时
// writable: 该层默认可否安全编辑（工作台统一放行，仅作提示分组用）
module.exports = {
  roots: [
    // ---- 用户级主区（运营层默认展开） ----
    { tool: 'zcode',     path: 'C:/Users/stars/.zcode/skills',     layer: 'user' },
    { tool: 'codebuddy', path: 'C:/Users/stars/.codebuddy/skills', layer: 'user' },
    { tool: 'workbuddy', path: 'C:/Users/stars/.workbuddy/skills', layer: 'user' },
    { tool: 'claude',    path: 'C:/Users/stars/.claude/skills',    layer: 'user' },
    { tool: 'lingma',    path: 'C:/Users/stars/.lingma/skills',    layer: 'user' },
    { tool: 'trae-cn',   path: 'C:/Users/stars/.trae-cn/skills',   layer: 'user' },
    { tool: 'openclaw',  path: 'C:/Users/stars/.openclaw/skills',  layer: 'user' },
    { tool: 'openclaw-autoclaw', path: 'C:/Users/stars/.openclaw-autoclaw/skills', layer: 'user' },
    { tool: 'qwenwork',  path: 'C:/Users/stars/.qwenworkcn/skills', layer: 'user' },
    { tool: 'hub',       path: 'C:/Users/stars/.hub/skills',        layer: 'user' },
    { tool: 'understand-anything', path: 'C:/Users/stars/.understand-anything-plugin/skills', layer: 'user' },
    { tool: 'cline',     path: 'C:/Users/stars/.cline/skills',      layer: 'user' },
    // ---- 单真身共享体系（入口目录；链接按 shared 建模） ----
    { tool: 'lark-master', path: 'C:/Users/stars/.agents/skills',   layer: 'user', master: true },
    // ---- 运行时（只读系统区） ----
    { tool: 'lobsterai', path: 'C:/Users/stars/AppData/Roaming/LobsterAI/SKILLs', layer: 'runtime' },
    { tool: 'workbuddy-connectors', path: 'C:/Users/stars/.workbuddy/connectors/skills', layer: 'runtime' },
  ],
  // ZCode 插件缓存（单独一层，标记“插件更新即失效”）
  pluginGlobs: [
    { tool: 'zcode-plugins', path: 'C:/Users/stars/.zcode/cli/plugins/cache', maxDepth: 4 },
  ],
  // 忽略的目录名
  ignore: ['.system', '.git', 'node_modules', '__pycache__'],
  // 别名映射（同步组归一化名）：
  // ZCode 的 agent-* 前缀 ↔ 其他工具无前缀；frontend-ui-engineering 同源异名
  aliases: [
    { canonical: 'api-and-interface-design',       variants: ['agent-api-and-interface-design'] },
    { canonical: 'browser-testing-with-devtools',  variants: ['agent-browser-testing-with-devtools'] },
    { canonical: 'ci-cd-and-automation',           variants: ['agent-ci-cd-and-automation'] },
    { canonical: 'code-review-and-quality',        variants: ['agent-code-review-and-quality'] },
    { canonical: 'code-simplification',            variants: ['agent-code-simplification'] },
    { canonical: 'context-engineering',            variants: ['agent-context-engineering'] },
    { canonical: 'debugging-and-error-recovery',   variants: ['agent-debugging-and-error-recovery'] },
    { canonical: 'deprecation-and-migration',      variants: ['agent-deprecation-and-migration'] },
    { canonical: 'documentation-and-adrs',         variants: ['agent-documentation-and-adrs'] },
    { canonical: 'doubt-driven-development',       variants: ['agent-doubt-driven-development'] },
    { canonical: 'frontend-ui-engineering',        variants: ['agent-frontend-ui-engineering'] },
    { canonical: 'git-workflow-and-versioning',    variants: ['agent-git-workflow-and-versioning'] },
    { canonical: 'idea-refine',                    variants: ['agent-idea-refine'] },
    { canonical: 'incremental-implementation',     variants: ['agent-incremental-implementation'] },
    { canonical: 'interview-me',                   variants: ['agent-interview-me'] },
    { canonical: 'observability-and-instrumentation', variants: ['agent-observability-and-instrumentation'] },
    { canonical: 'performance-optimization',       variants: ['agent-performance-optimization'] },
    { canonical: 'planning-and-task-breakdown',    variants: ['agent-planning-and-task-breakdown'] },
    { canonical: 'security-and-hardening',         variants: ['agent-security-and-hardening'] },
    { canonical: 'shipping-and-launch',            variants: ['agent-shipping-and-launch'] },
    { canonical: 'source-driven-development',      variants: ['agent-source-driven-development'] },
    { canonical: 'spec-driven-development',        variants: ['agent-spec-driven-development'] },
    { canonical: 'test-driven-development',        variants: ['agent-test-driven-development'] },
    { canonical: 'using-agent-skills',             variants: ['agent-using-agent-skills'] },
  ],
};
