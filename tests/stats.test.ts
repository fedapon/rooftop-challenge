import request from 'supertest'
import {app, server} from '../src/app'

describe("GET /stats", () => {

    test("should repond with a 200 status code", async ()=> {
        const response = await request(app).get("/stats")
        expect(response.statusCode).toBe(200)
    })
    test("should repond with json object", async ()=> {
        const response = await request(app).get("/stats")
        expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
    })
    test("should respond with json object that have totalCoupons property", async ()=> {
        const response = await request(app).get("/stats")
        expect(response.body).toHaveProperty('totalCoupons')
    })
    test("should respond with json object that have consumedCoupons property", async ()=> {
        const response = await request(app).get("/stats")
        expect(response.body).toHaveProperty('consumedCoupons')
    })
    test("should respond with json object that have availableCoupons property", async ()=> {
        const response = await request(app).get("/stats")
        expect(response.body).toHaveProperty('availableCoupons')
    })
    test("should respond with json object that have consumedCouponsByDay property", async ()=> {
        const response = await request(app).get("/stats")
        expect(response.body).toHaveProperty('consumedCouponsByDay')
    })
    test("should respond with json object that have consumedCouponsByDay property should be an array", async ()=> {
        const response = await request(app).get("/stats")
        expect(Array.isArray(response.body.consumedCouponsByDay)).toBeTruthy()
    })
  })


afterAll(()=> {
    server.close()
})