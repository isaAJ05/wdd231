const params = new URLSearchParams(window.location.search);

document.querySelector("#results").innerHTML = `
<p><strong>Name:</strong> ${params.get("firstName")} ${params.get("lastName")}</p>
<p><strong>Email:</strong> ${params.get("email")}</p>
<p><strong>Phone:</strong> ${params.get("tel")}</p>
<p><strong>Business:</strong> ${params.get("organization")}</p>
<p><strong>Date:</strong> ${params.get("timestamp")}</p>
`;