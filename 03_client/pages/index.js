import buildClient from "../API/build-client"

const LandingPage = ({currentUser}) => {
    return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
}

export default LandingPage

LandingPage.getInitialProps = async (context) => {
    const client = buildClient(context)
    const {data} = await client.get("/api/users/currentuser")

    return data
}