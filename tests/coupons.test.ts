import request from "supertest"
import { app, server } from "../src/app"

describe("GET /coupons", () => {
    test("should repond with a 404. email is required", async () => {
        const response = await request(app).get("/coupons").send({
            code: "H37VUSZS",
        })
        expect(response.statusCode).toEqual(404)
    })
    test("should repond with a 404. code is required", async () => {
        const response = await request(app).get("/coupons").send({
            customer_email: "abmem@vuec.ps",
        })
        expect(response.statusCode).toEqual(404)
    })
    test("should repond with a 404. combination code email not fount", async () => {
        const response = await request(app).get("/coupons").send({
            code: "H37VUSZZ",
            customer_email: "abmem@vuec.ps",
        })
        expect(response.statusCode).toEqual(404)
    })
    test("should repond with a 200. combination code email fount", async () => {
        const response = await request(app).get("/coupons").send({
            code: "H37VUSZS",
            customer_email: "abmem@vuec.ps",
        })
        expect(response.statusCode).toEqual(200)
    })
})

describe("POST /coupons", () => {
    test("should repond with a 422. coupon code is required", async () => {
        const response = await request(app).post("/coupons")
        expect(response.statusCode).toEqual(422)
    })
    test("should repond with a 422. coupon must be 8 character length", async () => {
        const response = await request(app).post("/coupons").send({
            code: "1234567",
            expires_at: "2099-01-01",
        })
        expect(response.statusCode).toEqual(422)
    })
    test("should repond with a 422. coupon must be 8 character length", async () => {
        const response = await request(app).post("/coupons").send({
            code: "123456789",
            expires_at: "2099-01-01",
        })
        expect(response.statusCode).toEqual(422)
    })
    test("should repond with a 201. coupon created", async () => {
        const response = await request(app).post("/coupons").send({
            code: "12345678",
            expires_at: "2099-01-01",
        })
        expect(response.statusCode).toEqual(201)
    })
})

describe("PATCH /coupons", () => {
    test("should repond with a 422. coupon code is required", async () => {
        const response = await request(app).patch("/coupons")
        expect(response.statusCode).toEqual(422)
    })
    test("should repond with a 422. customer_email is required", async () => {
        const response = await request(app).patch("/coupons").send({
            customer_email: "abmem@vuec.ps",
        })
        expect(response.statusCode).toEqual(422)
    })
    test("should repond with a 422. coupon code and email already used", async () => {
        const response = await request(app).patch("/coupons").send({
            code: "H37VUSZZ",
            customer_email: "abmem@vuec.ps",
        })
        expect(response.statusCode).toEqual(422)
    })
})

describe("DELETE /coupons", () => {
    test("should repond with a 422. coupon code is required", async () => {
        const response = await request(app).delete("/coupons")
        expect(response.statusCode).toEqual(422)
    })
    test("should repond with a 201. coupon deleted correctly", async () => {
        const response = await request(app).delete("/coupons").send({
            code: "12345678",
        })
        expect(response.statusCode).toEqual(201)
    })
})

afterAll(() => {
    server.close()
})
