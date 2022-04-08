import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <main className="App"> 
        <Outlet /> 
        <br />
        *global layout (please edit)
        </main>
    )
}

export default Layout
