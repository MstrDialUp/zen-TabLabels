/**
 * Storage module for Tab Labels
 * Uses IndexedDB for persistent storage of tab labels
 */

class TabLabelStorage {
  constructor() {
    this.dbName = 'ZenTabLabels';
    this.dbVersion = 1;
    this.storeName = 'labels';
    this.db = null;
  }

  /**
   * Initialize the IndexedDB database
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'tabId' });
          objectStore.createIndex('url', 'url', { unique: false });
        }
      };
    });
  }

  /**
   * Generate a stable ID for a tab based on URL and user context
   * This ensures labels persist across browser restarts
   */
  generateTabId(tab) {
    const url = tab.linkedBrowser?.currentURI?.spec || '';
    const title = tab.label || '';
    const contextId = tab.userContextId || 0;

    // Create a simple hash from the URL + title + context
    const str = `${url}|${title}|${contextId}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `tab_${Math.abs(hash)}`;
  }

  /**
   * Save a label for a tab
   */
  async saveLabel(tabId, labelData) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);

      const data = {
        tabId,
        label: labelData.label,
        color: labelData.color,
        url: labelData.url,
        timestamp: Date.now()
      };

      const request = objectStore.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(data);
    });
  }

  /**
   * Get a label for a tab
   */
  async getLabel(tabId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.get(tabId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Delete a label for a tab
   */
  async deleteLabel(tabId) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(tabId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Get all labels
   */
  async getAllLabels() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  /**
   * Clear all labels
   */
  async clearAll() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

// Export as a singleton
window.TabLabelStorage = new TabLabelStorage();
