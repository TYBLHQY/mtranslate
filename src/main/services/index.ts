import { setupYoudaoNewService } from "./youdaoNew";
import { setupYoudaoOldService } from "./youdaoOld";

export function setupTransServices(): void {
  setupYoudaoNewService();
  setupYoudaoOldService();
}
