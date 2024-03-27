import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose"
import { natsWrapper } from "../../nats-wrapper"

it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", signin())
        .send({
            title: "test",
            price: 6
        })
        .expect(404)
})

it("returns a 401 if the the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "test",
            price: 6
        })
        .expect(401)
})

// 把 payload 中的 id 变成随机数，方便测试不同用户。
it("returns a 401 if the user does not own the ticket", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: "test01",
            price: 6
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", signin())
        .send({
            title: "test02",
            price: 6
        })
        .expect(401)
})

it("returns a 400 if the user provideds an invalid title or price", async () => {
    const cookie = signin()
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "test01",
            price: 6
        })
        .expect(201)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 6
        })
        .expect(400)

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "test02",
            price: -6
        })
        .expect(400)
})

it("updates the ticket provided valid inputs", async () => {
    const cookie = signin()
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "test01",
            price: 6
        })
        .expect(201)
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "test02",
            price: 10
        })
        .expect(200)
    
    const updatedResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200)
    
    expect(updatedResponse.body.title).toEqual("test02")
    expect(updatedResponse.body.price).toEqual(10)    
})

it ("publishes an event", async() => {
    const cookie = signin()
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "test01",
            price: 6
        })
        .expect(201)
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "test02",
            price: 10
        })
        .expect(200)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})