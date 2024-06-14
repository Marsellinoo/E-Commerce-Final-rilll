import React from 'react'
import ReceivedMenu from '../menu/ReceivedMenu'
import ReceivedCard from '../card/ReceivedCard'
import '../History.css'

const HistoryReceived = () => {
    return (
        <section className='delivery-history'>
            <div>
                <ReceivedMenu />
                <ReceivedCard />
            </div>
        </section>
    )
}

export default HistoryReceived