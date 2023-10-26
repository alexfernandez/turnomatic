import {createClient} from 'redis'
import http from 'http'

const hostname = '0.0.0.0'
const port = 7017
const redisHost = '18.100.236.180'
const redisPort = 6379

const server = http.createServer(answer)
const client = await initRedis()

async function answer(request, response) {
	try {
		const paths = request.url.split('/')
		if (paths.length < 3 || paths[0] !== '' || paths[1] != 'turno') {
			response.statusCode = 400
			response.end(JSON.stringify({error: `Invalid URL ${request.url}`}, null, '\t'))
			return
		}
		const id = paths[2]
		const result = await getRedisResult(id)

		response.statusCode = 200
		response.setHeader('Content-Type', 'application/json')
		response.end(JSON.stringify(result, null, '\t'))
	} catch(error) {
		console.error(error)
		response.statusCode = 500
		response.end(JSON.stringify({error}))
	}
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

async function getRedisResult(id) {
	const result = await client.incr(id)
	return {id, turno: result}
}

async function initRedis() {
	return await createClient({url: `redis://${redisHost}:${redisPort}`}).connect()
}

