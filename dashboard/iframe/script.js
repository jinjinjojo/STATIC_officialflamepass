let index = 0,
    interval = 1000;

const rand = (min, max) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

const animate = star => {
  star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
  star.style.setProperty("--star-top", `${rand(-40, 80)}%`);

  star.style.animation = "none";
  star.offsetHeight;
  star.style.animation = "";
}

for(const star of document.getElementsByClassName("magic-star")) {
  setTimeout(() => {
    animate(star);
    
    setInterval(() => animate(star), 1000);
  }, index++ * (interval / 3))
}

window.onload = function() {
  setTimeout(() => {
  fetch('/prox/uv/uv.config.js')
    .then(response => response.text())
    .then(text => {
      const bareUrlMatch = text.match(/bare: '(.*?)'/);
      const bareUrl = bareUrlMatch ? bareUrlMatch[1] : null; // Extract bareUrl or set to null if not found

      const linkElement = document.getElementById('statusbutton'); // Get the element
      const statusSpan = linkElement.querySelector('span'); // Get the span within

      if (bareUrl) {
        fetch(bareUrl)
          .then(response => response.json())
          .then(data => { // Access response data as JSON
            const language = data.language?.toLowerCase(); // Access language, handle potential missing property

            if (language === 'nodejs') { // Check for 'nodejs' (case-insensitive)
              statusSpan.textContent = 'Status: Operational';
              linkElement.querySelector('i').style.color = 'rgb(15, 209, 57)'; // Set green for operational
            } else {
              statusSpan.textContent = 'Status: Broken (Error Code 2: Server is not a bare server)';
              linkElement.querySelector('i').style.color = 'red'; // Set red for broken
            }
          })
          .catch(() => {
            statusSpan.textContent = 'Status: Broken (Error Code 1: Bare server cannot be reached)';
            linkElement.querySelector('i').style.color = 'red'; // Set red for broken
          });
      } else {
        // Handle case where "bare" URL is not found in the config
        statusSpan.textContent = 'Status: Broken (Error Code 0: Bare URL cannot be found)';
        linkElement.querySelector('i').style.color = 'red'; // Set red for broken
        console.error('Failed to find "bare" URL in config');
        // You can update the element text or icon color here to indicate an error
      }
    })
    .catch(error => {
      statusSpan.textContent = 'Status: Broken (Error Code 9: Error fetching config file)';
      linkElement.querySelector('i').style.color = 'red'; // Set red for broken
      console.error('Error fetching config:', error)}
    );
  }, 1000)
};