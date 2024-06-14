
import Annocument from "../components/annocument/Annocument"
import Wrapper from "../components/wrapper/Wrapper"
import Pants from "../components/shops/pants/Pants"

const Pages = ({ addToCart, CartItem, shopItems }) => {
  return (
    <>
      <Pants shopItems={shopItems} addToCart={addToCart} />
      <Annocument />
      <Wrapper />
    </>
  )
}

export default Pages