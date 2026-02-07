export const proxyOptions = {
  system: "系统代理",
  direct: "直连",
  fixed_servers: "手动配置代理",
  pac_script: "PAC脚本",
  auto_detect: "自动检测代理",
} as const satisfies Record<NonNullable<Electron.ProxyConfig["mode"]>, string>;
