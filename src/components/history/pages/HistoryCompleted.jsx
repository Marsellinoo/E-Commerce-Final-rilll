import React from 'react'
import CompletedMenu from '../menu/CompletedMenu'
import CompletedCard from '../card/CompletedCard'
import '../History.css'

const HistoryCompleted = () => {
    return (
        <section className='delivery-history'>
            <div>
                <CompletedMenu />
                <CompletedCard />
            </div>
        </section>
    )
}

export default HistoryCompleted