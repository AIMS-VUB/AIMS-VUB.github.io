const owner = "AIMS-VUB";
const repo = "AIMS-VUB.github.io";

const container = document.getElementById("gpu-experiments");
const loading = document.getElementById("loading");

fetch(`https://api.github.com/repos/${owner}/${repo}/issues?labels=experiment&state=open`)
  .then(res => res.json())
  .then(issues => {
    loading.remove();

    if (!issues || issues.length === 0) {
      container.innerHTML = "<p>No GPU experiments scheduled.</p>";
      return;
    }

    let html = "";

    issues.forEach(issue => {
      const map = {};

      // Process each line
      issue.body.split("\n").forEach(line => {
        // Remove leading/trailing whitespace
        line = line.trim();

        // Skip empty lines
        if (!line) return;

        // Match **Field name:** value OR Field name: value
        const match = line.match(/^\**([\w\s\(\)]+)\**:\s*(.*)$/);
        if (match) {
          const key = match[1].trim().toLowerCase().replace(/\s+/g, "_");
          const value = match[2].trim();
          if (value) map[key] = value;
        }
      });

      // Build HTML card
      html += `
        <div class="experiment-card">
          <h3>${map.experiment_name || issue.title}</h3>
          ${map.requested_by ? `<p><strong>Requested by:</strong> ${map.requested_by}</p>` : ""}
          ${map.started_by ? `<p><strong>Started by:</strong> ${map.started_by}</p>` : ""}
          ${map.gpu_machine_s ? `<p><strong>GPU(s):</strong> ${map.gpu_machine_s}</p>` : ""}
          ${map.start_date_time ? `<p><strong>Start:</strong> ${map.start_date_time}</p>` : ""}
          ${map.expected_duration ? `<p><strong>Duration:</strong> ${map.expected_duration}</p>` : ""}
          ${map.description ? `<p><strong>Description:</strong> ${map.description}</p>` : ""}
          <p class="meta"><a href="${issue.html_url}" target="_blank">View on GitHub</a></p>
        </div>
      `;
    });

    container.innerHTML = html;
  })
  .catch(err => {
    console.error("Error loading issues:", err);
    container.innerHTML = "<p>Error loading experiments.</p>";
  });
