import React from 'react'
import ShippedMenu from '../menu/ShippedMenu'
import ShippedCard from '../card/ShippedCard'
import '../History.css'

const HistoryShipped = () => {
    return (
        <section className='delivery-history'>
            <div>
                <ShippedMenu />
                <ShippedCard />
            </div>
        </section>
    )
}

export default HistoryShipped