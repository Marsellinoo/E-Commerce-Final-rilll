import React from 'react'
import ConfirmedMenu from '../menu/ConfirmedMenu'
import ConfirmedCard from '../card/ConfirmedCard'
import '../History.css'

const HistoryConfirmed = () => {
    return (
        <section className='delivery-history'>
            <div>
                <ConfirmedMenu />
                <ConfirmedCard />
            </div>
        </section>
    )
}

export default HistoryConfirmed