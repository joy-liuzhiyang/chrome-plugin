declare var chrome: {
  app: {
    InstallState: any;
    RunningState: any;
    getDetails: () => void;
    getIsInstalled: () => void;
    installStat: () => void;
    isInstalled: boolean;
    runningState: () => void;
  };
  browserAction: {
    disable: () => void;
    enable: () => void;
    getBadgeBackgroundColor: () => void;
    getBadgeText: () => void;
    getPopup: () => void;
    getTitle: () => void;
    onClicked: object;
    setBadgeBackgroundColor: () => void;
    setBadgeText: () => void;
    setIcon: () => void;
    setPopup: () => void;
    setTitle: () => void;
  };
  commands: {
    getAll: () => void;
    onCommand: any;
  };
  cookies: {
    OnChangedCause: object;
    SameSiteStatus: object;
    get: () => void;
    getAll: (obj: { url?: string }, fun: (cookie: string) => void) => void;
    getAllCookieStores: () => void;
    onChanged: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
  };
  csi: () => void;
  dom: {
    openOrClosedShadowRoot: () => void;
  };
  extension: {
    ViewType: {
      POPUP: string;
      TAB: string;
    };
    connect: () => void;
    connectNative: any;
    getBackgroundPage: () => void;
    getExtensionTabs: () => void;
    getURL: () => void;
    getViews: () => void;
    inIncognitoContext: boolean;
    isAllowedFileSchemeAccess: () => void;
    isAllowedIncognitoAccess: () => void;
    onConnect: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onMessage: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onMessageExternal: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onRequest: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onRequestExternal: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    sendMessage: () => void;
    sendNativeMessage: any;
    sendRequest: () => void;
    setUpdateUrlData: () => void;
  };
  i18n: {
    detectLanguage: () => void;
    getAcceptLanguages: () => void;
    getMessage: () => void;
    getUILanguage: () => void;
  };
  loadTimes: () => void;
  management: {
    ExtensionDisabledReason: any;
    ExtensionInstallType: any;
    ExtensionType: any;
    LaunchType: any;
    getPermissionWarningsByManifest: () => void;
    getSelf: () => void;
    uninstallSelf: () => void;
  };
  permissions: {
    contains: () => void;
    getAll: () => void;
    onAdded: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onRemoved: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    remove: () => void;
    request: () => void;
  };
  runtime: {
    OnInstalledReason: any;
    OnRestartRequiredReason: any;
    PlatformArch: any;
    PlatformNaclArch: any;
    PlatformOs: any;
    RequestUpdateCheckStatus: any;
    connect: () => void;
    getBackgroundPage: () => void;
    getManifest: () => void;
    getPackageDirectoryEntry: () => void;
    getPlatformInfo: (value: any) => void;
    getURL: () => void;
    id: string;
    onBrowserUpdateAvailable: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onConnect: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onConnectExternal: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onInstalled: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onMessage: {
      addListener: (
        callBack: (request: any, sender: any, sendResponse: any) => void
      ) => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onMessageExternal: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    onRestartRequired: {
      addListener: () => void;
      dispatch: () => void;
      hasListener: () => void;
      hasListeners: () => void;
      removeListener: () => void;
    };
    openOptionsPage: () => void;
    reload: () => void;
    requestUpdateCheck: () => void;
    restart: () => void;
    restartAfterDelay: () => void;
    sendMessage: (info: any, callBack: (e) => void) => void;
    setUninstallURL: () => void;
  };
  storage: {
    local: any;
    managed: any;
    onChanged: any;
  };
  tabs: {
    get: (tableId: string, callBack: (tab: any) => void) => void;
    sendMessage: (
      tableId: string,
      info: any,
      callBack: (tab: any) => void
    ) => void;
    query: (queryInfo: any, callBack?: (tab: any) => void) => void;
    reload: (
      tabId: string,
      reloadProperties?: boolean,
      callback?: () => void
    ) => void;
  };
  webRequest: any;
  alarms: any;
};
