;(function () {
    const KEY = 'F2'
    const DIALOG_ID = 'rename-plugin-dialog'
    const isSingleTorrentSelected = () => theWebUI.tables.trt.obj.selCount === 1

    let dialogElement
    let torrentElement
    let torrentIdElement
    let torrentNameElement
    let addTorrentName

    plugin.loadLang()
    plugin.loadMainCSS()

    let names = {}
    const getName = (id, defaultValue) => names[id] || defaultValue
    ;(() => {
        let handler

        function fetchNames() {
            fetch(plugin.path + 'names.php').then(async r => {
                if (r.ok) {
                    clearTimeout(handler)
                    names = await r.json()
                } else {
                    log('Failed to fetch torrent names, retrying…')
                    setTimeout(fetchNames, 2500)
                }
            })
        }

        handler = setTimeout(fetchNames, 0)
    })()

    plugin.onLangLoaded = () => {
        const elementIdPrefix = 'rename-plugin-torrent-'
        const torrentIdElementId = elementIdPrefix + 'id'
        const torrentNameElementId = elementIdPrefix + 'name'

        theDialogManager.make(
            DIALOG_ID,
            theUILang.Rename,
            `
            <div class="cont fxcaret">
                <input id="${torrentIdElementId}" type="hidden">
                <input id="${torrentNameElementId}" type="text">
            </div>
            <div class="aright buttons-list">
                <input type="button" value="${theUILang.ok}" class="OK Button" onclick="theWebUI.renamePluginSubmit()">
                <input type="button" value="${theUILang.Cancel}" class="Cancel Button">
            </div>
            `,
            true
        )

        dialogElement = document.getElementById(DIALOG_ID)
        torrentIdElement = document.getElementById(torrentIdElementId)
        torrentNameElement = document.getElementById(torrentNameElementId)

        const addTorrentForm = document.getElementById('addtorrent')
        const addTorrentUrlForm = document.getElementById('addtorrenturl')

        addTorrentForm.insertAdjacentHTML(
            'afterbegin',
            `<label for="rename-plugin-add-torrent-name" title="${theUILang.addTorrentNameHelp}">${theUILang.Name}:</label><input id="rename-plugin-add-torrent-name" class="TextboxLarge" type="text"><br>`
        )

        const addTorrentNameElement = document.getElementById('rename-plugin-add-torrent-name')
        const addTorrentNameOnSubmit = () => {
            addTorrentName = addTorrentNameElement.value.trim()
            addTorrentNameElement.value = ''
        }
        addTorrentForm.onsubmit = addTorrentNameOnSubmit
        addTorrentUrlForm.onsubmit = addTorrentNameOnSubmit

        document.getElementById('dlgHelp').querySelector('div table tr:first-child').insertAdjacentHTML(
            'afterend',
            `<tr><td><strong>${KEY}</strong></td><td>${theUILang.RenameSelectedTorrent}</td></tr>`
        )
    }

    theWebUI.renamePluginDialog = (id) => {
        torrentElement = document.getElementById(id)
        torrentIdElement.value = id
        torrentNameElement.value = torrentElement.title
        theDialogManager.show(DIALOG_ID)
        torrentNameElement.focus()
    }

    theWebUI.rename = function (id, name) {
        return fetch(
            plugin.path + 'rename.php',
            {
                method: 'POST',
                body: new Blob([JSON.stringify({id: id, name: name})], {type: 'application/json'})
            }
        )
    }

    theWebUI.renamePluginSubmit = () => {
        const id = torrentIdElement.value.trim()
        const name = torrentNameElement.value.trim()
        if (name !== torrentElement.title.trim()) {
            const inputs = dialogElement.getElementsByTagName('input')
            for (let input of inputs) {
                input.disabled = true
            }

            theWebUI.rename(id, name).then(r => {
                if (r.ok) {
                    names[id] = name
                    torrentElement.title = name
                    torrentElement.querySelector('td:first-child div').textContent = name
                    theDialogManager.hide(DIALOG_ID)
                } else {
                    theWebUI.error(r.status, r.statusText)
                }

                for (let input of inputs) {
                    input.disabled = false
                }
            })
        }

        return false
    }

    if (plugin.canChangeMenu()) {
        const createMenu = theWebUI.createMenu
        theWebUI.createMenu = function (e, id) {
            createMenu.call(this, e, id)

            const action = isSingleTorrentSelected() ? `theWebUI.renamePluginDialog("${theWebUI.dID}")` : null
            theContextMenu.add(theContextMenu.get(theUILang.Details), [theUILang.Rename, action])
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === KEY && isSingleTorrentSelected()) {
            theWebUI.renamePluginDialog(theWebUI.dID)
        }
    })

    const addRow = dxSTable.prototype.addRow
    dxSTable.prototype.addRow = async function (cols, sId, icon, attr) {
        if (addTorrentName == null) {
            cols[0] = getName(sId, cols[0])
        } else {
            cols[0] = addTorrentName
            names[sId] = addTorrentName
            theWebUI.rename(sId, addTorrentName).then(r => {
                if (!r.ok) {
                    theWebUI.error(r.status, r.statusText)
                }
            })
            addTorrentName = null
        }

        addRow.call(this, cols, sId, icon, attr)
    }

    const setValue = dxSTable.prototype.setValue
    dxSTable.prototype.setValue = function (row, col, val) {
        return setValue.call(this, row, col, col === 0 ? getName(row, val) : val)
    }
})()
