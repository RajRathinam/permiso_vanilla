import React from 'react'

const Footer = () => {
  return (
    <footer className="footer bg-neutral text-neutral-content flex justify-center items-center p-2 z-10 fixed bottom-0">
    <div className="grid-flow-col items-center">
      <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
    </div>
  </footer>
  )
}

export default Footer
