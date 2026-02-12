const owner = "AIMS-VUB";
const repo = "AIMS-VUB.github.io";

fetch(`https://api.github.com/repos/${owner}/${repo}/issues?labels=experiment&state=open`)
.then(response => response.json())
.then(issues => {

const container = document.getElementById("gpu-experiments");
document.getElementById("loading").remove();

if (issues.length === 0) {

container.innerHTML = "<p>No GPU experiments scheduled.</p>";
return;

}

let html = "";

issues.forEach(issue => {

html += `
<div class="experiment">

<h3>${issue.title}</h3>

<p>${issue.body.replace(/\n/g,"<br>")}</p>

<p class="meta">
Submitted by ${issue.user.login}
</p>

</div>
`;

});

container.innerHTML = html;

});
