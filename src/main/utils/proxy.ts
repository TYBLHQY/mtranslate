import { Proxy } from "@common/types";
import { getSetting } from "@main/store";
import { session } from "electron";

function setProxyConfig(config: Electron.ProxyConfig): void {
  session.defaultSession.setProxy(config);
}

const proxyRules = (proxy: Proxy): string => {
  let rules = "";
  if (proxy.username && proxy.password) rules += `${proxy.username}:${proxy.password}@`;
  rules += `${proxy.url}:${proxy.port}`;
  return rules;
};

export function registerProxy(p?: Proxy): void {
  const proxy = p || getSetting("proxy");
  if (!proxy) return;
  switch (proxy.mode) {
    case "direct":
      setProxyConfig({ mode: "direct" });
      break;
    case "auto_detect":
      setProxyConfig({ mode: "auto_detect" });
      break;
    case "pac_script":
      if (!proxy.pacScript) {
        setProxyConfig({ mode: "system" });
        return;
      }
      setProxyConfig({ mode: "pac_script", pacScript: proxy.pacScript });
      break;
    case "fixed_servers":
      setProxyConfig({
        mode: "fixed_servers",
        proxyRules: proxyRules(proxy),
        proxyBypassRules: proxy.proxyBypassRules,
      });
      break;
    case "system":
    default:
      setProxyConfig({ mode: "system" });
      break;
  }
}
