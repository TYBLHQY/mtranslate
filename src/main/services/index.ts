import { setupYoudaoNewService } from "./youdaoNew";
import { setupYoudaoOldService } from "./youdaoOld";

export function registerTransServices(): void {
  setupYoudaoNewService();
  setupYoudaoOldService();
}
