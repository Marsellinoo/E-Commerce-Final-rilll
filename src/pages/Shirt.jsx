
import Annocument from "../components/annocument/Annocument"
import Wrapper from "../components/wrapper/Wrapper"
import Shirt from "../components/shops/shirt/Shirt"

const Pages = ({ addToCart, CartItem, shopItems }) => {
  return (
    <>
      <Shirt shopItems={shopItems} addToCart={addToCart} />
      <Annocument />
      <Wrapper />
    </>
  )
}

export default Pages