chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("Tabs extension is running...");
  });
});

/**
01. Tabs Chrome Extension
Add a number in front of tab titles. Then you can easily use quick hot keys to switch to tab. e.g. Ctrl+7 / CMD+7
Created by AK Solutions - AK Sol Ltd. United Kingdom.
Under GPL license

Inspiration by Tab Number extension
https://chrome.google.com/webstore/detail/tab-number/dnndfognablbihihgnilabcegjjkiekj

**/

/* Listen for when a tab has changed position */
chrome.tabs.onMoved.addListener(function(id) {
  nTabsUpdate(true,null);
});

/* Listen for when a tab has been removed */
chrome.tabs.onRemoved.addListener(function(id) {
  nTabsUpdate(true,null);
});

/* Listen for when a tab has an updated title */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  nTabsUpdate(false,tab);
});

var nTabsUpdate = function(all_tabs, details) {

	// process all tabs one by one
	if (all_tabs) {
	
	  chrome.tabs.query({}, function(tabs) {
	  	var one_tab;
		for (var i = 0; one_tab = tabs[i]; i++) {
		  nTabsUpdate(false, one_tab);
		}
	  });
	} else {

		// tab details
		var tab_id = details.id;
		var tab_title = details.title;
		var tab_url = details.url;

		if ( tab_title.substr( 0, 4 ) === 'http' ) return

		// console.log("||| details = " + details.title + "");
		
		// console.log("1. tab_title = " + tab_title + "");
		
		// other variables
		var index = details.index;
		var pad  = '';

		// if we found a . at third character of title
		// it would not work on 100th tab, but who has 100 tabs? not the normal ones. Those chosen ones can roll their own extension
		if (tab_title && tab_title.indexOf('. ') == 2) {
			tab_title = tab_title.substr(4);
		}

		// console.log("2. tab_title = " + tab_title + "");

		// add leading zero where needed
		if (index<9) { 
			pad = '0'; 
		}

		// add the index
		tab_title = pad + (index + 1) + '. ' + tab_title;
		
		// console.log("3. tab_title = " + tab_title + "");

		// apply the new title if this is not extension gallery
		if (tab_url.substr(0,35)=='https://chrome.google.com/webstore/' || tab_url.substr(0,6)=='chrome') {
			// this is ridiculous, a ! does not work above, so here is a point less block of if to make use of else instead 
		} else {
			try {
				chrome.tabs.executeScript(tab_id,
				{
					code : "document.title = '" + tab_title + "';"
				  }
				);
				//console.log("document.title = '" + tab_title + "';");
			} catch(e) {}
		}
	}
};


/* in the beginning please update all tabs */
nTabsUpdate(true,null);

