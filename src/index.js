import { connect } from '@planetscale/database'

addEventListener("fetch", (event) => {
	let request = event.request;
	let url = new URL(request.url);
	let path = url.pathname.replace('/', '');

	event.respondWith(handleRedirect(path));
	event.waitUntil(saveVisit(request, path));
})

async function saveVisit(request, path) {
	const config = {
		host: DATABASE_HOST,
		username: DATABASE_USERNAME,
		password: DATABASE_PASSWORD
	};
	const conn = connect(config)
	const getLinkResult = await conn.execute(`
	SELECT id
	FROM links
	WHERE link_key = ?;`, [path]);

	if (getLinkResult.rows.length == 0)
		return;

	let params = [request.headers.get("x-real-ip"),
	request.cf.country,
	request.headers.get("user-agent"),
	request.headers.get("accept-language"),
	request.cf.asOrganization,
	request.cf.timezone,
	request.cf.continent,
	request.cf.latitude,
	request.cf.longitude,
	getLinkResult.rows[0].id];

	const createLinkVisitResult = await conn.execute(`
	insert into link_visits (id, host, country, user_agent, accept_language, organization, timezone, continent, latitude, longitude, link_id, updated_at)
	values (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now());`, params);

	console.log(createLinkVisitResult)
}

async function handleRedirect(path) {
	if (!path)
		return new Response("Missing pathname.");

	let kv = await link.get(path);

	if (!kv)
		return new Response("KV not found");

	let redirectUrl = new URL(kv);

	if (redirectUrl.hostname == "linklemur.com" || redirectUrl.hostname == "www.linklemur.com")
		return new Response("Infinite loop not allowed.");

	return Response.redirect(redirectUrl, 302);
}
