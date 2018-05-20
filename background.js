/* Add listeners for tabs */

const tabs = chrome.tabs 
tabs.onCreated.addListener( function( tab ) {
	updateTab( tab )
})
tabs.onUpdated.addListener( function( tabId, changeInfo, tab ) {
	updateAllTabs()
})
tabs.onMoved.addListener( function( tabId, moveInfo ) {
	updateAllTabs()
})
tabs.onDetached.addListener( function( tabId, detachInfo ) {
	updateAllTabs()
})
tabs.onAttached.addListener( function( tabId, attachInfo ) {
	updateAllTabs()
})
tabs.onRemoved.addListener( function( tabId, removeInfo ) {
	updateAllTabs()
})


/**
 * Add numeric prefix to tab title (i.e. '4. Facebook - Login')
 * according to tab's position relative to other tabs. If the 
 * prefix already exists, update it to make sure it's accurate.
 * @param {Tab} tab - a [Chrome API Tab object](https://developer.chrome.com/extensions/tabs#type-Tab)  
 */

function updateTab( tab ) {
	const { id, index, url, title } = tab

	if ( url.startsWith( 'chrome://' ) ) {
		// not allowed to modify browser settings pages
		return 
	}

  /* logic for redoing title with numeric prefix */
	const prefix = /^[0-9]+. /g
	const hasPrefix = prefix.exec( title )
	let newTitle = `${index + 1}. `
	if ( hasPrefix && hasPrefix[0] && hasPrefix[0] === newTitle ) {
		return // title is already correctly prefixed
	} else if ( hasPrefix ) {
		// title has incorrect prefix (tab moved)
		newTitle += title.split( prefix )[1]
	} else {
		// title has no prefix (new tab)
		newTitle += title
	}

	try {
		const script = { code : `document.title = '${newTitle}'` }
		chrome.tabs.executeScript( id, script )
	} catch ( e ) {
		console.error( e )
	}
}

/**
 * Get all the Tabs (from all windows)
 * @param {function} cb - callback function with input `Tab[]` 
 */

function getAllTabs( cb ) {
	chrome.tabs.query( {}, cb )
}

/**
 * Update all the tabs.
 */

function updateAllTabs( ) {
	const cb = tabs => tabs.forEach( updateTab )
	getAllTabs( cb )
}

updateAllTabs() // update all tabs on initialization
