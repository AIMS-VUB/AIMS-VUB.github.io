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
      // Create object to store fields
      const fields = {
        experiment_name: "",
        requested_by: "",
        started_by: "",
        gpu: "",
        start_time: "",
        duration: "",
        description: ""
      };

      // Parse issue body line by line
      const lines = issue.body.split("\n");
      lines.forEach(line => {
        const index = line.indexOf(":");
        if (index > -1) {
          const key = line.slice(0, index).trim().toLowerCase().replace(/\s/g,"_");
          const value = line.slice(index + 1).trim();
          if (key in fields && value) {
            fields[key] = value;
          }
        }
      });

      html += `
        <div class="experiment-card">
          <h3>${fields.experiment_name || issue.title}</h3>
          <p><strong>Requested by:</strong> ${fields.requested_by || "-"}</p>
          <p><strong>Started by:</strong> ${fields.started_by || "-"}</p>
          <p><strong>GPU:</strong> ${fields.gpu || "-"}</p>
          <p><strong>Start:</strong> ${fields.start_time || "-"}</p>
          <p><strong>Duration:</strong> ${fields.duration || "-"}</p>
          ${fields.description ? `<p><strong>Description:</strong> ${fields.description}</p>` : ""}
          <p class="meta">GitHub: <a href="${issue.html_url}" target="_blank">View Issue</a></p>
        </div>
      `;
    });

    container.innerHTML = html;
  })
  .catch(err => {
    console.error("Error loading issues:", err);
    container.innerHTML = "<p>Error loading experiments.</p>";
  });
