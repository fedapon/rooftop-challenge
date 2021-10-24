import request from 'supertest'
import {app, server} from '../src/app'

describe("GET /stores", () => {

    test("should repond with a 200 status code", async ()=> {
        const response = await request(app).get("/stores")
        expect(response.statusCode).toBe(200)
    })
    test("should repond with json object", async ()=> {
        const response = await request(app).get("/stores")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
    })
    test("should repond with a list of stores (10 stores)", async ()=> {
        const response = await request(app).get("/stores")
        expect(response.body.stores.length).toBe(10)
    })
    test("count should be greater than 500", async ()=> {
        const response = await request(app).get("/stores")
        expect(response.body.count).toBeGreaterThanOrEqual(500)
    })
    test("filter using name query string", async ()=> {
        const response = await request(app).get("/stores?name=Service Corp. International")
        expect(response.body.stores[0].name).toBe('Service Corp. International')
    })
  })

  describe("POST /stores", () => {
    test("should respond with a 422 status code. not valid parametes", async ()=> {
        const response = await request(app).post("/stores").send({
            name: 'test',
            address : '',
        })
        expect(response.statusCode).toBe(422)
    })
    test("should respond with a 201 status code. new stores creation", async ()=> {
        const response = await request(app).post("/stores").send({
            name: 'New store',
            address : 'New store address',
        })
        expect(response.statusCode).toBe(201)
    })
  })

  describe("DELETE /stores", () => {
    test("should respond with: id is required as a url param", async ()=> {
        const response = await request(app).delete('/stores')
        expect(response.body.message).toBe('id is required as a url param')
    })
    test("should respond with a 422 status code. try to delete not valid id store", async ()=> {
        const response = await request(app).delete("/stores").send({
            id: 1000
        })
        expect(response.statusCode).toBe(422)
    })
    test("should respond with a 201 status code. store deleted correctly", async ()=> {
        const findResponse = await request(app).get("/stores?name=New store")
        const response = await request(app).delete(`/stores/${findResponse.body.stores[0].id}`)
        expect(response.statusCode).toBe(201)
    })
  })

 afterAll(()=> {
     server.close()
 })