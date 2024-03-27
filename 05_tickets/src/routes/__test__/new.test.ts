import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/Ticket"
import { natsWrapper } from "../../nats-wrapper"

// 当测试过程中需要引入nats-wrapper的时候，jest会自动引入一个虚拟的nats-wrapper
// 这个虚拟的nats-wrapper会被定义在 /src/__mocks__/nats-wrapper.ts
it("has a route handler listening to /api/tickets for post request", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({})

    expect(response.status).not.toEqual(404)
})

it("can only be accessed if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({})
        .expect(401);
})

it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({})
    expect(response.status).not.toEqual(401);
})

it("returns an error if an invalid title is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: "",
            price: 10
        }).expect(400)

    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            price: 10
        }).expect(400)
})

it("returns an error if an invalid price is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: "test",
            price: -10
        }).expect(400)

        await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: "test",
        }).expect(400)
})

it("creates a ticket with valid inputs", async () => {
    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: "test",
            price: 6
        }).expect(201)
    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].title).toEqual("test")
    expect(tickets[0].price).toEqual(6)
})

it("publishes an event", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", signin())
        .send({
            title: "test",
            price: 6
        }).expect(201)
    // console.log(natsWrapper)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})