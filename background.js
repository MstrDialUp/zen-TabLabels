// Background script for Tab Labels extension

// Default colors for labels
const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
];

// Store for session labels (label text -> color mapping)
let sessionLabels = new Map();

// Initialize context menu
browser.runtime.onInstalled.addListener(() => {
  createContextMenus();
});

// Create context menu items
function createContextMenus() {
  browser.contextMenus.removeAll().then(() => {
    // Main "Add Label" menu
    browser.contextMenus.create({
      id: 'tab-label-main',
      title: 'Add Label to Tab',
      contexts: ['page', 'tab']
    });

    // Create new label option
    browser.contextMenus.create({
      id: 'tab-label-new',
      parentId: 'tab-label-main',
      title: 'Create New Label...',
      contexts: ['page', 'tab']
    });

    // Separator
    if (sessionLabels.size > 0) {
      browser.contextMenus.create({
        id: 'tab-label-separator',
        parentId: 'tab-label-main',
        type: 'separator',
        contexts: ['page', 'tab']
      });

      // Add existing labels
      for (let [labelText, color] of sessionLabels) {
        browser.contextMenus.create({
          id: `tab-label-quick-${labelText}`,
          parentId: 'tab-label-main',
          title: `\u25CF ${labelText}`,
          contexts: ['page', 'tab']
        });
      }
    }

    // Remove label option
    browser.contextMenus.create({
      id: 'tab-label-remove',
      title: 'Remove Label from Tab',
      contexts: ['page', 'tab']
    });
  });
}

// Handle context menu clicks
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'tab-label-new') {
    // Prompt for new label
    browser.tabs.sendMessage(tab.id, {
      action: 'showLabelDialog',
      tabId: tab.id
    });
  } else if (info.menuItemId === 'tab-label-remove') {
    // Remove label from tab
    removeTabLabel(tab.id);
  } else if (info.menuItemId.startsWith('tab-label-quick-')) {
    // Quick label selection
    const labelText = info.menuItemId.replace('tab-label-quick-', '');
    const color = sessionLabels.get(labelText);
    if (color) {
      await saveTabLabel(tab.id, labelText, color);
      browser.tabs.sendMessage(tab.id, {
        action: 'updateLabel',
        label: labelText,
        color: color
      });
    }
  }
});

// Save tab label to storage
async function saveTabLabel(tabId, labelText, color) {
  // Add to session labels
  if (!sessionLabels.has(labelText)) {
    sessionLabels.set(labelText, color);
    createContextMenus(); // Refresh menu with new label
  }

  // Get current labels
  const result = await browser.storage.local.get('tabLabels');
  const tabLabels = result.tabLabels || {};

  // Save label for this tab
  tabLabels[tabId] = { text: labelText, color: color };

  await browser.storage.local.set({ tabLabels: tabLabels });
}

// Remove tab label from storage
async function removeTabLabel(tabId) {
  const result = await browser.storage.local.get('tabLabels');
  const tabLabels = result.tabLabels || {};

  delete tabLabels[tabId];

  await browser.storage.local.set({ tabLabels: tabLabels });

  browser.tabs.sendMessage(tabId, {
    action: 'removeLabel'
  });
}

// Listen for messages from content scripts
browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.action === 'createLabel') {
    const { tabId, labelText, color } = message;
    await saveTabLabel(tabId, labelText, color);
    return { success: true };
  } else if (message.action === 'getTabLabel') {
    const result = await browser.storage.local.get('tabLabels');
    const tabLabels = result.tabLabels || {};
    return { label: tabLabels[message.tabId] };
  } else if (message.action === 'getRandomColor') {
    const color = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
    return { color: color };
  }
});

// Clean up labels when tabs are closed
browser.tabs.onRemoved.addListener(async (tabId) => {
  const result = await browser.storage.local.get('tabLabels');
  const tabLabels = result.tabLabels || {};

  delete tabLabels[tabId];

  await browser.storage.local.set({ tabLabels: tabLabels });
});

// Restore labels when extension starts
browser.tabs.query({}).then(tabs => {
  tabs.forEach(tab => {
    browser.tabs.sendMessage(tab.id, {
      action: 'restoreLabel'
    }).catch(() => {
      // Tab might not have content script loaded yet
    });
  });
});
