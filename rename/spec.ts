// https://github.com/Novik/ruTorrent/js/plugins.js
declare const plugin: RuTorrentPlugin
declare interface RuTorrentPlugin {
    readonly name: string
    readonly path: string
    readonly version: number
    readonly descr: string
    readonly author: string
    readonly allStuffLoaded: boolean
    readonly enabled: boolean
    readonly launched: boolean
    readonly restictions: any
    readonly help: any

    onLangLoaded?: Function

    markLoaded(): void
    enable(): void
    disable(): void
    launch(): void
    unlaunch(): void
    remove(): void
    showError(): void
    langLoaded(): void
    loadLangPrim(lang: string, template: string, sendNotify: boolean): void
    loadLang(sendNotify?: boolean): void
    loadCSS(name: string): void
    loadMainCSS(): void
    canChangeMenu(): boolean
    canChangeOptions(): boolean
    canChangeToolbar(): boolean
    canChangeTabs(): boolean
    canChangeColumns(): boolean
    canChangeStatusBar(): boolean
    canChangeCategory(): boolean
    canShutdown(): boolean
    canBeLaunched(): boolean
    attachPageToOptions(dlg: any, name: string): void
    removePageFromOptions(id: string): void
    attachPageToTabs(dlg: any, name: string, idBefore: string): void
    renameTab(id: string, name: string): void
    removePageFromTabs(id: string): void
    registerTopMenu(weight: number): void
    addButtonToToolbar(id: string, name: string, onclick: string, idBefore: string): void
    removeButtonFromToolbar(id: string): void
    addSeparatorToToolbar(idBefore: string): void
    removeSeparatorFromToolbar(idBefore: string): void
    addPaneToStatusbar(id: string, div: any, no: any): void
    removePaneFromStatusbar(id: string): void
    addPaneToCategory(id: string, name: string): void
    removePaneFromCategory(id: string): void
}
