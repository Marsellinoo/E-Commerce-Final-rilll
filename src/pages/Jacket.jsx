
import Annocument from "../components/annocument/Annocument"
import Wrapper from "../components/wrapper/Wrapper"
import Jackets from '../components/shops/jackets/Jackets'

const Pages = ({ addToCart, CartItem, shopItems }) => {
  return (
    <>
      <Jackets shopItems={shopItems} addToCart={addToCart} />
      <Annocument />
      <Wrapper />
    </>
  )
}

export default Pages