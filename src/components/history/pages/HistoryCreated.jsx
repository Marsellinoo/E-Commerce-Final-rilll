import React from 'react'
import CreateMenu from '../menu/CreateMenu'
import CreateCard from '../card/CreateCard'
import '../History.css'

const HistoryCreated = () => {
  return (
    <section className='delivery-history'>
      <div>
        <CreateMenu />
          <CreateCard />
      </div>
    </section>
  )
}

export default HistoryCreated