import request from "supertest"
import { app } from "../../app"

// 把 create ticket 逻辑写这里重复利用
const createTicket = () => {
    return request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
        title: "test1",
        price: 6
    })
}

it("can fetch a list of tickets", async () => {
    await createTicket()
    await createTicket()
    await createTicket()

    const response = await request(app)
        .get("/api/tickets")
        .send()
        .expect(200)
    expect(response.body.length).toEqual(3)
})