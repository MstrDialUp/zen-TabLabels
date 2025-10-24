/**
 * Context Menu Manager for Tab Labels
 * Handles the tab context menu and label input dialog
 */

class TabContextMenuManager {
  constructor() {
    this.tabLabelsManager = window.TabLabelsManager;
    this.currentTab = null;
    this.dialog = null;
    this.defaultColors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
      '#F8B739', '#52B788', '#E63946', '#457B9D'
    ];
  }

  /**
   * Initialize the context menu
   */
  init() {
    this.createDialog();
    this.setupContextMenu();
  }

  /**
   * Create the label input dialog
   */
  createDialog() {
    // Create dialog element
    const dialog = document.createElement('dialog');
    dialog.id = 'zen-tab-label-dialog';
    dialog.className = 'zen-tab-label-dialog';

    dialog.innerHTML = `
      <div class="zen-label-dialog-content">
        <h2>Add Tab Label</h2>

        <div class="zen-label-form">
          <div class="zen-label-input-group">
            <label for="zen-label-text">Label:</label>
            <input type="text" id="zen-label-text" placeholder="Enter label text" maxlength="50" />
          </div>

          <div class="zen-label-input-group">
            <label>Color:</label>
            <div class="zen-label-color-picker">
              ${this.defaultColors.map(color => `
                <button type="button" class="zen-color-option" data-color="${color}" style="background-color: ${color};" title="${color}"></button>
              `).join('')}
              <input type="color" id="zen-custom-color" class="zen-custom-color-input" value="#FF6B6B" title="Custom color" />
            </div>
          </div>

          <div class="zen-label-preview">
            <span class="zen-label-preview-circle" style="background-color: #FF6B6B;"></span>
            <span class="zen-label-preview-text">Preview</span>
          </div>

          <div class="zen-label-actions">
            <button type="button" id="zen-label-save" class="zen-button zen-button-primary">Save</button>
            <button type="button" id="zen-label-cancel" class="zen-button zen-button-secondary">Cancel</button>
            <button type="button" id="zen-label-remove" class="zen-button zen-button-danger">Remove Label</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);
    this.dialog = dialog;

    this.setupDialogEventListeners();
  }

  /**
   * Set up event listeners for the dialog
   */
  setupDialogEventListeners() {
    const labelInput = this.dialog.querySelector('#zen-label-text');
    const customColorInput = this.dialog.querySelector('#zen-custom-color');
    const colorButtons = this.dialog.querySelectorAll('.zen-color-option');
    const previewCircle = this.dialog.querySelector('.zen-label-preview-circle');
    const previewText = this.dialog.querySelector('.zen-label-preview-text');
    const saveButton = this.dialog.querySelector('#zen-label-save');
    const cancelButton = this.dialog.querySelector('#zen-label-cancel');
    const removeButton = this.dialog.querySelector('#zen-label-remove');

    let selectedColor = this.defaultColors[0];

    // Handle color selection
    colorButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        colorButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        selectedColor = button.dataset.color;
        previewCircle.style.backgroundColor = selectedColor;
        customColorInput.value = selectedColor;
      });
    });

    // Handle custom color input
    customColorInput.addEventListener('input', (e) => {
      selectedColor = e.target.value;
      previewCircle.style.backgroundColor = selectedColor;

      // Remove active class from all preset buttons
      colorButtons.forEach(btn => btn.classList.remove('active'));
    });

    // Handle label input for preview
    labelInput.addEventListener('input', (e) => {
      previewText.textContent = e.target.value || 'Preview';
    });

    // Handle save button
    saveButton.addEventListener('click', async () => {
      const labelText = labelInput.value.trim();

      if (!labelText) {
        alert('Please enter a label text');
        return;
      }

      if (this.currentTab) {
        await this.tabLabelsManager.addLabel(this.currentTab, labelText, selectedColor);
      }

      this.closeDialog();
    });

    // Handle cancel button
    cancelButton.addEventListener('click', () => {
      this.closeDialog();
    });

    // Handle remove button
    removeButton.addEventListener('click', async () => {
      if (this.currentTab) {
        await this.tabLabelsManager.removeLabel(this.currentTab);
      }
      this.closeDialog();
    });

    // Handle ESC key
    this.dialog.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDialog();
      }
    });

    // Close dialog when clicking outside
    this.dialog.addEventListener('click', (e) => {
      if (e.target === this.dialog) {
        this.closeDialog();
      }
    });
  }

  /**
   * Set up the tab context menu
   */
  setupContextMenu() {
    const tabContextMenu = document.getElementById('tabContextMenu');

    if (!tabContextMenu) {
      console.error('Tab context menu not found');
      return;
    }

    // Create menu items
    const menuSeparator = document.createElement('menuseparator');
    menuSeparator.id = 'zen-tab-label-separator';

    const addLabelItem = document.createElement('menuitem');
    addLabelItem.id = 'zen-tab-label-add';
    addLabelItem.setAttribute('label', 'Add Label...');
    addLabelItem.setAttribute('accesskey', 'L');

    const editLabelItem = document.createElement('menuitem');
    editLabelItem.id = 'zen-tab-label-edit';
    editLabelItem.setAttribute('label', 'Edit Label...');
    editLabelItem.setAttribute('accesskey', 'E');
    editLabelItem.style.display = 'none';

    const removeLabelItem = document.createElement('menuitem');
    removeLabelItem.id = 'zen-tab-label-remove';
    removeLabelItem.setAttribute('label', 'Remove Label');
    removeLabelItem.setAttribute('accesskey', 'R');
    removeLabelItem.style.display = 'none';

    // Add event listeners
    addLabelItem.addEventListener('command', () => this.showLabelDialog());
    editLabelItem.addEventListener('command', () => this.showLabelDialog());
    removeLabelItem.addEventListener('command', () => this.removeCurrentLabel());

    // Insert into context menu
    tabContextMenu.appendChild(menuSeparator);
    tabContextMenu.appendChild(addLabelItem);
    tabContextMenu.appendChild(editLabelItem);
    tabContextMenu.appendChild(removeLabelItem);

    // Update menu items based on whether tab has a label
    tabContextMenu.addEventListener('popupshowing', async () => {
      const tab = TabContextMenu.contextTab || gBrowser.selectedTab;
      this.currentTab = tab;

      const hasLabel = await this.tabLabelsManager.hasLabel(tab);

      if (hasLabel) {
        addLabelItem.style.display = 'none';
        editLabelItem.style.display = '';
        removeLabelItem.style.display = '';
      } else {
        addLabelItem.style.display = '';
        editLabelItem.style.display = 'none';
        removeLabelItem.style.display = 'none';
      }
    });
  }

  /**
   * Show the label dialog
   */
  async showLabelDialog() {
    if (!this.dialog || !this.currentTab) return;

    const labelInput = this.dialog.querySelector('#zen-label-text');
    const customColorInput = this.dialog.querySelector('#zen-custom-color');
    const colorButtons = this.dialog.querySelectorAll('.zen-color-option');
    const previewCircle = this.dialog.querySelector('.zen-label-preview-circle');
    const previewText = this.dialog.querySelector('.zen-label-preview-text');
    const removeButton = this.dialog.querySelector('#zen-label-remove');

    // Check if tab already has a label
    const existingLabel = await this.tabLabelsManager.getLabel(this.currentTab);

    if (existingLabel) {
      labelInput.value = existingLabel.label || '';
      customColorInput.value = existingLabel.color || this.defaultColors[0];
      previewCircle.style.backgroundColor = existingLabel.color || this.defaultColors[0];
      previewText.textContent = existingLabel.label || 'Preview';
      removeButton.style.display = '';

      // Highlight the matching color button if it's a preset
      colorButtons.forEach(btn => {
        if (btn.dataset.color === existingLabel.color) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    } else {
      labelInput.value = '';
      customColorInput.value = this.defaultColors[0];
      previewCircle.style.backgroundColor = this.defaultColors[0];
      previewText.textContent = 'Preview';
      removeButton.style.display = 'none';

      // Activate first color by default
      colorButtons.forEach((btn, index) => {
        if (index === 0) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    this.dialog.showModal();
    labelInput.focus();
  }

  /**
   * Close the label dialog
   */
  closeDialog() {
    if (this.dialog) {
      this.dialog.close();
      this.currentTab = null;
    }
  }

  /**
   * Remove the label from the current tab
   */
  async removeCurrentLabel() {
    if (this.currentTab) {
      await this.tabLabelsManager.removeLabel(this.currentTab);
    }
  }
}

// Export as a singleton
window.TabContextMenuManager = new TabContextMenuManager();
