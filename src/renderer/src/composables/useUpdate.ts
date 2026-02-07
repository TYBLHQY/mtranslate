import type { ProgressInfo } from "electron-updater";
import { Ref, ref } from "vue";

export function useUpdate(): {
  updateState: Ref<number>;
  progressInfo: Ref<ProgressInfo | null>;
  check: () => void;
  download: () => void;
  upgrade: () => void;
} {
  const updateState = ref(0); // 检查更新 | 可用更新 | 已是最新 | 下载进度 | 点击安装
  const progressInfo = ref<ProgressInfo | null>(null);

  const handleAvailable = (available: boolean): void => {
    updateState.value = available ? 1 : 2;
  };

  const handleProgress = (progress: ProgressInfo): void => {
    progressInfo.value = progress;
    updateState.value = 3;
  };

  const handleDownloaded = (downloaded: boolean): void => {
    updateState.value = downloaded ? 4 : 0;
    progressInfo.value = null;
  };

  window.api.update.getAvailable(handleAvailable);
  window.api.update.getDownloadProgress(handleProgress);
  window.api.update.getUpdateDownloaded(handleDownloaded);

  const check = (): void => window.api.update.check();
  const download = (): void => window.api.update.download();
  const upgrade = (): void => window.api.update.upgrade();

  return {
    updateState,
    progressInfo,
    check,
    download,
    upgrade,
  };
}
