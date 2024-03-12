import "bootstrap/dist/css/bootstrap.css"
import buildClient from "../API/build-client";
import Header from "../components/header";

// 不要用 App 名字，这是关键字
const AppComponent = ({Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
            <Component {...pageProps}/>
        </div>
    )
}

export default AppComponent

// 这里参数改名 appContext, 表示 custom app component 和 page component 的 getInitialProps 参数是不一样的。
AppComponent.getInitialProps = async ( appContext ) => {
    // 这里 ctx 相当于 page component 下 getInitialProps 的 context 参数
    const client = buildClient(appContext.ctx)
    const { data } = await client.get("/api/users/currentuser")

    // 在参数中找到 page component 下 getInitialProps, 一起调用，然后传给子组件
    let pageProps = {}
    if(appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx)
    }
    return {
        // 传递参数，data中包含 currentUser
        pageProps,
        ...data
    }
};