
import Annocument from "../components/annocument/Annocument"
import Wrapper from "../components/wrapper/Wrapper"
import Hoodie from '../components/shops/hoodie/Hoodie'

const Pages = ({ addToCart, CartItem, shopItems }) => {
  return (
    <>
      <Hoodie shopItems={shopItems} addToCart={addToCart} />
      <Annocument />
      <Wrapper />
    </>
  )
}

export default Pages