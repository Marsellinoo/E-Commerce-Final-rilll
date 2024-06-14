
import Annocument from "../components/annocument/Annocument"
import Wrapper from "../components/wrapper/Wrapper"
import Shoes from '../components/shops/shoes/Shoes'

const Pages = ({ addToCart, CartItem, shopItems }) => {
  return (
    <>
      <Shoes shopItems={shopItems} addToCart={addToCart} />
      <Annocument />
      <Wrapper />
    </>
  )
}

export default Pages