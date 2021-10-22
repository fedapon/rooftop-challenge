import request from 'supertest'
import {app, server} from './app'

describe("GET /stores", () => {

    test("should repond with a 200 status code", async ()=> {
        const response = await request(app).get("/stores")
        expect(response.statusCode).toBe(200)
    })
    test("should repond with json object", async ()=> {
        const response = await request(app).get("/stores")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
    })
    test("count should be 500", async ()=> {
        const response = await request(app).get("/stores")
        expect(response.body.count).toEqual(500)
    })

 })

 afterAll(()=> {
     server.close()
 })