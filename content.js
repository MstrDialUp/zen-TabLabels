// Content script for Tab Labels extension

// Get the current tab ID
let currentTabId = null;

// Inject label dialog into page
function createLabelDialog() {
  // Remove existing dialog if any
  const existingDialog = document.getElementById('tab-label-dialog');
  if (existingDialog) {
    existingDialog.remove();
  }

  const dialog = document.createElement('div');
  dialog.id = 'tab-label-dialog';
  dialog.innerHTML = `
    <div class="tab-label-dialog-content">
      <div class="tab-label-dialog-header">
        <h3>Add Label to Tab</h3>
        <button class="tab-label-close">&times;</button>
      </div>
      <div class="tab-label-dialog-body">
        <label for="tab-label-input">Label Text:</label>
        <input type="text" id="tab-label-input" placeholder="Enter label text" />

        <label for="tab-label-color">Label Color:</label>
        <div class="tab-label-color-picker">
          <input type="color" id="tab-label-color" />
          <button id="tab-label-random-color">Random</button>
        </div>
      </div>
      <div class="tab-label-dialog-footer">
        <button class="tab-label-cancel">Cancel</button>
        <button class="tab-label-save">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  // Set random color by default
  browser.runtime.sendMessage({ action: 'getRandomColor' }).then(response => {
    document.getElementById('tab-label-color').value = response.color;
  });

  // Event listeners
  dialog.querySelector('.tab-label-close').addEventListener('click', () => {
    dialog.remove();
  });

  dialog.querySelector('.tab-label-cancel').addEventListener('click', () => {
    dialog.remove();
  });

  dialog.querySelector('#tab-label-random-color').addEventListener('click', () => {
    browser.runtime.sendMessage({ action: 'getRandomColor' }).then(response => {
      document.getElementById('tab-label-color').value = response.color;
    });
  });

  dialog.querySelector('.tab-label-save').addEventListener('click', async () => {
    const labelText = document.getElementById('tab-label-input').value.trim();
    const color = document.getElementById('tab-label-color').value;

    if (labelText) {
      // Send to background script to save
      await browser.runtime.sendMessage({
        action: 'createLabel',
        tabId: currentTabId,
        labelText: labelText,
        color: color
      });

      // Update the tab title
      updateTabTitle(labelText, color);
      dialog.remove();
    }
  });

  // Focus input
  setTimeout(() => {
    document.getElementById('tab-label-input').focus();
  }, 100);

  // Allow Enter key to save
  document.getElementById('tab-label-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      dialog.querySelector('.tab-label-save').click();
    }
  });
}

// Update tab title with label
function updateTabTitle(labelText, color) {
  // Create or update label element
  let labelElement = document.querySelector('.tab-label-display');

  if (!labelElement) {
    labelElement = document.createElement('div');
    labelElement.className = 'tab-label-display';

    // Try to insert near the title
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.parentNode) {
      titleElement.parentNode.insertBefore(labelElement, titleElement.nextSibling);
    } else {
      document.head.appendChild(labelElement);
    }
  }

  labelElement.innerHTML = `
    <span class="tab-label-indicator" style="background-color: ${color}"></span>
    <span class="tab-label-text">${labelText}</span>
  `;

  // Also update the document title to include the label
  const originalTitle = document.title.replace(/^\[.*?\]\s*/, ''); // Remove existing label
  document.title = `[${labelText}] ${originalTitle}`;
}

// Remove label from tab
function removeTabTitle() {
  const labelElement = document.querySelector('.tab-label-display');
  if (labelElement) {
    labelElement.remove();
  }

  // Restore original title
  document.title = document.title.replace(/^\[.*?\]\s*/, '');
}

// Listen for messages from background script
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'showLabelDialog') {
    currentTabId = message.tabId;
    createLabelDialog();
  } else if (message.action === 'updateLabel') {
    updateTabTitle(message.label, message.color);
  } else if (message.action === 'removeLabel') {
    removeTabTitle();
  } else if (message.action === 'restoreLabel') {
    // Restore label from storage
    restoreLabelFromStorage();
  }
});

// Function to restore label from storage
async function restoreLabelFromStorage() {
  try {
    // Ask background script for this tab's label
    // Background script will use sender.tab.id to identify us
    const response = await browser.runtime.sendMessage({
      action: 'getTabLabel'
    });

    if (response && response.label) {
      currentTabId = response.tabId;
      updateTabTitle(response.label.text, response.label.color);
    }
  } catch (error) {
    // No label stored or error occurred
    console.log('No label to restore');
  }
}

// Try to restore label on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', restoreLabelFromStorage);
} else {
  // Document already loaded
  restoreLabelFromStorage();
}
