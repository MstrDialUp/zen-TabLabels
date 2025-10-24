// Popup script for Tab Labels extension

// Load and display label statistics
async function loadLabelStats() {
  const result = await browser.storage.local.get('tabLabels');
  const tabLabels = result.tabLabels || {};

  // Count labels
  const labelCounts = new Map();

  for (let tabId in tabLabels) {
    const label = tabLabels[tabId];
    const count = labelCounts.get(label.text) || 0;
    labelCounts.set(label.text, count + 1);

    // Store color for each label
    if (!labelCounts.has(`${label.text}_color`)) {
      labelCounts.set(`${label.text}_color`, label.color);
    }
  }

  // Display labels
  const labelList = document.getElementById('labelList');

  if (labelCounts.size === 0) {
    labelList.innerHTML = '<div class="empty-state">No labels created yet</div>';
  } else {
    labelList.innerHTML = '';

    // Convert to array and sort by count
    const labelArray = [];
    for (let [labelText, count] of labelCounts) {
      if (!labelText.endsWith('_color')) {
        const color = labelCounts.get(`${labelText}_color`);
        labelArray.push({ text: labelText, count: count, color: color });
      }
    }

    labelArray.sort((a, b) => b.count - a.count);

    // Display each label
    labelArray.forEach(label => {
      const labelItem = document.createElement('div');
      labelItem.className = 'label-item';
      labelItem.innerHTML = `
        <span class="label-indicator" style="background-color: ${label.color}"></span>
        <span class="label-text">${label.text}</span>
        <span class="label-count">${label.count} tab${label.count > 1 ? 's' : ''}</span>
      `;
      labelList.appendChild(labelItem);
    });
  }
}

// Load stats when popup opens
loadLabelStats();

// Refresh every second to show updates
setInterval(loadLabelStats, 1000);
