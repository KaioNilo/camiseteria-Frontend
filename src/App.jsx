import './App.css'
import Banner from './components/Banner/index'
import Header from './components/Header/index'
import ProductSection from './components/ProductSection/index'
import Simulation from './components/Simulation/index'
import About from './components/About/index'
import Details from './components/Details/index'
import Footer from './components/Footer/index'

function App() {

  return (
    <>
      <Header />
      <Banner/>
      <ProductSection>
      </ProductSection>
      <Simulation />
      <About />
      <Details />
      <Footer />
    </>
  )
}

export default App;
