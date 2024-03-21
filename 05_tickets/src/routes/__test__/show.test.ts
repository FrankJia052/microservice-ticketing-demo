import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose";


it("returns a 404 if the ticket is not found", async() => {
    // 这里测试，正常来讲普通的string作为id，会有新的mongoose错误，不会被捕获
    // 但是我测试，似乎这种错误被修复了
    // 但是这里我们还是用 mongoose 来生成一个合格的id来测试
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404)
});

it("returns the ticket if the ticket is found", async() => {
    const title = "test";
    const price = 6;

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title,
            price
        })
        .expect(201)
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200)
    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
})
