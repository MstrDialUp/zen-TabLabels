/**
 * Tab Labels Manager
 * Handles displaying and managing labels on tabs
 */

class TabLabelsManager {
  constructor() {
    this.storage = window.TabLabelStorage;
    this.labelCache = new Map(); // Cache of tab -> label data
    this.initialized = false;
  }

  /**
   * Initialize the tab labels manager
   */
  async init() {
    if (this.initialized) return;

    await this.storage.init();

    // Load all existing labels from storage
    const allLabels = await this.storage.getAllLabels();
    allLabels.forEach(labelData => {
      this.labelCache.set(labelData.tabId, labelData);
    });

    // Set up tab event listeners
    this.setupEventListeners();

    // Apply labels to all existing tabs
    this.applyLabelsToAllTabs();

    this.initialized = true;
  }

  /**
   * Set up event listeners for tab events
   */
  setupEventListeners() {
    const tabContainer = gBrowser.tabContainer;

    // Listen for new tabs being opened
    tabContainer.addEventListener('TabOpen', (event) => {
      this.onTabOpen(event.target);
    });

    // Listen for tabs being closed
    tabContainer.addEventListener('TabClose', (event) => {
      this.onTabClose(event.target);
    });

    // Listen for tab attribute changes (like URL changes)
    tabContainer.addEventListener('TabAttrModified', (event) => {
      this.onTabModified(event.target);
    });
  }

  /**
   * Handle tab open event
   */
  onTabOpen(tab) {
    // Check if this tab's URL matches an existing label
    setTimeout(() => {
      this.applyLabelToTab(tab);
    }, 500); // Slight delay to ensure tab is fully initialized
  }

  /**
   * Handle tab close event
   */
  onTabClose(tab) {
    // We keep labels in storage even when tabs close
    // This allows labels to persist across browser sessions
  }

  /**
   * Handle tab modification event
   */
  onTabModified(tab) {
    // Re-apply label in case the tab changed
    this.applyLabelToTab(tab);
  }

  /**
   * Apply labels to all existing tabs
   */
  applyLabelsToAllTabs() {
    const tabs = gBrowser.tabs;
    for (const tab of tabs) {
      this.applyLabelToTab(tab);
    }
  }

  /**
   * Apply a label to a specific tab
   */
  async applyLabelToTab(tab) {
    if (!tab || !tab.linkedBrowser) return;

    const tabId = this.storage.generateTabId(tab);
    const labelData = await this.storage.getLabel(tabId);

    // Remove any existing label first
    this.removeLabelFromTab(tab);

    if (labelData && labelData.label) {
      this.renderLabel(tab, labelData);
      this.labelCache.set(tabId, labelData);
    }
  }

  /**
   * Render a label on a tab
   */
  renderLabel(tab, labelData) {
    // Find the tab label container (where the title is displayed)
    const tabLabel = tab.querySelector('.tab-text');
    if (!tabLabel) return;

    // Create the label container
    const labelContainer = document.createElement('div');
    labelContainer.className = 'zen-tab-label-container';
    labelContainer.setAttribute('data-label-id', 'zen-label');

    // Create the color indicator circle
    const colorCircle = document.createElement('span');
    colorCircle.className = 'zen-tab-label-color';
    colorCircle.style.backgroundColor = labelData.color;

    // Create the label text
    const labelText = document.createElement('span');
    labelText.className = 'zen-tab-label-text';
    labelText.textContent = labelData.label;

    // Assemble the label
    labelContainer.appendChild(colorCircle);
    labelContainer.appendChild(labelText);

    // Insert the label after the tab title
    tabLabel.parentNode.insertBefore(labelContainer, tabLabel.nextSibling);
  }

  /**
   * Remove a label from a tab
   */
  removeLabelFromTab(tab) {
    const existingLabel = tab.querySelector('.zen-tab-label-container');
    if (existingLabel) {
      existingLabel.remove();
    }
  }

  /**
   * Add or update a label for a tab
   */
  async addLabel(tab, label, color) {
    if (!tab) return;

    const tabId = this.storage.generateTabId(tab);
    const url = tab.linkedBrowser?.currentURI?.spec || '';

    const labelData = {
      label,
      color,
      url
    };

    // Save to storage
    await this.storage.saveLabel(tabId, labelData);

    // Apply to the tab
    await this.applyLabelToTab(tab);
  }

  /**
   * Remove a label from a tab
   */
  async removeLabel(tab) {
    if (!tab) return;

    const tabId = this.storage.generateTabId(tab);

    // Remove from storage
    await this.storage.deleteLabel(tabId);

    // Remove from cache
    this.labelCache.delete(tabId);

    // Remove from UI
    this.removeLabelFromTab(tab);
  }

  /**
   * Get the label data for a tab
   */
  async getLabel(tab) {
    if (!tab) return null;

    const tabId = this.storage.generateTabId(tab);
    return await this.storage.getLabel(tabId);
  }

  /**
   * Check if a tab has a label
   */
  async hasLabel(tab) {
    const label = await this.getLabel(tab);
    return label && label.label;
  }
}

// Export as a singleton
window.TabLabelsManager = new TabLabelsManager();
