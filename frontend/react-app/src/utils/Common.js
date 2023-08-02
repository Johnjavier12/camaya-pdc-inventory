import React from 'react'

export const currencyFormat = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").toLocaleString();
}

export const ShowIf = ({cond, children, ...props}) => {
  if (!cond) {
    return '';
  }

  return <div {...props}>{children}</div>
}