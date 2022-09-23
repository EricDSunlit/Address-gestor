import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { MainContainer } from './styled-components'

function App() {
  return (
    <>
      <Navbar />
      <MainContainer>
        <Home />
      </MainContainer>
    </>
  )
}

export default App
