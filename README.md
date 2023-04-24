# linklemur-redirect-link


This cloudflare worker is responsible for 2 things. 

1. Redirecting anybody visiting the domain connected to the [cloudflare worker](https://developers.cloudflare.com/workers/). This is done by taking the url pathname as the shortened url identifier and looking it up as a key in [cloudflare kv](https://developers.cloudflare.com/workers/learning/how-kv-works/) and if exist, take the value and use as the redirect link.
2. Creating a new link_visit row in the planetscale DB. 

Should be built and published using [wrangler](https://developers.cloudflare.com/workers/get-started/guide/#1-start-a-new-project-with-wrangler-the-workers-cli). 
