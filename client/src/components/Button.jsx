import React from 'react'

const Button = (props) => {
  return (
    <button id={props.id} onClick={props.onClick} className={"bg-blue-900 hover:bg-white hover:text-blue-800 py-2 px-6 rounded-lg font-nunito text-xl transition ease-out duration-300 " + props.className}>{props.content}</button>
  )
}

export default Button